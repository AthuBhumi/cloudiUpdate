import React, { useRef, useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = "300px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      // Initialize editor content
      if (value) {
        editorRef.current.innerHTML = value;
      }
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    onChange(content);
    updateToolbarState();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key for proper line breaks
    if (e.key === 'Enter') {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Trigger change
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }
    }
    
    // Handle Ctrl+B, Ctrl+I, Ctrl+U shortcuts
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateToolbarState();
    
    // Trigger change after command
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const updateToolbarState = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const insertImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        execCommand('insertImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    {
      command: 'bold',
      icon: 'B',
      title: 'Bold (Ctrl+B)',
      active: isBold,
      style: { fontWeight: 'bold' }
    },
    {
      command: 'italic',
      icon: 'I',
      title: 'Italic (Ctrl+I)',
      active: isItalic,
      style: { fontStyle: 'italic' }
    },
    {
      command: 'underline',
      icon: 'U',
      title: 'Underline (Ctrl+U)',
      active: isUnderline,
      style: { textDecoration: 'underline' }
    },
    {
      command: 'strikeThrough',
      icon: 'S',
      title: 'Strikethrough',
      style: { textDecoration: 'line-through' }
    },
    {
      command: 'insertUnorderedList',
      icon: '•',
      title: 'Bullet List'
    },
    {
      command: 'insertOrderedList',
      icon: '1.',
      title: 'Numbered List'
    },
    {
      command: 'justifyLeft',
      icon: '⌐',
      title: 'Align Left'
    },
    {
      command: 'justifyCenter',
      icon: '┴',
      title: 'Align Center'
    },
    {
      command: 'justifyRight',
      icon: '¬',
      title: 'Align Right'
    }
  ];

  const headerOptions = [
    { value: '', label: 'Normal' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'h5', label: 'Heading 5' },
    { value: 'h6', label: 'Heading 6' }
  ];

  const handleHeaderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value) {
      execCommand('formatBlock', value);
    } else {
      execCommand('formatBlock', 'div');
    }
  };

  return (
    <div className="custom-rich-editor">
      <div className="editor-toolbar">
        {/* Header Dropdown */}
        <select onChange={handleHeaderChange} className="header-select">
          {headerOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="toolbar-divider"></div>

        {/* Formatting Buttons */}
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            className={`toolbar-btn ${button.active ? 'active' : ''}`}
            title={button.title}
            onClick={() => execCommand(button.command)}
            style={button.style}
          >
            {button.icon}
          </button>
        ))}

        <div className="toolbar-divider"></div>

        {/* Color Pickers */}
        <input
          type="color"
          className="color-picker"
          title="Text Color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
        />
        <input
          type="color"
          className="color-picker"
          title="Background Color"
          onChange={(e) => execCommand('hiliteColor', e.target.value)}
        />

        <div className="toolbar-divider"></div>

        {/* Link and Image */}
        <button
          type="button"
          className="toolbar-btn"
          title="Insert Link"
          onClick={insertLink}
        >
          🔗
        </button>
        <button
          type="button"
          className="toolbar-btn"
          title="Insert Image"
          onClick={handleImageUpload}
        >
          📷
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={insertImage}
        />

        <div className="toolbar-divider"></div>

        {/* Quote and Code */}
        <button
          type="button"
          className="toolbar-btn"
          title="Quote"
          onClick={() => execCommand('formatBlock', 'blockquote')}
        >
          ❝
        </button>
        <button
          type="button"
          className="toolbar-btn"
          title="Code"
          onClick={() => execCommand('formatBlock', 'pre')}
        >
          &lt;/&gt;
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={updateToolbarState}
        onMouseUp={updateToolbarState}
        onFocus={updateToolbarState}
        style={{ minHeight: height }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
