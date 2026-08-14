import { ref, watch, type Ref } from "vue";
import {
  compressImage,
  type CompressImageOptions,
} from "../utils/compressImage";

export type AcceptType = "images" | string;

export interface UseCompressUploadOptions extends CompressImageOptions {
  accept?: AcceptType | AcceptType[];
  maxSizeMB?: number;
  multiple?: boolean;
  open?: Ref<boolean>;
  onSuccess?: (file: File | File[]) => void;
  onError?: (error: unknown) => void;
  showToasts?: boolean;
}

function normalizeAccept(accept?: AcceptType | AcceptType[]): string[] {
  if (!accept) return ["images"];

  const list = Array.isArray(accept) ? accept : [accept];
  const result: string[] = [];

  for (const item of list) {
    if (item === "images") {
      result.push("image/");
    } else {
      result.push(item);
    }
  }
  return result;
}

function isAccepted(file: File, acceptList: string[]): boolean {
  return acceptList.some((type) => {
    if (type.endsWith("/")) {
      return file.type.startsWith(type);
    }
    return file.type === type;
  });
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

export function useCompressUpload(options: UseCompressUploadOptions = {}) {
  const {
    accept = ["images"],
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

  const acceptList = normalizeAccept(accept);

  const file = ref<File | null>(null);
  const files = ref<File[]>([]);
  const preview = ref<string | null>(null);
  const previews = ref<string[]>([]);
  const isCompressing = ref(false);

  const clear = () => {
    if (preview.value) URL.revokeObjectURL(preview.value);
    previews.value.forEach((url) => URL.revokeObjectURL(url));

    file.value = null;
    files.value = [];
    preview.value = null;
    previews.value = [];
  };

  if (open) {
    watch(open, (isOpen) => {
      if (!isOpen) clear();
    });
  }

  const processFile = async (original: File): Promise<File> => {
    if (isImage(original)) {
      return await compressImage(original, {
        maxSizeMB: 1.5,
        maxWidthOrHeight,
        initialQuality,
        fileType,
        useWebWorker,
      });
    }
    return original;
  };

  const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;

    const selectedFiles = Array.from(target.files);
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (const f of selectedFiles) {
      if (f.size > maxBytes) {
        if (showToasts) console.warn(`File too large. Max ${maxSizeMB}MB`);
        target.value = "";
        onError?.(new Error(`File too large. Max ${maxSizeMB}MB`));
        return;
      }

      if (!isAccepted(f, acceptList)) {
        if (showToasts) console.warn(`File type not allowed: ${f.type}`);
        target.value = "";
        onError?.(new Error(`File type not allowed: ${f.type}`));
        return;
      }
    }

    try {
      isCompressing.value = true;

      const processed: File[] = [];

      for (const selected of selectedFiles) {
        const result = await processFile(selected);
        processed.push(result);
      }

      clear();

      if (multiple) {
        files.value = processed;
        previews.value = processed
          .filter(isImage)
          .map((f) => URL.createObjectURL(f));
        onSuccess?.(processed);
      } else {
        file.value = processed[0];
        if (isImage(processed[0])) {
          preview.value = URL.createObjectURL(processed[0]);
        }
        onSuccess?.(processed[0]);
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
    handleFileSelect,
    clear,
  };
}
