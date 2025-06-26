import React, { useState, useRef } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { ContentBlock } from '../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface DynamicEditorProps {
  content: ContentBlock[];
  onChange: (content: ContentBlock[]) => void;
}

const backendBaseUrl = '';

export const DynamicEditor: React.FC<DynamicEditorProps> = ({ content, onChange }) => {
  const [showImageUpload, setShowImageUpload] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTextBlock = (afterIndex?: number) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
      order: afterIndex !== undefined ? afterIndex + 1 : content.length
    };

    const newContent = [...content];
    if (afterIndex !== undefined) {
      newContent.splice(afterIndex + 1, 0, newBlock);
      // Update order for subsequent blocks
      for (let i = afterIndex + 2; i < newContent.length; i++) {
        newContent[i].order = i;
      }
    } else {
      newContent.push(newBlock);
    }

    onChange(newContent);
  };

  const updateTextBlock = (id: string, newContent: string) => {
    const updatedContent = content.map(block =>
      block.id === id ? { ...block, content: newContent } : block
    );
    onChange(updatedContent);
  };

  const handleContentImageUpload = async (file: File, afterIndex: number) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/blogs/upload-image', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    const backendBaseUrl = '';
    const imageUrl = backendBaseUrl + data.url;
    // Insert a new content block with the image URL
    const imageBlock: ContentBlock = {
      id: Date.now().toString(),
      type: 'image',
      content: imageUrl,
      order: afterIndex + 1
    };
    const newContent = [...content];
    newContent.splice(afterIndex + 1, 0, imageBlock);
    
    // Update order for subsequent blocks
    for (let i = afterIndex + 2; i < newContent.length; i++) {
      newContent[i].order = i;
    }

    onChange(newContent);
    setShowImageUpload(null);
  };

  const removeBlock = (id: string) => {
    const newContent = content.filter(block => block.id !== id);
    // Update order for all blocks
    const reorderedContent = newContent.map((block, index) => ({
      ...block,
      order: index
    }));
    onChange(reorderedContent);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent, blockId: string, blockIndex: number) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      addTextBlock(blockIndex);
    }
  };

  const getImageUrl = (url: string) =>
    url.startsWith('http') ? url : backendBaseUrl + url;

  // Faqat bitta content block (HTML) uchun soddalashtiramiz
  const htmlContent = content.length > 0 ? content[0].content : '';

  const handleChange = (value: string) => {
    onChange([
      {
        id: content.length > 0 ? content[0].id : Date.now().toString(),
        type: 'text',
        content: value,
        order: 0,
      },
    ]);
  };

  if (content.length === 0) {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <button
          type="button"
          onClick={() => addTextBlock()}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="mx-auto h-6 w-6 mb-2" />
          Start writing your blog post...
        </button>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <ReactQuill value={htmlContent} onChange={handleChange} theme="snow" />
    </div>
  );
};