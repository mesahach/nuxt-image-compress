# nuxt-image-compress

Easy and performant file upload + image compression for Nuxt 3.

Powered by [`browser-image-compression`](https://github.com/Donaldcwl/browser-image-compression).

## Features

- `useFileUpload` – supports images + PDFs + custom MIME types
- `useImageUpload` – simple alias for image-only uploads
- Web Worker support (non-blocking)
- Automatic preview for images
- Smart format handling
- Auto-clear when dialog closes
- Fully typed

## Installation

```bash
npm install nuxt-image-compress
```

## Usage

```ts
<script setup lang="ts">
const { file, files, preview, previews, isCompressing, handleImageSelect, clearImage } = useImageUpload({
  maxSizeMB: 10,
  multiple: false,
  maxWidthOrHeight: 1600,
  initialQuality: 0.8,
  fileType: "image/jpeg",
  useWebWorker: true,
  onSuccess: (result) => {
    console.log("Success:", result);
    form.setFieldValue('image', compressedFile)
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});
</script>

<template>
  <div>
    <input type="file" accept="image/*" @change="handleImageSelect" />
    <button @click="clearImage">Clear</button>

    <div v-if="isCompressing">Compressing...</div>

    <div v-if="file && !multiple">
      <img :src="preview" alt="Preview" />
      <p>Size: {{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
    </div>

    <div v-else-if="files.length > 0 && multiple">
      <div v-for="(f, i) in files" :key="i">
        <img :src="previews[i]" alt="Preview" />
        <p>Size: {{ (f.size / 1024 / 1024).toFixed(2) }} MB</p>
      </div>
    </div>
  </div>
</template>
```

```ts
<script setup lang="ts">
import { useImageUpload } from "nuxt-image-compress";

const { file, files, preview, previews, isCompressing, handleImageSelect, clearImage } = useImageUpload({
  maxSizeMB: 10,
  multiple: false,
  maxWidthOrHeight: 1600,
  initialQuality: 0.8,
  fileType: "image/jpeg",
  useWebWorker: true,
  onSuccess: (result) => {
    console.log("Success:", result);
    form.setFieldValue('image', compressedFile)
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});
</script>

<template>
  <div>
    <input type="file" accept="image/*" @change="handleImageSelect" />
    <button @click="clearImage">Clear</button>

    <div v-if="isCompressing">Compressing...</div>

    <div v-if="file && !multiple">
      <img :src="preview" alt="Preview" />
      <p>Size: {{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
    </div>

    <div v-else-if="files.length > 0 && multiple">
      <div v-for="(f, i) in files" :key="i">
        <img :src="previews[i]" alt="Preview" />
        <p>Size: {{ (f.size / 1024 / 1024).toFixed(2) }} MB</p>
      </div>
    </div>
  </div>
</template>
```

Add the module to your nuxt.config.ts:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-image-compress"],
});
```

More example:

```ts
<script setup lang="ts">
const { preview, isCompressing, handleImageSelect, file } = useImageUpload({
  onSuccess: (compressedFile) => {
    // Example: form.setFieldValue("image", compressedFile)
    console.log(compressedFile);
  },
});
</script>

<template>
  <div>
    <input type="file" accept="image/*" @change="handleImageSelect" />

    <div v-if="isCompressing">Compressing...</div>

    <img v-if="preview" :src="preview" class="max-w-xs rounded" />
  </div>
</template>
```

With Dialog auto-clear:

```ts
<script setup lang="ts">
import { useImageUpload } from "nuxt-image-compress";

const dialogOpen = ref(false);

const { file, preview, isCompressing, handleImageSelect, clearImage } = useImageUpload({
  open: dialogOpen,
  onSuccess: (compressedFile) => {
    console.log(compressedFile);
  },
});
</script>

<template>
  <div>
    <button @click="dialogOpen = true">Open Dialog</button>

    <div v-if="dialogOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="text-lg font-bold mb-4">Upload Image</h2>

        <input type="file" accept="image/*" @change="handleImageSelect" />

        <div v-if="isCompressing" class="mt-2">Compressing...</div>

        <img v-if="preview" :src="preview" class="max-w-xs rounded mt-2" />

        <div class="flex justify-end gap-2 mt-4">
          <button @click="dialogOpen = false">Cancel</button>
          <button @click="clearImage">Clear</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

Options:

| Option           | Type         | Default | Description                                   |
| ---------------- | ------------ | ------- | --------------------------------------------- |
| maxSizeMB        | number       | 10      | Max file size before compression (validation) |
| maxWidthOrHeight | number       | 1600    | Maximum width or height after compression     |
| initialQuality   | number       | 0.8     | Compression quality (0 to 1)                  |
| multiple         | boolean      | false   | Allow multiple files                          |
| open             | Ref<boolean> | -       | Auto clear images when this becomes false     |
| onSuccess        | Function     | -       | Callback after successful compression         |
| onError          | Function     | -       | Callback when an error occurs                 |

### Output Formats

You can control the output format with the `fileType` option:

```ts
useImageUpload({
  fileType: "image/webp", // or "image/jpeg" | "image/png"
});
```

| Format | Value      | Best for                            |
| ------ | ---------- | ----------------------------------- |
| JPEG   | image/jpeg | General use (smallest size)         |
| WebP   | image/webp | Modern browsers (best quality/size) |
| PNG    | image/png  | When you need transparency          |

| Situation                  | Result                                    |
| -------------------------- | ----------------------------------------- |
| No fileType provided       | Keeps original format + correct extension |
| "fileType: ""image/jpeg""" | Forces JPEG + renames to .jpg             |
| "fileType: ""image/webp""" | Forces WebP + renames to .webp            |
| "fileType: ""image/png"""  | Forces PNG + renames to .png              |

example with no expected extension:

```ts
useImageUpload({
  fileType: "image/jpeg",
});
```

If you upload a file named `photo.png` with `fileType: "image/jpeg"`:

- The output will be **JPEG** format
- The filename will be automatically renamed to `photo.jpg`
- The `type` property will be `"image/jpeg"`
- The extension will always match the format you provide

```ts
const {
  file,
  files,
  preview,
  previews,
  isCompressing,
  handleImageSelect,
  clearImage,
} = useImageUpload({
  onSuccess: (result) => {
    console.log("Success:", result);
    // You will get the same file extension as the original file for the compressed file (e.g. if you upload a .png file, you will get a .png file)
    form.setFieldValue("image", compressedFile);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});
```

Version 2 Updates:

- Added `useFileUpload` composable for general file uploads (images, PDFs, etc.)
- Added `accept` option to filter file types
- Added `multiple` option for multiple file selection
- Added `open` option for auto-clearing when dialog closes
- Added `onSuccess` and `onError` callbacks
- Added `showToasts` option for toast notifications
- Added `maxWidthOrHeight` option for maximum width or height
- Added `initialQuality` option for initial compression quality
- Added `fileType` option for output format
- Added `useWebWorker` option for Web Worker support
- Added `clearImage` method for clearing selected files

Examples:

```ts
<script setup lang="ts">
const { preview, isCompressing, handleFileSelect, file } = useFileUpload({
  accept: ["images"], // for images you can remove this part
  onSuccess: (compressedFile) => {
    console.log(compressedFile);
  },
});
</script>


const { file, preview, handleFileSelect } = useFileUpload({
  accept: ["images", "application/pdf"],
  maxSizeMB: 10,
  onSuccess: (f) => {
    form.setFieldValue("proof", f);
  },
});

// Images + PDFs
const { file, preview, handleFileSelect } = useFileUpload({
  accept: ["images", "application/pdf"],
  maxSizeMB: 10,
  onSuccess: (f) => {
    form.setFieldValue("proof", f);
  },
});

<template>
  <input type="file" accept="image/*, application/pdf" @change="handleFileSelect" />
  <div v-if="isCompressing">Compressing...</div>
  <img v-if="preview" :src="preview" class="max-w-xs rounded" />
</template>

// Using the old useImageUpload (still works):

<template>
  <input type="file" accept="image/*" @change="handleFileSelect" />
  <div v-if="isCompressing">Compressing...</div>
  <img v-if="preview" :src="preview" class="max-w-xs rounded" />
</template>

const { preview, handleImageSelect } = useImageUpload({
  onSuccess: (file) => {
    form.setFieldValue("image", file);
  },
});
```

Accept Options:

| Value                               | Description                |
| ----------------------------------- | -------------------------- |
| """images"""                        | All image types (image/\*) |
| """image/jpeg"""                    | Only JPEG                  |
| """image/png"""                     | Only PNG                   |
| """application/pdf"""               | PDF                        |
| "[""images"", ""application/pdf""]" | Images + PDFs              |

Options:

| Option           | Type         | Default                 | Description                                     |
| ---------------- | ------------ | ----------------------- | ----------------------------------------------- |
| accept           | string       | string[],"[""images""]" | Allowed file types                              |
| maxSizeMB        | number       | 10                      | Max file size before processing                 |
| maxWidthOrHeight | number       | 1600                    | Max dimension after compression                 |
| initialQuality   | number       | 0.8                     | Compression quality (0–1)                       |
| fileType         | string       | -                       | Force output format (image/jpeg, image/webp...) |
| multiple         | boolean      | false                   | Allow multiple files                            |
| open             | Ref<boolean> | -                       | Auto clear when dialog closes                   |
| onSuccess        | Function     | -                       | Called after successful processing              |
| onError          | Function     | -                       | Called on error                                 |
| showToasts       | boolean      | true                    | Show toast notifications                        |
| useWebWorker     | boolean      | true                    | Use Web Worker for compression                  |
