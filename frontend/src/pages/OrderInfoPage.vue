<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за выбор нашего магазина. На Вашу почту придет письмо с деталями заказа.
            Наши менеджеры свяжутся с Вами в течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <cart-block :products="basketItems"
                    :total-sum="totalSum"
                    :total-amounts="totalQuantity"
                    :cute-delivery-type="cuteDeliveryType"
                    :deliveryPrice="deliveryPrice"
        >
          <p></p>
        </cart-block>
      </form>
      <ul>
        <li v-for="order in orders" :key="order">
          <router-link :to="{ name: 'orderInfo', params: { id: order } }">
            №{{ order }}
          </router-link>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import CartBlock from '@/components/CartBlock.vue';
import useOrderInfo from '@/hooks/useOrderInfo.vue';

export default {
  components: { CartBlock },
  setup() {
    const {
      orders,
      orderInfo,
      basketItems,
      totalQuantity,
      totalSum,
      cuteDeliveryType,
      deliveryPrice,
    } = useOrderInfo();
    return {
      orders,
      orderInfo,
      basketItems,
      totalQuantity,
      totalSum,
      cuteDeliveryType,
      deliveryPrice,
    };
  },
};
</script>
