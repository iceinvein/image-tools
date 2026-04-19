import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToolImageTransfer } from "@/provider";

type ImageUploadProps = {
  onImageSelect: (file: File, imageUrl: string) => void;
  acceptedFormats?: string[];
  maxSize?: number;
  className?: string;
};

export function ImageUpload({
  onImageSelect,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSize = 10,
  className = "",
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasHandledTransferRef = useRef(false);
  const onImageSelectRef = useRef(onImageSelect);
  const [error, setError] = useState<string | null>(null);
  const { clearImageTransfer, peekImageTransfer } = useToolImageTransfer();
  const acceptedFormatsKey = acceptedFormats.join(",");
  const acceptedFormatsList = useMemo(
    () => acceptedFormatsKey.split(","),
    [acceptedFormatsKey],
  );

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormatsList.includes(file.type)) {
        return `Unsupported format. Please use: ${acceptedFormatsList
          .map((format) => format.split("/")[1].toUpperCase())
          .join(", ")}`;
      }

      if (file.size > maxSize * 1024 * 1024) {
        return `File too large. Maximum size is ${maxSize}MB`;
      }

      return null;
    },
    [acceptedFormatsList, maxSize],
  );

  useEffect(() => {
    onImageSelectRef.current = onImageSelect;
  }, [onImageSelect]);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setIsProcessing(true);

      setTimeout(() => {
        const imageUrl = URL.createObjectURL(file);
        onImageSelect(file, imageUrl);
        setIsProcessing(false);
      }, 150);
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

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  useEffect(() => {
    if (hasHandledTransferRef.current) return;

    const pendingFile = peekImageTransfer();
    if (!pendingFile) return;

    const validationError = validateFile(pendingFile);
    if (validationError) {
      setError(validationError);
      hasHandledTransferRef.current = true;
      clearImageTransfer();
      return;
    }

    setError(null);
    setIsProcessing(true);

    const timeoutId = window.setTimeout(() => {
      hasHandledTransferRef.current = true;
      const imageUrl = URL.createObjectURL(pendingFile);
      onImageSelectRef.current(pendingFile, imageUrl);
      clearImageTransfer();
      setIsProcessing(false);
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [clearImageTransfer, peekImageTransfer, validateFile]);

  return (
    <div className={className}>
      <Card
        className={`border border-dashed transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
        }`}
      >
        <CardBody
          className="p-12 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Processing...
                </p>
                <p className="mt-1 text-sm text-zinc-500">Loading your image</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                  isDragOver
                    ? "bg-primary/10 text-primary"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {isDragOver ? (
                  <ImageIcon className="h-6 w-6" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
              </div>

              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {isDragOver ? "Drop your image" : "Upload an image"}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Drag and drop, or click to browse
                </p>
                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  You can also paste from clipboard
                </p>
              </div>

              <Button
                size="md"
                color="primary"
                variant="flat"
                onPress={() => inputRef.current?.click()}
                startContent={<ImageIcon className="h-4 w-4" />}
              >
                Choose File
              </Button>

              <input
                ref={inputRef}
                type="file"
                accept={acceptedFormatsList.join(",")}
                onChange={handleFileInput}
                aria-label="Upload image file"
                className="hidden"
              />

              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                {acceptedFormatsList.map((format) => (
                  <span
                    key={format}
                    className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800"
                  >
                    {format.split("/")[1].toUpperCase().replace("+XML", "")}
                  </span>
                ))}
                <span className="mx-1 text-zinc-300 dark:text-zinc-600">|</span>
                <span>Max {maxSize}MB</span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
