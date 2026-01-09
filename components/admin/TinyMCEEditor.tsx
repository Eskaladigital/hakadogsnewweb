'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface TinyMCEEditorProps {
  value: string
  onChange: (content: string) => void
  height?: number
}

export default function TinyMCEEditor({ value, onChange, height = 500 }: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null)

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "zrk3s1w79rec2a3r59r0li1sejv9ou010c726epw91pen7kc"}
      onInit={(_evt: any, editor: any) => editorRef.current = editor}
      value={value}
      onEditorChange={onChange}
      init={{
        height: height,
        menubar: true,
        language: 'es',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media link | code | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        images_upload_handler: async (blobInfo: any) => {
          // Aquí iría la lógica para subir imágenes a tu servidor
          // Por ahora retornamos un placeholder
          return new Promise((resolve: any) => {
            resolve('https://via.placeholder.com/800x400')
          })
        }
      }}
    />
  )
}
