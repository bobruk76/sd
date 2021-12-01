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
          <router-link
            class="breadcrumbs__link"
            :to="{ name: 'main', params : { categoryId: category.id } }">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570"
               :src="product.img"
               :alt="product.title">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ currentOffer.id }}</span>
        <h2 class="item__title">
          {{ currentOffer.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST">
            <b class="item__price">
              {{ currentOffer.productPrice }} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">

                <li class="colors__item" v-for="item in product.colors" :key="item.color.id">
                  <label class="colors__label">
                    <input class="colors__radio sr-only"
                           type="radio"
                           name="color-item"
                           :value="item.color.id"
                           v-model="currentColorId"
                           checked="{{ item.color.id==currentColorId }}"
                    >
                    <span class="colors__value"
                          :style="'background-color: ' + item.color.code + ';'">
                    </span>
                  </label>
                </li>

              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">{{ product.mainProp.title }}</legend>

              <ul class="sizes sizes--primery">
                <label class="sizes__item" v-for="item in product.offers" :key="item.id">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only"
                           type="radio" name="sizes-item"
                           :value="item.id"
                           v-model="productOfferId"
                    >
                    <span class="sizes__value">
                      {{ item.propValues[0].value }}
                    </span>
                  </label>
                </label>
              </ul>
            </fieldset>

            <div class="item__row">
              <div class="form__counter">
                <button type="button"
                        aria-label="Убрать один товар"
                        @click.prevent="doDecrementProduct">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount">

                <button type="button"
                        aria-label="Добавить один товар"
                        @click.prevent="doIncrementProduct"
                >
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <button class="button button--primery" type="submit" @click.prevent="doAddToCart">
                В корзину
              </button>
            </div>
            <p v-show="productAdded">
              Товар успешно добавлен в корзину!
            </p>

          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Оплата и доставка
            </a>
          </li>
        </ul>

        <div class="item__content">

          <a href="#">
            Все характеристики
          </a>

          <div v-for="item in product.specifications" :key="item.id">
            <h3>{{ item.title }}</h3>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import useProduct from '@/hooks/useProduct.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  setup() {
    const $store = useStore();
    const productAdded = ref(false);
    const productAmount = ref(1);
    const currentColorId = ref(null);

    const {
      product, category, fetchProduct,
    } = useProduct();

    const productOfferId = ref(null);
    const currentOffer = computed(() => {
      const { offers } = product.value;
      const offer = offers.find((item) => item.id === productOfferId.value) || {};

      return Object.assign(offer, {
        productPrice: numberFormat(offer.price),
      });
    });
    const doIncrementProduct = () => {
      productAmount.value += 1;
    };
    const doDecrementProduct = () => {
      productAmount.value -= 1;
    };
    const doAddToCart = () => {
      $store.commit('preloaderChangeStatus', true);
      if (productAmount.value > 0) {
        $store.dispatch('addProductToCart', {
          productOfferId: productOfferId.value,
          colorId: currentColorId.value,
          quantity: productAmount.value,
        })
          .then(() => {
            productAdded.value = true;
          })
          .catch((error) => {
            console.log(error);
          })
          .then(() => {
            $store.commit('preloaderChangeStatus', false);
          });
      }
    };
    onMounted(() => {
      fetchProduct();
      currentColorId.value = product.value.colors[0].id;
      productOfferId.value = product.value.offers[0].id;
    });

    return {
      productAdded,
      product,
      productAmount,
      category,
      productOfferId,
      currentColorId,
      currentOffer,
      doIncrementProduct,
      doDecrementProduct,
      doAddToCart,
    };
  },

};
</script>
