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
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        Количество товаров:{{ totalAmounts }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <cart-item v-for="item in products" :key="item.productId" :item="item"></cart-item>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы посчитаем стоимость доставки на следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ formatTotalSum }} ₽</span>
          </p>

          <router-link class="cart__button button button--primery"
                       type="submit"
                       :to="{ name: 'order' }">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import CartItem from '@/components/CartItem.vue';

export default {
  components: { CartItem },

  setup() {
    const $store = useStore();
    const products = computed(() => $store.getters.cartDetailsProducts);
    const totalSum = computed(() => $store.getters.cartTotalSum);
    const formatTotalSum = computed(() => numberFormat(totalSum.value));
    const totalAmounts = computed(() => $store.getters.cartTotalAmounts);

    const doLoadBasket = () => {
      $store.dispatch('loadBaskets');
    };
    doLoadBasket();
    return {
      products,
      formatTotalSum,
      totalAmounts,
    };
  },
};
</script>
