'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { FormImageProps } from '@/app/(main)/activity/components/form-image/FormImage.types';
import { FormImagePreview } from '@/app/(main)/activity/components/form-image-preview';
import { AddImageButton } from '@/shared/components/buttons';
import { INPUT_ERROR_MESSAGE_STYLE } from '@/shared/components/input/input.constants';
import { useShowToast } from '@/shared/store/useToastStore';
import { generateId } from '@/shared/utils/generateId';

const MAX_IMAGE_COUNT = 4;

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
  const isMaxReached = isMultiple && imageFiles.length >= MAX_IMAGE_COUNT;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : null;
    if (!files || files.length === 0) return;

    let filesToAdd = files;
    const remaining = MAX_IMAGE_COUNT - imageFiles.length;

    if (isMultiple && remaining <= 0) {
      showToast({
        theme: 'error',
        message: `이미지는 최대 ${MAX_IMAGE_COUNT}장까지만 등록 가능합니다.`,
      });
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    if (isMultiple && files.length > remaining) {
      showToast({
        theme: 'error',
        message: `${remaining}장만 추가되었습니다. 이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록 가능합니다.`,
      });
      filesToAdd = files.slice(0, remaining);
    }

    const newImageFiles = filesToAdd.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return {
        id: generateId(),
        url,
        file,
      };
    });

    if (!isMultiple && imageFiles.length > 0) {
      URL.revokeObjectURL(imageFiles[0].url);
      objectUrls.current = objectUrls.current.filter(
        (prevUrl) => prevUrl !== imageFiles[0].url
      );
    }

    const updatedFiles = isMultiple
      ? [...imageFiles, ...newImageFiles]
      : newImageFiles;

    setImageFiles(updatedFiles);
    onChange?.(
      isMultiple ? updatedFiles.map((item) => item.file) : updatedFiles[0].file
    );

    if (inputRef.current) inputRef.current.value = '';
  };

  const handleImageDelete = (deleteImageId: string) => {
    const deletedImage = imageFiles.find((image) => image.id === deleteImageId);
    const filteredFiles = imageFiles.filter(
      (image) => image.id !== deleteImageId
    );

    if (deletedImage) {
      URL.revokeObjectURL(deletedImage.url);
      objectUrls.current = objectUrls.current.filter(
        (prevUrl) => prevUrl !== deletedImage.url
      );
    }

    setImageFiles(filteredFiles);
    onChange?.(
      isMultiple
        ? filteredFiles.map((item) => item.file)
        : filteredFiles[0]?.file || null
    );

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid w-full grid-cols-3 gap-3 md:grid-cols-5 2xl:gap-3.5">
        <AddImageButton
          errorId={errorId}
          errorMessage={errorMessage}
          disabled={isMaxReached}
          inputRef={inputRef}
          onDisabledClick={() => {
            showToast({
              theme: 'error',
              message: `이미지는 최대 ${MAX_IMAGE_COUNT}장까지만 등록 가능합니다.`,
            });
          }}
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
        {imageFiles.map((image) => (
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
        <p id={errorId} className={INPUT_ERROR_MESSAGE_STYLE}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
