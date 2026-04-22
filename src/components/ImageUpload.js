import React, { useRef, useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({ 
  label, 
  onImageSelect, 
  onImagesSelect, 
  selectedImage, 
  selectedImages = [],
  multiple = false,
  maxFiles = 10,
  maxSize = 5242880 // 5MB
}) => {
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setErrors([]);

    // Validate file size
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setErrors(prev => [...prev, `${file.name} exceeds ${maxSize/1024/1024}MB limit`]);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (multiple) {
      if (selectedImages.length + validFiles.length > maxFiles) {
        setErrors([`Maximum ${maxFiles} files allowed`]);
        return;
      }
      onImagesSelect([...selectedImages, ...validFiles]);
    } else {
      onImageSelect(validFiles[0]);
    }

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index) => {
    if (multiple) {
      const newImages = selectedImages.filter((_, i) => i !== index);
      onImagesSelect(newImages);
    } else {
      onImageSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {multiple && selectedImages.length > 0 && (
          <span className="ml-2 text-xs text-gray-500">
            ({selectedImages.length}/{maxFiles})
          </span>
        )}
      </label>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        multiple={multiple}
        className="hidden"
      />
      
      {/* Upload area */}
      <div
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-primary-400 hover:bg-gray-50 ${
          (!multiple && selectedImage) || (multiple && selectedImages.length >= maxFiles) 
            ? 'opacity-50 cursor-not-allowed' 
            : 'border-gray-300'
        }`}
      >
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Click to select {multiple ? 'images' : 'an image'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF, WEBP up to {formatFileSize(maxSize)}
        </p>
        {multiple && (
          <p className="mt-1 text-xs text-gray-500">
            Maximum {maxFiles} files
          </p>
        )}
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Preview */}
      {(selectedImage || selectedImages.length > 0) && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {multiple ? 'Selected Images' : 'Preview'}:
          </p>
          <div className="flex flex-wrap gap-4">
            {multiple ? (
              selectedImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-[10px] text-white bg-black bg-opacity-60 px-1 py-0.5 rounded truncate">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-lg"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : selectedImage && (
              <div className="relative group">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="text-[10px] text-white bg-black bg-opacity-60 px-1 py-0.5 rounded truncate">
                    {formatFileSize(selectedImage.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(0)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-lg"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;