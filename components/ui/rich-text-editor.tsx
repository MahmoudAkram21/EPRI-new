'use client';

import { SimpleRichTextEditor } from './simple-rich-text-editor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  height = "200px"
}: RichTextEditorProps) {
  // Use the simple rich text editor instead of ReactQuill to avoid SSR issues
  return (
    <SimpleRichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      height={height}
    />
  );
}