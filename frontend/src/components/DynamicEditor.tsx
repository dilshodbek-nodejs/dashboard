import React, { useState, useRef } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { ContentBlock } from '../types';

interface DynamicEditorProps {
  content: ContentBlock[];
  onChange: (content: ContentBlock[]) => void;
}

const backendBaseUrl = 'http://15.235.141.2:4000';

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

    const res = await fetch('http://15.235.141.2:4000/api/blogs/upload-image', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    const backendBaseUrl = 'http://15.235.141.2:4000';
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
    <div className="border border-gray-300 rounded-lg p-4 space-y-4">
      {content.map((block, index) => (
        <div key={block.id} className="group">
          {block.type === 'text' ? (
            <div className="relative">
              <textarea
                value={block.content}
                onChange={(e) => updateTextBlock(block.id, e.target.value)}
                onKeyDown={(e) => handleTextareaKeyDown(e, block.id, index)}
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                placeholder="Write your content here... (Shift+Enter for new paragraph)"
              />
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={getImageUrl(block.content)}
                alt="Blog content"
                className="w-full max-w-2xl mx-auto rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Dynamic action buttons */}
          <div className="flex justify-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => addTextBlock(index)}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
            >
              <Plus size={14} />
              <span>Text</span>
            </button>
            
            <button
              type="button"
              onClick={() => setShowImageUpload(index)}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
            >
              <Upload size={14} />
              <span>Image</span>
            </button>
          </div>

          {/* Image upload modal */}
          {showImageUpload === index && (
            <div className="mt-2 p-4 border-2 border-dashed border-primary-300 rounded-lg bg-primary-50">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-primary-500 mb-2" />
                <label htmlFor={`image-upload-${index}`} className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    Upload an image
                  </span>
                  <input
                    id={`image-upload-${index}`}
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleContentImageUpload(file, index);
                      }
                    }}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                <button
                  type="button"
                  onClick={() => setShowImageUpload(null)}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add content at the end */}
      <div className="flex justify-center space-x-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => addTextBlock()}
          className="flex items-center space-x-1 px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          <span>Add Text</span>
        </button>
      </div>
    </div>
  );
};