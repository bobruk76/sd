<script>
import axios from 'axios';
import { ref } from 'vue';
import numberFormat from '@/helpers/numberFormat';
import { API_BASE_URL } from '@/config';

export default function () {
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
  return {
    deliveries,
    deliveryTypeId,
    payments,
    paymentTypeId,
    fetchDeliveries,
    fetchPayments,
  };
}
</script>
