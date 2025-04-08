
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple Markdown parser for common elements
  const formatContent = (markdown: string) => {
    const html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
      // Paragraphs
      .replace(/^(?!<[h|l|u])(.*$)/gm, (match) => {
        return match.trim() === '' ? '' : `<p class="mb-4">${match}</p>`;
      })
      // Convert lists properly
      .replace(/<li class="ml-4">(.*?)<\/li>/g, (match, content) => {
        return `<ul class="list-disc mb-4 pl-6"><li class="mb-1">${content}</li></ul>`;
      })
      .replace(/<\/ul><ul class="list-disc mb-4 pl-6">/g, '');

    return html;
  };

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};

export default MarkdownRenderer;
