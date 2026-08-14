import {
  useCompressUpload,
  type UseCompressUploadOptions,
} from "./useCompressUpload";

/**
 * Backward compatible image-only helper
 */
export function useImageUpload(options: UseCompressUploadOptions = {}) {
  return useCompressUpload({
    accept: ["images"],
    ...options,
  });
}
