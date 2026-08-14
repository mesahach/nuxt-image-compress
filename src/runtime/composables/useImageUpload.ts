import { ref, watch, type Ref } from "vue";
import {
  compressImage,
  type CompressImageOptions,
} from "../utils/compressImage";

interface UseImageUploadOptions extends CompressImageOptions {
  /** Validation limit before compression (in MB) */
  maxSizeMB?: number;
  multiple?: boolean;
  open?: Ref<boolean>;
  onSuccess?: (file: File | File[]) => void;
  onError?: (error: unknown) => void;
  showToasts?: boolean;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxSizeMB = 10,
    multiple = false,
    open,
    onSuccess,
    onError,
    showToasts = true,
    maxWidthOrHeight = 1600,
    initialQuality = 0.8,
    fileType,
    useWebWorker = true,
  } = options;

  const file = ref<File | null>(null);
  const files = ref<File[]>([]);
  const preview = ref<string | null>(null);
  const previews = ref<string[]>([]);
  const isCompressing = ref(false);

  const clearImage = () => {
    if (preview.value) URL.revokeObjectURL(preview.value);
    previews.value.forEach((url: string) => URL.revokeObjectURL(url));

    file.value = null;
    files.value = [];
    preview.value = null;
    previews.value = [];
  };

  // Auto clear when dialog closes
  if (open) {
    watch(open, (isOpen) => {
      if (!isOpen) clearImage();
    });
  }

  const handleImageSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;

    const selectedFiles = Array.from(target.files);
    const maxBytes = maxSizeMB * 1024 * 1024;

    // Validate size
    for (const f of selectedFiles) {
      if (f.size > maxBytes) {
        if (showToasts) {
          console.warn(`File too large. Max allowed is ${maxSizeMB}MB.`);
        }
        target.value = "";
        return;
      }
    }

    try {
      isCompressing.value = true;

      const compressedList: File[] = [];

      for (const selected of selectedFiles) {
        const compressed = await compressImage(selected, {
          maxSizeMB: 1.5,
          maxWidthOrHeight,
          initialQuality,
          fileType,
          useWebWorker,
        });
        compressedList.push(compressed);
      }

      clearImage();

      if (multiple) {
        files.value = compressedList;
        previews.value = compressedList.map((f) => URL.createObjectURL(f));
        onSuccess?.(compressedList);
      } else {
        file.value = compressedList[0];
        preview.value = URL.createObjectURL(compressedList[0]);
        onSuccess?.(compressedList[0]);
      }
    } catch (error) {
      console.error(error);
      target.value = "";
      onError?.(error);
    } finally {
      isCompressing.value = false;
    }
  };

  return {
    file,
    files,
    preview,
    previews,
    isCompressing,
    handleImageSelect,
    clearImage,
  };
}
