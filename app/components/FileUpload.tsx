'use client';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileType?: 'video' | 'image';
}

const FileUpload = ({ onFileSelect, fileType = 'video' }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition ${
        isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    >
      <p className="text-gray-600 mb-2">Drag & Drop your file here</p>
      <p className="text-gray-500 mb-2">or</p>
      <label className="inline-block bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600 transition">
        Browse Files
        <input
          type="file"
          accept={fileType === 'video' ? 'video/*' : 'image/*'}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUpload;
