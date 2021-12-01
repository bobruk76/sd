<script>
import axios from 'axios';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import numberFormat from '@/helpers/numberFormat';
import { API_BASE_URL } from '@/config';

export default function () {
  const $store = useStore();
  const $route = useRoute();
  const productData = ref(null);
  const category = ref(null);
  const fetchProduct = () => {
    $store.commit('preloaderChangeStatus', true);
    axios.get(`${API_BASE_URL}/products/${$route.params.id}`)
      .then((response) => {
        const product = response.data;
        category.value = product.category;
        productData.value = Object.assign(product, {
          productPrice: numberFormat(product.price),
          img: product.preview.file.url,
        });
      })
      .catch((response) => {
        console.log(response);
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
