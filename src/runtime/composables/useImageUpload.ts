import {
  useCompressUpload,
  type useCompressUploadOptions,
} from "./useCompressUpload";

/**
 * Backward compatible alias for image-only uploads.
 * This is just a shortcut for:
 * useCompressUpload({ accept: ['images'], ... })
 */
export function useImageUpload(options: useCompressUploadOptions = {}) {
  return useCompressUpload({
    accept: ["images"],
    ...options,
  });
}
