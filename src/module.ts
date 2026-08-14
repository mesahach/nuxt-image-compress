import { defineNuxtModule, addImportsDir, createResolver } from "@nuxt/kit";
import type { ModuleOptions } from "./types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-image-compress",
    configKey: "imageCompress",
  },
  defaults: {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1600,
    initialQuality: 0.8,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Auto-import the composable
    addImportsDir(resolver.resolve("./runtime/composables"));

    // Expose options to runtime config
    nuxt.options.runtimeConfig.public.imageCompress = options;
  },
});
