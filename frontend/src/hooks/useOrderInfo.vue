<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { API_BASE_URL } from '@/config';

export default function () {
  const $route = useRoute();
  const orderId = computed(() => $route.params.id);
  const $store = useStore();
  const orderInfo = ref({});
  const basketItems = ref([]);
  const totalQuantity = ref(0);
  const totalSum = ref(0);
  const cuteDeliveryType = ref(null);
  const deliveryPrice = ref(0);
  const orders = computed(() => (('orders' in localStorage) ? localStorage.getItem('orders')
    .split(',') : $store.state.orderId) || []);

  const fetchOrder = () => {
    $store.commit('preloaderChangeStatus', true);
    return axios.get(`${API_BASE_URL}/orders/${orderId.value}`, {
      params: {
        userAccessKey: $store.state.userKey,
      },
    })
      .then((response) => {
        const responseData = response.data;
        basketItems.value = responseData.basket.items.map((item) => ({
          ...item,
          title: item.productOffer.title,
        }));
        totalQuantity.value = basketItems.value.reduce((count, item) => count + item.quantity, 0);
        orderInfo.value = responseData;
        totalSum.value = responseData.totalPrice;
        cuteDeliveryType.value = `${responseData.deliveryType.title}: ${responseData.deliveryType.price}₽`;
        deliveryPrice.value = responseData.deliveryType.price;
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        $store.commit('preloaderChangeStatus', false);
      });
  };
  onMounted(() => {
    fetchOrder();
  });

  return {
    orders,
    orderInfo,
    basketItems,
    totalQuantity,
    totalSum,
    cuteDeliveryType,
    deliveryPrice,
  };
}
</script>
