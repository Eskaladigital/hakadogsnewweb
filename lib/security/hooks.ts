/**
 * Hook personalizado para validación de formularios con sanitización automática
 * Uso en componentes cliente para prevenir XSS y validar inputs
 */

'use client'

import { useState, useCallback } from 'react'
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateUsername,
  validateTextInput,
  validateURL,
  isCommonPassword
} from './validation'

interface ValidationError {
  [key: string]: string
}

interface UseSecureFormOptions {
  onSubmit: (data: Record<string, any>) => Promise<void> | void
  validateOnChange?: boolean
}

export function useSecureForm(options: UseSecureFormOptions) {
  const { onSubmit, validateOnChange = true } = options
  const [errors, setErrors] = useState<ValidationError>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string>('')

  // Obtener token CSRF al montar el componente
  const fetchCSRFToken = useCallback(async () => {
    try {
      const response = await fetch('/api/csrf')
      const data = await response.json()
      setCsrfToken(data.token)
    } catch (error) {
      console.error('Error fetching CSRF token:', error)
    }
  }, [])

  // Validar un campo individual
  const validateField = useCallback((name: string, value: any, type?: string) => {
    let error = ''

    switch (type) {
      case 'email': {
        const result = validateEmail(value)
        if (!result.valid) error = result.error || 'Email inválido'
        return { error, sanitized: result.sanitized }
      }

      case 'phone': {
        const result = validatePhone(value)
        if (!result.valid) error = result.error || 'Teléfono inválido'
        return { error, sanitized: result.sanitized }
      }

      case 'password': {
        const result = validatePassword(value)
        if (!result.valid) error = result.errors[0] || 'Contraseña débil'
        if (isCommonPassword(value)) error = 'Esta contraseña es muy común'
        return { error, sanitized: value }
      }

      case 'username': {
        const result = validateUsername(value)
        if (!result.valid) error = result.error || 'Nombre de usuario inválido'
        return { error, sanitized: result.sanitized }
      }

      case 'url': {
        const result = validateURL(value)
        if (!result.valid) error = result.error || 'URL inválida'
        return { error, sanitized: result.sanitized }
      }

      case 'text':
      default: {
        const result = validateTextInput(value, {
          maxLength: 10000,
          allowHTML: false
        })
        if (!result.valid) error = result.error || 'Entrada inválida'
        return { error, sanitized: result.sanitized }
      }
    }
  }, [])

  // Manejar cambio de campo
  const handleChange = useCallback((
    name: string,
    value: any,
    type?: string
  ) => {
    if (validateOnChange) {
      const { error } = validateField(name, value, type)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }, [validateOnChange, validateField])

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const data: Record<string, any> = {}
      const newErrors: ValidationError = {}

      // Validar y sanitizar todos los campos
      formData.forEach((value, key) => {
        const type = (event.currentTarget.elements.namedItem(key) as HTMLInputElement)?.type
        const { error, sanitized } = validateField(key, value.toString(), type)
        
        if (error) {
          newErrors[key] = error
        } else {
          data[key] = sanitized
        }
      })

      setErrors(newErrors)

      // Si hay errores, no enviar
      if (Object.keys(newErrors).length > 0) {
        setIsSubmitting(false)
        return
      }

      // Añadir token CSRF
      if (csrfToken) {
        data.csrfToken = csrfToken
      }

      // Enviar formulario
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: 'Error al enviar el formulario' })
    } finally {
      setIsSubmitting(false)
    }
  }, [validateField, onSubmit, csrfToken])

  return {
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField,
    fetchCSRFToken,
    csrfToken
  }
}

/**
 * Hook para hacer peticiones seguras con CSRF token
 */
export function useSecureFetch() {
  const [csrfToken, setCsrfToken] = useState<string>('')

  const fetchCSRFToken = useCallback(async () => {
    try {
      const response = await fetch('/api/csrf')
      const data = await response.json()
      setCsrfToken(data.token)
      return data.token
    } catch (error) {
      console.error('Error fetching CSRF token:', error)
      return null
    }
  }, [])

  const secureFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    // Obtener token si no lo tenemos
    let token = csrfToken
    if (!token) {
      token = await fetchCSRFToken() || ''
    }

    // Añadir token CSRF a las peticiones que modifican estado
    const method = options.method?.toUpperCase() || 'GET'
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      options.headers = {
        ...options.headers,
        'x-csrf-token': token,
      }
    }

    return fetch(url, options)
  }, [csrfToken, fetchCSRFToken])

  return {
    secureFetch,
    fetchCSRFToken,
    csrfToken
  }
}

/**
 * Hook para indicador de fortaleza de contraseña
 */
export function usePasswordStrength(password: string) {
  const result = validatePassword(password)
  
  const strengthColor = {
    weak: 'red',
    medium: 'orange',
    strong: 'green'
  }[result.strength]

  const strengthLabel = {
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte'
  }[result.strength]

  return {
    strength: result.strength,
    valid: result.valid,
    errors: result.errors,
    color: strengthColor,
    label: strengthLabel,
    isCommon: isCommonPassword(password)
  }
}
