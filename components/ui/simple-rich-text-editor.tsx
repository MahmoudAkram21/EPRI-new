'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Link,
  Type
} from 'lucide-react';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

export function SimpleRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  height = "200px"
}: SimpleRichTextEditorProps) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setContent(newValue);
    onChange(newValue);
  };

  const insertFormat = (before: string, after: string = '') => {
    const textarea = document.querySelector(`textarea[data-rich-text="true"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    handleChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertList = (type: 'ul' | 'ol') => {
    const textarea = document.querySelector(`textarea[data-rich-text="true"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = content.substring(0, start).split('\n');
    const currentLine = lines[lines.length - 1];
    
    const listItem = type === 'ul' ? '• ' : '1. ';
    const newText = content.substring(0, start - currentLine.length) + listItem + currentLine + content.substring(start);
    handleChange(newText);
  };

  return (
    <div className={`simple-rich-editor border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormat('**', '**')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormat('*', '*')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormat('_', '_')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormat('# ')}
          title="Header"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertList('ul')}
          title="Bulleted List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertList('ol')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormat('> ')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormat('`', '`')}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormat('[', '](url)')}
          title="Link"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Text Area */}
      <Textarea
        data-rich-text="true"
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 rounded-t-none resize-none focus:ring-0"
        style={{ minHeight: height }}
      />
      
      {/* Preview hint */}
      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 rounded-b-lg border-t">
        Supports Markdown formatting: **bold**, *italic*, # headers, • lists
      </div>
    </div>
  );
}