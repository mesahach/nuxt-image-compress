import imageCompression from "browser-image-compression";

export interface CompressImageOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
  /**
   * Force output format.
   * If not provided → original format is kept (png stays png, jpeg stays jpeg, etc.)
   */
  fileType?: "image/jpeg" | "image/webp" | "image/png" | string;
  useWebWorker?: boolean;
}

function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/png": "png",
  };
  return map[mime] || "jpg";
}

function updateFileName(originalName: string, mimeType: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const newExt = getExtensionFromMime(mimeType);
  return `${nameWithoutExt}.${newExt}`;
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const {
    maxSizeMB = 1.5,
    maxWidthOrHeight = 1600,
    initialQuality = 0.8,
    fileType, // optional – if undefined, original format is kept
    useWebWorker = true,
  } = options;

  const compressedBlob = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    initialQuality,
    fileType, // undefined = keep original format
    useWebWorker,
  });

  const finalType = compressedBlob.type || file.type;
  const finalName = updateFileName(file.name, finalType);

  return new File([compressedBlob], finalName, {
    type: finalType,
    lastModified: Date.now(),
  });
}
