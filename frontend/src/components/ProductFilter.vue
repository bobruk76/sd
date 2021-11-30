<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit.prevent="onSubmit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" type="text"
                  name="category"
                  v-model.number="currentCategoryId">
            <option value="0">Все категории</option>
            <option v-for="category in categories" :key="category.id"
                    :value="category.id">
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>
      <fieldset class="form__block" v-for="items in currentProductProps" :key="items.id">
        <legend class="form__legend">{{ items.title }}</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="item in items.availableValues" :key="item.value">
            <label class="check-list__label">
              <input class="check-list__check sr-only"
                     type="checkbox"
                     :name="item.value"
                     :value="item.value"
                     v-model="formFields[items.code]"
              >
              <span class="check-list__desc">
                    {{ item.value }}
                    <span>({{ item.productsCount }})</span>
                  </span>
            </label>
          </li>
         </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button class="filter__reset button button--second" type="button" @click.prevent="onReset">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from 'axios';
import {
  onMounted, ref, watch,
} from 'vue';
import { API_BASE_URL } from '@/config';

export default {
  props: ['priceFrom', 'priceTo', 'categoryId', 'page', 'productProps'],
  setup(props, { emit: $emit }) {
    const formFields = ref({});
    const currentPriceFrom = ref(props.priceFrom);
    const currentPriceTo = ref(props.priceTo);
    const currentCategoryId = ref(props.categoryId);
    const currentProductProps = ref(props.productProps);
    const categories = ref(null);

    const onSubmit = () => {
      $emit('update:page', 1);
      $emit('update:priceFrom', currentPriceFrom.value);
      $emit('update:priceTo', currentPriceTo.value);
      $emit('update:categoryId', currentCategoryId.value);
      $emit('update:productProps', formFields.value);
    };
    const onReset = () => {
      currentPriceFrom.value = 0;
      currentPriceTo.value = 0;
      currentCategoryId.value = 0;
      currentProductProps.value = {};

      $emit('update:page', 1);
      $emit('update:priceFrom', 0);
      $emit('update:priceTo', 0);
      $emit('update:categoryId', 0);
      $emit('update:productProps', null);
    };
    const onLoadParams = async () => {
      axios.get(`${API_BASE_URL}/productCategories`)
        .then((response) => { categories.value = response.data.items; });
    };
    const onLoadProductProps = async () => {
      formFields.value = {};
      currentProductProps.value = {};
      if (+currentCategoryId.value > 0) {
        axios.get(`${API_BASE_URL}/productCategories/${currentCategoryId.value}`)
          .then((response) => {
            currentProductProps.value = response.data.productProps;
            currentProductProps.value.forEach((obj) => {
              formFields.value[obj.code] = [];
            });
          });
      }
    };
    watch(currentCategoryId, onLoadProductProps);
    onMounted(onLoadParams);
    return {
      formFields,
      currentPriceFrom,
      currentPriceTo,
      currentCategoryId,
      categories,
      currentProductProps,
      onSubmit,
      onReset,
    };
  },
};
</script>
