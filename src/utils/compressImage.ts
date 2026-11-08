/** 업로드 전 사진 축소 기본값: 긴 변 2048px, JPEG 품질 0.82 */
const DEFAULT_MAX_EDGE = 2048;
const JPEG_QUALITY = 0.82;

/**
 * 업로드 전에 사진을 줄여 JPEG 로 다시 만든다.
 * - 휴대폰 원본(수 MB, HEIC 포함)을 수백 KB 로 줄여 업로드·조회를 빠르게 한다.
 * - createImageBitmap 은 EXIF 회전을 반영해 디코딩한다.
 * - 디코딩할 수 없거나(일부 브라우저의 HEIC) 오히려 커지면 원본을 그대로 쓴다.
 */
export async function compressImage(
  file: File,
  maxEdge = DEFAULT_MAX_EDGE,
): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const ratio = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    const context = canvas.getContext('2d');
    if (!context) return file;
    // 투명 PNG 가 JPEG 로 바뀔 때 검게 칠해지지 않도록 흰 배경을 깐다
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );
    if (!blob || (ratio === 1 && blob.size >= file.size)) return file;

    const name = file.name.replace(/\.[^.]+$/, '') || 'photo';
    return new File([blob], `${name}.jpg`, {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    bitmap.close();
  }
}
