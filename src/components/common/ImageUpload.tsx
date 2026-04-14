import React, { useState, useRef, useCallback } from 'react';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string | null;
  required?: boolean;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  preview,
  required = false,
  label = 'Image'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayPreview = preview || localPreview;

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => setLocalPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  }, [onImageSelect]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <label className={styles.label}>
        {label} {required && '*'}
      </label>

      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${displayPreview ? styles.hasPreview : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className={styles.hiddenInput}
          required={required && !displayPreview}
        />

        {displayPreview ? (
          <div className={styles.previewContainer}>
            <img src={displayPreview} alt="Preview" className={styles.preview} />
            <div className={styles.previewOverlay}>
              <span className={styles.changeText}>Click or drag to replace</span>
              <button type="button" className={styles.removeBtn} onClick={handleRemove}>
                ✕ Remove
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.icon}>📷</span>
            <span className={styles.mainText}>
              {isDragging ? 'Drop image here' : 'Drag & drop an image here'}
            </span>
            <span className={styles.subText}>or click to browse</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
