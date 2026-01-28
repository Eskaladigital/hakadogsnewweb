import { createClient } from './supabase/client'

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabase = createClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload file
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { url: null, error: error as Error }
  }
}

/**
 * Upload dog photo
 */
export async function uploadDogPhoto(file: File, dogId: string) {
  return uploadFile(file, 'dogs', `photos/${dogId}`)
}

/**
 * Upload dog gallery image
 */
export async function uploadDogGalleryImage(file: File, dogId: string) {
  return uploadFile(file, 'dogs', `gallery/${dogId}`)
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(file: File, userId: string) {
  return uploadFile(file, 'avatars', userId)
}

/**
 * Upload exercise video
 */
export async function uploadExerciseVideo(file: File, exerciseId: string) {
  return uploadFile(file, 'exercises', `videos/${exerciseId}`)
}

/**
 * Upload exercise thumbnail
 */
export async function uploadExerciseThumbnail(file: File, exerciseId: string) {
  return uploadFile(file, 'exercises', `thumbnails/${exerciseId}`)
}

/**
 * Upload course cover image
 */
export async function uploadCourseCoverImage(file: File, courseId: string) {
  return uploadFile(file, 'course-images', `covers/${courseId}`)
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting file:', error)
    return { success: false, error: error as Error }
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Solo se permiten imágenes JPG, PNG o WEBP'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'La imagen no puede superar los 5MB'
    }
  }

  return { valid: true }
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
  const maxSize = 50 * 1024 * 1024 // 50MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Solo se permiten videos MP4, WEBM o MOV'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El video no puede superar los 50MB'
    }
  }

  return { valid: true }
}

/**
 * Compress image before upload (client-side)
 */
export async function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          'image/jpeg',
          0.8
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}
