export const MEMORY_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/heic';
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
export const MAX_MEMORY_PHOTOS = 8;

export type ArchivePhoto = {
  id: string;
  previewUrl: string;
} & ({ file: File; imageKey?: never } | { imageKey: string; file?: never });

export function validateMemoryImages(files: File[]) {
  if (files.length > MAX_MEMORY_PHOTOS) {
    throw new Error('사진은 최대 8장까지 추가할 수 있어요.');
  }
  for (const file of files) {
    if (!MEMORY_IMAGE_ACCEPT.split(',').includes(file.type)) {
      throw new Error('JPEG, PNG, WebP, HEIC 형식의 사진을 선택해 주세요.');
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
      throw new Error('사진은 0바이트보다 크고 20MB 이하여야 해요.');
    }
  }
}

async function preparePreview(file: File): Promise<string> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // HEIC 디코딩을 지원하지 않는 브라우저에서도 원본은 업로드할 수 있다.
    if (file.type === 'image/heic') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('사진을 읽을 수 없어요.'));
        reader.readAsDataURL(file);
      });
    }
    throw new Error(
      '사진 미리보기를 만들 수 없어요. 다른 사진을 선택해 주세요.',
    );
  }
  try {
    const ratio = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('사진 미리보기를 만들 수 없어요.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.75);
  } finally {
    bitmap.close();
  }
}

export async function prepareArchivePhotos(
  files: File[],
): Promise<ArchivePhoto[]> {
  validateMemoryImages(files);
  return Promise.all(
    files.map(async (file) => ({
      id: crypto.randomUUID(),
      previewUrl: await preparePreview(file),
      file,
    })),
  );
}

export function resolveArchiveImageKeys(
  photos: ArchivePhoto[],
  uploadedKeys: string[],
): string[] {
  if (photos.length === 0) throw new Error('사진을 등록해주세요');
  if (uploadedKeys.length !== photos.filter((photo) => photo.file).length) {
    throw new Error('사진 업로드 정보를 확인할 수 없어요. 다시 시도해 주세요.');
  }
  let nextUpload = 0;
  return photos.map((photo) => {
    const key = photo.file ? uploadedKeys[nextUpload++] : photo.imageKey;
    if (!key) throw new Error('저장할 사진 정보를 확인할 수 없어요.');
    return key;
  });
}
