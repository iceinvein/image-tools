import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image as ImageIcon, Sparkles, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File, imageUrl: string) => void;
  acceptedFormats?: string[];
  maxSize?: number; // in MB
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSize = 10,
  className = "",
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `Unsupported format. Please use: ${acceptedFormats
          .map((format) => format.split("/")[1].toUpperCase())
          .join(", ")}`;
      }

      if (file.size > maxSize * 1024 * 1024) {
        return `File too large. Maximum size is ${maxSize}MB`;
      }

      return null;
    },
    [acceptedFormats, maxSize],
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(file, imageUrl);
    },
    [onImageSelect, validateFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  return (
    <div className={`${className} animate-scale-in`}>
      <Card
        className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 ${
          isDragOver
            ? "scale-[1.02] animate-pulse border-primary bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 shadow-xl"
            : "border-gray-300 hover:scale-[1.01] hover:border-primary/50 hover:shadow-lg dark:border-gray-600 dark:hover:border-primary/50"
        }`}
      >
        {/* Animated background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 transition-opacity duration-300 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 ${isDragOver ? "opacity-100" : "opacity-0"}`}
        />

        <CardBody
          className="relative p-12 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-6">
            {/* Icon with animation */}
            <div className="relative inline-block">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl transition-all duration-300 ${isDragOver ? "scale-150 opacity-40" : "scale-100"}`}
              />
              <div
                className={`relative rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 transition-all duration-300 dark:border-blue-700/50 dark:from-blue-500/20 dark:to-purple-500/20 ${isDragOver ? "rotate-6 scale-110" : "rotate-0 scale-100"}`}
              >
                {isDragOver ? (
                  <Sparkles className="h-12 w-12 animate-pulse text-primary" />
                ) : (
                  <Upload className="h-12 w-12 text-primary" />
                )}
              </div>
            </div>

            <div>
              <h3 className="brand-text-gradient mb-2 font-bold text-2xl">
                {isDragOver ? "Drop it like it's hot! 🔥" : "Upload Your Image"}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Drag and drop your image here, or click to browse
              </p>
            </div>

            <Button
              size="lg"
              className="brand-btn px-8 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              onPress={() => inputRef.current?.click()}
              startContent={
                <ImageIcon className="h-5 w-5 transition-transform group-hover:rotate-12" />
              }
            >
              Choose File
            </Button>

            <input
              ref={inputRef}
              type="file"
              accept={acceptedFormats.join(",")}
              onChange={handleFileInput}
              aria-label="Upload image file"
              className="hidden"
            />

            <div className="flex items-center justify-center gap-2 border-gray-200 border-t pt-4 text-gray-500 text-sm dark:border-gray-700 dark:text-gray-400">
              <div className="flex flex-wrap justify-center gap-2">
                {acceptedFormats.map((format) => (
                  <span key={format} className="brand-chip text-xs">
                    {format.split("/")[1].toUpperCase()}
                  </span>
                ))}
              </div>
              <span className="mx-2">•</span>
              <span className="font-medium">Max {maxSize}MB</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {error && (
        <div className="slide-in-from-top-2 mt-4 animate-in rounded-lg border-red-500 border-l-4 bg-red-50 p-4 text-red-700 duration-300 dark:bg-red-900/20 dark:text-red-400">
          <p className="font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
