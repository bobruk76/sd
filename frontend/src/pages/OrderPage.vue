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
        Корзина
      </h1>

      <span class="content__info">
        Количество товаров:{{ totalAmounts }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" method="POST"
            @submit.prevent="sendOrder"
      >
        <div class="cart__field">
          <div class="cart__data">

            <input-form-field
              v-model="formFields.name"
              :error="formErrors.name"
              placeholder="Введите ваше полное имя"
              title="ФИО"
            >
            </input-form-field>

            <input-form-field
              v-model="formFields.address"
              :error="formErrors.address"
              placeholder="Введите ваш адрес"
              title="Адрес доставки"
            >
            </input-form-field>

            <input-form-field
              v-model="formFields.phone"
              :error="formErrors.phone"
              placeholder="Введите ваш телефон"
              title="Телефон"
              type="tel"
            >
            </input-form-field>

            <input-form-field
              v-model="formFields.email"
              :error="formErrors.email"
              placeholder="Введи ваш Email"
              title="Email"
              type="email"
            >
            </input-form-field>

            <textarea-form-field
              v-model="formFields.comments"
              :error="formErrors.comments"
              placeholder="Ваши пожелания"
              title="Комментарий к заказу"
            >
            </textarea-form-field>

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="delivery in deliveries" :key="delivery.id">
                <label class="options__label">
                  <input class="options__radio sr-only"
                         type="radio"
                         name="delivery"
                         :value="delivery.id"
                         v-model="deliveryTypeId"
                         :checked="delivery.id === deliveryTypeId"
                  >
                  <span class="options__value">
                    {{ delivery.title }} <b>{{ delivery.cutePrice }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="payment in payments" :key="payment.id">
                <label class="options__label">
                  <input class="options__radio sr-only"
                         type="radio"
                         name="pay"
                         :value="payment.id"
                         v-model="paymentTypeId"
                         :checked="payment.id===paymentTypeId"
                  >
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <cart-block :products="products" :total-sum="totalSum" :total-amounts="totalAmounts">
          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </cart-block>

        <div class="cart__error form__error-block" v-show="errorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ errorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>

</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import InputFormField from '@/components/InputFormField.vue';
import TextareaFormField from '@/components/TextareaFormField.vue';
import CartBlock from '@/components/CartBlock.vue';
import useOrder from '@/hooks/useOrder.vue';

export default {
  components: { InputFormField, TextareaFormField, CartBlock },
  setup() {
    const $store = useStore();
    const products = computed(() => $store.getters.cartDetailsProducts || []);
    const totalAmounts = computed(() => $store.getters.cartTotalAmounts || 0);
    const totalSum = computed(() => $store.getters.cartTotalSum || 0);
    const {
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
    } = useOrder();
    const fetchBasket = () => {
      $store.dispatch('loadBaskets');
    };
    fetchBasket();
    fetchDeliveries();
    fetchPayments();
    watch(deliveryTypeId, fetchPayments);
    return {
      formFields,
      formErrors,
      totalAmounts,
      totalSum,
      errorMessage,
      products,
      deliveries,
      payments,
      paymentTypeId,
      deliveryTypeId,
      sendOrder,
    };
  },
};
</script>
