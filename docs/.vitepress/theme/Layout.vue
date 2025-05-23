<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { inBrowser, useData, useRouter } from "vitepress";
import { watch } from "vue";
import { redirects } from "./redirects.ts"

const { page } = useData();
const { go } = useRouter();

const redirectMap = Object.entries(redirects);

watch(
  () => page.value.isNotFound,
  (isNotFound) => {
    if (!isNotFound || !inBrowser) return;
    const redirect = redirectMap.find(([from]) =>
      window.location.pathname.startsWith(from),
    );
    if (!redirect) return;
    go(redirect[1]);
  },
  { immediate: true },
);
</script>

<template>
  <DefaultTheme.Layout />
</template>
