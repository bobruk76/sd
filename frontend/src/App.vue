<template>
  <body>
    <preloader-component v-show="preloaderActive"></preloader-component>
    <header-block></header-block>
    <router-view :key="routeFullPath"></router-view>
    <footer-block></footer-block>
  </body>
</template>

<style>
@import "./css/style.min.css";
</style>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HeaderBlock from '@/components/HeaderBlock.vue';
import FooterBlock from '@/components/FooterBlock.vue';
import PreloaderComponent from '@/components/PreloaderComponent.vue';

export default {
  components: { HeaderBlock, FooterBlock, PreloaderComponent },
  setup() {
    const $store = useStore();
    const $route = useRoute();
    const routeFullPath = computed(() => $route.fullPath);
    const preloaderActive = computed(() => $store.getters.preloaderActive);
    const doLoadBaskets = () => $store.dispatch('loadBaskets');
    doLoadBaskets();
    return {
      preloaderActive,
      routeFullPath,
    };
  },
};

</script>
