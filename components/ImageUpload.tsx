'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { ImageBBUploader } from '@/lib/imagebb';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved?: () => void;
  currentImage?: string;
  multiple?: boolean;
  maxImages?: number;
  className?: string;
  label?: string;
}

interface UploadedImage {
  url: string;
  id: string;
}

export default function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  currentImage,
  multiple = false,
  maxImages = 5,
  className = '',
  label = 'Upload Image'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    currentImage ? [{ url: currentImage, id: Date.now().toString() }] : []
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
      const validation = ImageBBUploader.validateImageFile(file, 10); // 10MB limit
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
    }

    // Check if we're exceeding max images
    if (multiple && uploadedImages.length + fileArray.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;
      if (!apiKey || apiKey === 'your_imagebb_api_key_here') {
        alert('ImageBB API key not configured. Please add your API key to .env.local file.');
        return;
      }

      const uploader = new ImageBBUploader();
      
      for (const file of fileArray) {
        const response = await uploader.uploadImage(file, `techpinik_${Date.now()}`);
        const newImage = {
          url: response.data.display_url,
          id: response.data.id
        };

        if (multiple) {
          setUploadedImages(prev => [...prev, newImage]);
        } else {
          setUploadedImages([newImage]);
        }
        
        onImageUploaded(response.data.display_url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {multiple && ` (Max ${maxImages} images)`}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        } ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={uploading ? undefined : openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />

        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 max-w-xs'}`}>
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt="Uploaded image"
                    fill
                    className="object-cover"
                  />
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(image.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Image URL Display */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={image.url}
                    readOnly
                    className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(image.url);
                    }}
                    title="Click to copy URL"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload More Button (for multiple images) */}
      {multiple && uploadedImages.length > 0 && uploadedImages.length < maxImages && (
        <button
          onClick={openFileDialog}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center">
            <Upload className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Add More Images</span>
          </div>
        </button>
      )}
    </div>
  );
}
