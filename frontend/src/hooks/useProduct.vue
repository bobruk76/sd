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
  const productData = ref({});
  const colors = ref([]);
  const currentColorId = ref(0);
  const productOfferId = ref(0);
  const currentOffer = ref({});
  const category = ref({});
  const fetchOffer = (newValue) => {
    const { offers } = productData.value;
    const offer = offers.find((item) => item.id === newValue);
    currentOffer.value = Object.assign(offer, {
      productPrice: numberFormat(offer.price),
    });
  };
  const fetchProduct = () => {
    $store.commit('preloaderChangeStatus', true);
    axios.get(`${API_BASE_URL}/products/${$route.params.id}`)
      .then((response) => {
        const product = response.data;
        category.value = product.category;
        colors.value = product.colors;
        currentColorId.value = product.colors[0].color.id;
        productData.value = Object.assign(product, {
          productPrice: numberFormat(product.price),
          img: product.preview.file.url,
          title: product.mainProp.title,
        });
        productOfferId.value = product.offers[0].id;
        fetchOffer(productOfferId.value);
      })
      .catch(() => {})
      .then(() => {
        $store.commit('preloaderChangeStatus', false);
      });
  };

  const addToCart = ({ currentProductOfferId, colorId, quantity }) => {
    $store.commit('preloaderChangeStatus', true);
    if (quantity > 0) {
      $store.dispatch('addProductToCart', {
        productOfferId: currentProductOfferId,
        colorId,
        quantity,
      })
        .then(() => {
          // productAdded.value = true;
        })
        .catch(() => {})
        .then(() => {
          $store.commit('preloaderChangeStatus', false);
        });
    }
  };
  return {
    product: productData,
    category,
    colors,
    currentColorId,
    currentOffer,
    productOfferId,
    fetchProduct,
    addToCart,
    fetchOffer,
  };
}
</script>
