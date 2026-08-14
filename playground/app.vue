<script setup lang="ts">
const { preview, isCompressing, handleFileSelect, file } = useFileUpload({
  accept: ["images", "application/pdf"],
  maxSizeMB: 10,
  onSuccess: (result) => {
    console.log("Success:", result);
  },
});

const getFileUrl = (f: File) => URL.createObjectURL(f);
</script>

<template>
  <div class="p-10 space-y-6 max-w-lg">
    <div>
      <h1 class="text-2xl font-bold">nuxt-image-compress</h1>
      <p class="text-gray-500">Playground</p>
    </div>

    <input
      type="file"
      accept="image/*,application/pdf"
      class="block w-full text-sm"
      @change="handleFileSelect"
    />

    <div v-if="isCompressing" class="text-blue-600 font-medium">
      Processing file...
    </div>

    <div v-if="file" class="space-y-3">
      <!-- Image Preview -->
      <div v-if="preview">
        <img
          :src="preview"
          alt="Preview"
          class="max-w-full rounded-lg border shadow-sm"
        />
      </div>

      <!-- PDF Preview -->
      <div v-else-if="file.type === 'application/pdf'" class="space-y-3">
        <div class="flex items-center gap-3 p-4 border rounded-lg bg-muted/40">
          <!-- PDF SVG Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-red-500"
          >
            <path
              d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            />
            <polyline points="14 2 14 8 20 8" />
            <path
              d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"
            />
            <path
              d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"
            />
          </svg>

          <div>
            <p class="font-medium">{{ file.name }}</p>
            <p class="text-sm text-muted-foreground">
              PDF • {{ (file.size / 1024).toFixed(1) }} KB
            </p>
          </div>
        </div>

        <!-- PDF Embed -->
        <iframe :src="getFileUrl(file)" class="w-full h-96 border rounded-lg" />
      </div>

      <!-- File info -->
      <p class="text-sm text-gray-600">
        {{ file.name }} — {{ (file.size / 1024).toFixed(1) }} KB
      </p>
    </div>
  </div>
</template>
