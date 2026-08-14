<script setup lang="ts">
const { preview, isCompressing, handleImageSelect, file } = useImageUpload({
  maxSizeMB: 10,
  multiple: false,
  maxWidthOrHeight: 1600,
  initialQuality: 0.8,
  //   fileType: "image/jpeg",
  useWebWorker: true,
  onSuccess: (result) => {
    console.log("Success:", result);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});
</script>

<template>
  <div class="p-10 space-y-6 max-w-lg">
    <div>
      <h1 class="text-2xl font-bold">nuxt-image-compress</h1>
      <p class="text-gray-500">Playground</p>
    </div>

    <input
      type="file"
      accept="image/*"
      class="block w-full text-sm"
      @change="handleImageSelect"
    />

    <div v-if="isCompressing" class="text-blue-600 font-medium">
      Compressing image...
    </div>

    <div v-if="preview" class="space-y-2">
      <img
        :src="preview"
        alt="Preview"
        class="max-w-full rounded-lg border shadow-sm"
      />
      <p v-if="file" class="text-sm text-gray-600">
        {{ file.name }} — {{ (file.size / 1024).toFixed(1) }} KB
      </p>
    </div>
  </div>
</template>
