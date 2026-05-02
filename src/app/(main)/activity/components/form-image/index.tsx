'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { FormImageProps } from '@/app/(main)/activity/components/form-image/FormImage.types';
import { FormImagePreview } from '@/app/(main)/activity/components/form-image-preview';
import { AddImageButton } from '@/shared/components/buttons';
import { useShowToast } from '@/shared/store/useToastStore';

export function FormImage({
  id,
  errorMessage,
  isMultiple = false,
  onChange,
  ...props
}: FormImageProps) {
  const [imageFiles, setImageFiles] = useState<
    Array<{ id: string; url: string; file: File }>
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);

  const showToast = useShowToast();

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : null;
    if (!files) return;

    if (isMultiple && imageFiles.length + files.length > 4) {
      showToast({
        theme: 'error',
        message: '이미지는 최대 4장까지만 등록 가능합니다.',
      });
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    const newImageFiles = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return {
        id: `${file.name} - ${Date.now()}`,
        url,
        file,
      };
    });

    setImageFiles((prev) => {
      const updatedFiles = isMultiple
        ? [...prev, ...newImageFiles]
        : [...newImageFiles];

      onChange?.(
        isMultiple
          ? updatedFiles.map((item) => item.file)
          : updatedFiles[0].file
      );
      return updatedFiles;
    });

    if (inputRef.current) inputRef.current.value = '';
  };

  const handleImageDelete = (deleteImageId: string) => {
    setImageFiles((prev) => {
      const filteredFiles = prev.filter((image) => image.id !== deleteImageId);

      const deletedImage = prev.find((image) => image.id === deleteImageId);
      if (deletedImage) URL.revokeObjectURL(deletedImage.url);

      onChange?.(
        isMultiple
          ? filteredFiles.map((item) => item.file)
          : filteredFiles[0]?.file || null
      );

      return filteredFiles;
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    const urlsToRevoke = objectUrls.current;

    return () => {
      urlsToRevoke.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid w-full grid-cols-3 gap-3 md:grid-cols-5 2xl:gap-3.5">
        <AddImageButton
          id={inputId}
          errorId={errorId}
          errorMessage={errorMessage}
        />
        <input
          type="file"
          id={inputId}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          ref={inputRef}
          multiple={isMultiple}
          {...props}
        />
        {imageFiles &&
          imageFiles.map((image) => (
            <div className="relative aspect-square w-full" key={image.id}>
              <FormImagePreview
                imageUrl={image.url}
                imageId={image.id}
                onImageDelete={handleImageDelete}
              />
            </div>
          ))}
      </div>

      {errorMessage && (
        <p id={errorId} className="typo-lg-regular text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
