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
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST">
            <b class="item__price">
              {{ product.productPrice }} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">

                <li class="colors__item" v-for="item in product.colors" :key="item.color.id">
                  <label class="colors__label">
                    <input class="colors__radio sr-only"
                           type="radio"
                           name="color-item"
                           :value="item.color.title"
                    >
                    <span class="colors__value"
                          :style="'background-color: ' + item.color.code + ';'">
                    </span>
                  </label>
                </li>

              </ul>
            </fieldset>

            <fieldset class="form__block">

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

          <h3>Что это?</h3>

          <h3>Дизайн</h3>

        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import useProduct from '@/hooks/useProduct.vue';

export default {
  setup() {
    const productAdded = ref(false);
    const $store = useStore();
    const productAmount = ref(1);
    const { product, category, fetchProduct } = useProduct();

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
          productId: product.value.id,
          amount: productAmount.value,
        }).then(() => {
          productAdded.value = true;
        })
          .catch(() => {
          })
          .then(() => {
            $store.commit('preloaderChangeStatus', false);
          });
      }
    };
    fetchProduct();

    return {
      productAdded,
      product,
      productAmount,
      category,
      doIncrementProduct,
      doDecrementProduct,
      doAddToCart,
    };
  },

};
</script>
