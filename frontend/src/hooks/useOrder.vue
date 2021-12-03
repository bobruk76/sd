<script>
import axios from 'axios';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import numberFormat from '@/helpers/numberFormat';
import { API_BASE_URL } from '@/config';

export default function () {
  const $router = useRouter();
  const $store = useStore();
  const formFields = ref({});
  const formErrors = ref({});
  const errorMessage = ref(null);
  const deliveries = ref([]);
  const payments = ref([]);
  const deliveryTypeId = ref(null);
  const paymentTypeId = ref(null);
  const fetchDeliveries = () => {
    axios.get(`${API_BASE_URL}/deliveries`)
      .then((response) => {
        deliveries.value = response.data.map((item) => ({
          ...item,
          cutePrice: item.price > 0 ? numberFormat(item.price) : 'бесплатно',
        }));
        deliveryTypeId.value = deliveries.value[0].id;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchPayments = () => {
    axios.get(`${API_BASE_URL}/payments`, {
      params: {
        deliveryTypeId: deliveryTypeId.value,
      },
    })
      .then((response) => {
        payments.value = response.data;
        paymentTypeId.value = payments.value[0].id;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const sendOrder = () => {
    $store.commit('preloaderChangeStatus', true);
    axios.post(`${API_BASE_URL}/orders`, {
      ...formFields.value,
      paymentTypeId: paymentTypeId.value,
      deliveryTypeId: deliveryTypeId.value,
    }, {
      params: {
        deliveryTypeId: deliveryTypeId.value,
      },
    })
      .then((response) => {
        $store.commit('updateOrderInfo', response.data);
        $store.commit('updateOrderId', response.data.id);
        $router.push({ name: 'orderInfo', params: { id: response.data.id } });
      })
      .catch((error) => {
        formErrors.value = error.response.data.error.request || {};
        errorMessage.value = error.response.data.error.message || '';
      })
      .then(() => {
        $store.commit('preloaderChangeStatus', false);
      });
  };
  return {
    formFields,
    formErrors,
    errorMessage,
    deliveries,
    deliveryTypeId,
    payments,
    paymentTypeId,
    fetchDeliveries,
    fetchPayments,
    sendOrder,
  };
}
</script>
