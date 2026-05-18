'use client';

import { useId, useRef, useState } from 'react';
import { postActivityImage } from '@/app/(main)/activity/apis/activities';
import { FormImageProps } from '@/app/(main)/activity/components/form-image/formImage.types';
import { FormImagePreview } from '@/app/(main)/activity/components/form-image-preview';
import { AddImageButton } from '@/shared/components/buttons';
import { INPUT_ERROR_MESSAGE_STYLE } from '@/shared/components/input/input.constants';
import { useShowToast } from '@/shared/store/useToastStore';
import { cn } from '@/shared/utils/cn';
import { generateId } from '@/shared/utils/generateId';

const MAX_IMAGE_COUNT = 4;

export function FormImage({
  id,
  errorMessage,
  isMultiple = false,
  onChange,
  value,
  ...props
}: FormImageProps) {
  const [imageFiles, setImageFiles] = useState<
    Array<{ id: string; url: string }>
  >(() => {
    if (!value) return [];

    const initialUrls = Array.isArray(value) ? value : [value];

    return initialUrls
      .filter((url) => typeof url === 'string' && url.trim() !== '')
      .map((url) => ({
        id: generateId(),
        url,
      }));
  });
  const [isPending, setIsPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = useShowToast();

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const isMaxReached = isMultiple && imageFiles.length >= MAX_IMAGE_COUNT;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPending) return;

    const files = e.target.files ? Array.from(e.target.files) : null;
    if (!files || files.length === 0) return;

    let filesToAdd = files;
    const remaining = MAX_IMAGE_COUNT - imageFiles.length;

    // [다중 업로드] 남은 슬롯이 없는 경우 업로드 차단
    if (isMultiple && remaining <= 0) {
      showToast({
        theme: 'error',
        message: `이미지는 최대 ${MAX_IMAGE_COUNT}장까지만 등록 가능합니다.`,
      });
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    // [다중 업로드] 남은 슬롯보다 많은 파일을 올린 경우 넘치는 파일 차단
    if (isMultiple && files.length > remaining) {
      showToast({
        theme: 'error',
        message: `${remaining}장만 추가되었습니다. 이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록 가능합니다.`,
      });
      filesToAdd = files.slice(0, remaining);
    }

    try {
      setIsPending(true);
      // S3 업로드 병렬 요청
      const results = await Promise.allSettled(
        filesToAdd.map((file) => postActivityImage(file))
      );

      const successfulUrls: string[] = [];
      const failedFileNames: string[] = [];

      // 성공한 URL과 실패한 파일명 분류
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulUrls.push(result.value.activityImageUrl);
        } else {
          failedFileNames.push(filesToAdd[index].name);
        }
      });

      // 실패한 파일이 있을 경우 에러 토스트 표시
      if (failedFileNames.length > 0) {
        const message =
          failedFileNames.length === 1
            ? `${failedFileNames[0]} 업로드에 실패했습니다.`
            : `${failedFileNames[0]} 외 ${failedFileNames.length - 1}장 업로드에 실패했습니다.`;

        showToast({
          theme: 'error',
          message,
        });
      }

      // 성공한 이미지가 하나도 없다면 상태 업데이트 없이 종료
      if (successfulUrls.length === 0) return;

      // 성공한 이미지들을 객체 형태로 변환 및 로컬 상태 업데이트
      const newImageFiles = successfulUrls.map((url) => ({
        id: generateId(),
        url,
      }));

      const updatedFiles = isMultiple
        ? [...imageFiles, ...newImageFiles]
        : newImageFiles;

      setImageFiles(updatedFiles);

      // react-hook-form 상태 동기화
      onChange?.(
        isMultiple ? updatedFiles.map((item) => item.url) : updatedFiles[0].url
      );
    } catch (error) {
      console.error('이미지 처리 중 치명적 오류:', error);
      showToast({
        theme: 'error',
        message: '이미지 처리 중 예기치 못한 오류가 발생했습니다.',
      });
    } finally {
      setIsPending(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleImageDelete = (deleteImageId: string) => {
    const filteredFiles = imageFiles.filter(
      (image) => image.id !== deleteImageId
    );

    setImageFiles(filteredFiles);

    onChange?.(
      isMultiple
        ? filteredFiles.map((item) => item.url)
        : filteredFiles[0]?.url || ''
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid w-full grid-cols-3 gap-3 md:grid-cols-5 2xl:gap-3.5">
        <AddImageButton
          errorId={errorId}
          errorMessage={errorMessage}
          disabled={isMaxReached || isPending}
          inputRef={inputRef}
          onDisabledClick={() => {
            if (isPending) return;
            showToast({
              theme: 'error',
              message: `이미지는 최대 ${MAX_IMAGE_COUNT}장까지만 등록 가능합니다.`,
            });
          }}
          isPending={isPending}
        />
        <input
          type="file"
          id={inputId}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          ref={inputRef}
          multiple={isMultiple}
          disabled={isPending}
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
        <p id={errorId} className={cn(INPUT_ERROR_MESSAGE_STYLE, 'mt-0')}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
