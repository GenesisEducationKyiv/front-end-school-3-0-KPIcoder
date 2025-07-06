import { useState, useRef, DragEvent, ChangeEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Upload, File as FileIcon } from 'lucide-react';

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string[];
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
  icon?: ReactNode;
  dragActiveClassName?: string;
  dragInactiveClassName?: string;
  hasFileClassName?: string;
  children?: ReactNode;
  renderFile?: (file: File) => ReactNode;
}

export function FileUpload({
  value,
  onChange,
  accept = ['*/*'],
  multiple = false,
  maxSize,
  className,
  icon = <Upload className="h-10 w-10 text-muted-foreground/70" />,
  dragActiveClassName = 'border-primary bg-primary/5',
  dragInactiveClassName = 'border-muted-foreground/20 hover:bg-muted/50',
  hasFileClassName = 'bg-muted/20',
  children,
  renderFile,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Handle single file upload
    if (!multiple) {
      const file = files[0];

      // Check file size if maxSize is specified
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File size exceeds the maximum limit of ${maxSize}MB.`);
        return;
      }

      onChange(file);
      return;
    }

    // Handle multiple files (if needed in the future)
    // Currently not fully implemented since it returns a single file
    const validFiles = Array.from(files).filter((file) => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onChange(validFiles[0]); // Currently only using the first file
    }
  };

  // Handle manual file selection via input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };

  // Handle clicking on upload area
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
        isDragging ? dragActiveClassName : dragInactiveClassName,
        value ? hasFileClassName : '',
        className
      )}
      onClick={handleUploadAreaClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept.join(',')}
        multiple={multiple}
        onChange={handleFileChange}
      />

      {!value ? (
        children || (
          <div className="flex flex-col items-center gap-2">
            {icon}
            <p className="text-sm text-muted-foreground font-medium">Drag & drop file here or click to browse</p>
          </div>
        )
      ) : renderFile ? (
        renderFile(value)
      ) : (
        <div className="flex items-center justify-center">
          <FileIcon className="h-6 w-6 text-primary mr-2" />
          <span className="text-sm font-medium">{value.name}</span>
        </div>
      )}
    </div>
  );
}
