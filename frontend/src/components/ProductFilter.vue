<template>
  <aside class="filter">
    <h2 class="filter__title">
      <span>Фильтры</span>
      <label class="form__label form__label--select">
        <select class="form__select" v-model="currentCountPerPage">
          <option v-for="option in options" :value="option.value" :key="option.key">
            {{ option.value }}
          </option>
        </select>
      </label>
    </h2>
    <form class="filter__form form">
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
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">

          <li class="colors__item" v-for="item in colors"
              :key="item.id"
              :value="item.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="checkbox"
                :value="item.id"
                v-model.number="currentColorIds"
              >
              <span class="colors__value" :style="'background-color: ' + item.code + ';'">
                  </span>
            </label>
          </li>

        </ul>
      </fieldset>
      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select"
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

      <fieldset class="form__block" v-for="items in categoryProductProps" :key="items.id">
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

      <button class="filter__submit button button--primery" type="submit" @click.prevent="onSubmit">
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
  ref, toRaw, watch,
} from 'vue';
import { API_BASE_URL } from '@/config';

export default {
  props: ['priceFrom', 'priceTo', 'categoryId', 'colorIds', 'page', 'productProps', 'countPerPage', 'options'],
  emits: ['emGetProducts'],
  setup(props, { emit: $emit }) {
    const formFields = ref(props.productProps);
    const currentPriceFrom = ref(props.priceFrom);
    const currentPriceTo = ref(props.priceTo);
    const currentCategoryId = ref(props.categoryId);
    const currentColorIds = ref(props.colorIds);
    const categoryProductProps = ref({});
    const categories = ref(null);
    const colors = ref(null);
    const currentCountPerPage = ref(props.countPerPage);
    const onSubmit = () => {
      $emit('update:page', 1);
      $emit('update:priceFrom', currentPriceFrom.value);
      $emit('update:priceTo', currentPriceTo.value);
      $emit('update:categoryId', currentCategoryId.value);
      $emit('update:colorIds', currentColorIds.value);
      $emit('update:productProps', toRaw(formFields.value));
      $emit('emGetProducts');
    };
    const onReset = () => {
      currentPriceFrom.value = 0;
      currentPriceTo.value = 0;
      currentCategoryId.value = 0;
      currentColorIds.value = [];
      categoryProductProps.value = {};
      formFields.value = {};
      currentCountPerPage.value = props.options[0].value;
      onSubmit();
    };
    const onLoadParams = async () => {
      axios.get(`${API_BASE_URL}/colors`)
        .then((response) => {
          colors.value = response.data.items;
        });
      axios.get(`${API_BASE_URL}/productCategories`)
        .then((response) => { categories.value = response.data.items; });
    };
    const onLoadProductProps = async () => {
      formFields.value = {};
      categoryProductProps.value = {};
      if (+currentCategoryId.value > 0) {
        axios.get(`${API_BASE_URL}/productCategories/${currentCategoryId.value}`)
          .then((response) => {
            categoryProductProps.value = response.data.productProps.filter((item) => item.code !== 'color');
            categoryProductProps.value.forEach((obj) => {
              formFields.value[obj.code] = [];
            });
          });
      }
    };
    watch(currentCategoryId, onLoadProductProps, { immediate: true });
    watch(currentCountPerPage, (newCount) => $emit('update:countPerPage', newCount));
    onLoadParams();
    return {
      formFields,
      currentPriceFrom,
      currentPriceTo,
      currentCategoryId,
      currentColorIds,
      categories,
      colors,
      categoryProductProps,
      currentCountPerPage,
      onSubmit,
      onReset,
    };
  },
};
</script>
<style scoped lang="stylus">
h2
  display: flex;
  justify-content: space-between;
  .form__select
    font-family: sans-serif
</style>
