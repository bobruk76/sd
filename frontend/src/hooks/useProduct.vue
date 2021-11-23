<script>
import axios from 'axios';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import numberFormat from '@/helpers/numberFormat';
import { API_BASE_URL } from '@/config';

export default function () {
  const $store = useStore();
  const $route = useRoute();
  const productData = ref(null);
  const category = computed(() => productData.value.category);

  const fetchProduct = () => {
    $store.commit('preloaderChangeStatus', true);
    axios.get(`${API_BASE_URL}/products/${$route.params.id}`)
      .then((response) => {
        const product = response.data;
        productData.value = Object.assign(product, {
          productPrice: numberFormat(product.price),
          img: product.image.file.url,
        });
      })
      .catch(() => {
      })
      .then(() => {
        $store.commit('preloaderChangeStatus', false);
      });
  };
  fetchProduct();
  return {
    product: productData,
    category,
    fetchProduct,
  };
}
</script>
