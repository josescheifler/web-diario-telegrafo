'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Editor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false, // Esta línea soluciona el error de Next.js
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4 text-gray-800',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className="border rounded outline-none bg-white focus-within:ring-2 focus-within:ring-[#D4AF37]">
      <div className="bg-gray-50 p-2 border-b flex gap-2 rounded-t">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="px-3 py-1 font-bold border rounded bg-white hover:bg-gray-100">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-3 py-1 italic border rounded bg-white hover:bg-gray-100">I</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}