import { useFileUpload, type UseFileUploadOptions } from "./useFileUpload";

/**
 * Backward compatible alias for image-only uploads.
 * This is just a shortcut for:
 * useFileUpload({ accept: ['images'], ... })
 */
export function useImageUpload(options: UseFileUploadOptions = {}) {
  return useFileUpload({
    accept: ["images"],
    ...options,
  });
}
