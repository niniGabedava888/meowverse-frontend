<script setup lang="ts">
import CozyScene from "@/components/CozyScene.vue";

defineProps<{ catEyesClosed?: boolean }>();
</script>

<template>
  <div class="grid min-h-screen bg-[#f6efe0] lg:grid-cols-2">
    <main class="flex items-center justify-center px-6 py-12 sm:px-12">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <aside class="relative hidden overflow-hidden lg:block" aria-hidden="true">
      <CozyScene
        class="absolute inset-0 h-full w-full"
        :eyes-closed="catEyesClosed"
      />
    </aside>
  </div>
</template>
