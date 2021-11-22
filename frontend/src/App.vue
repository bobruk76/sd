<template>
  <body>
    <preloader-component v-show="preloaderActive"></preloader-component>
    <header-block></header-block>
    <router-view></router-view>
    <footer-block></footer-block>
  </body>
</template>

<style>
@import "./css/style.min.css";
</style>

<script>
import { useStore } from 'vuex';
import HeaderBlock from '@/components/HeaderBlock.vue';
import FooterBlock from '@/components/FooterBlock.vue';
import PreloaderComponent from '@/components/PreloaderComponent.vue';

export default {
  components: { HeaderBlock, FooterBlock, PreloaderComponent },
  setup() {
    const store = useStore();
    const preloaderActive = store.getters.preloaderActive;
    const doLoadBaskets = () => store.dispatch('loadBaskets');
    doLoadBaskets();
    return {
      preloaderActive,
    };
  },
  // methods: {
  //   ...mapActions(['loadBaskets']),
  // },
  // computed: {
  //   ...mapGetters(['preloaderActive']),
  // },
  //
  // created() {
  //   this.loadBaskets();
  // },
};

</script>
