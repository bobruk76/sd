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

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">

          <li class="colors__item" v-for="item in colors"
              :key="item.id"
              :value="item.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="radio"
                name="color"
                :value="item.id"
                v-model.number="currentColorId"
              >
              <span class="colors__value" :style="'background-color: ' + item.code + ';'">
                  </span>
            </label>
          </li>

        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Объемб в ГБ</legend>
        <ul class="check-list">
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="8"
                     checked="">
              <span class="check-list__desc">
                    8
                    <span>(313)</span>
                  </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="16">
              <span class="check-list__desc">
                    16
                    <span>(461)</span>
                  </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="32">
              <span class="check-list__desc">
                    32
                    <span>(313)</span>
                  </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="64">
              <span class="check-list__desc">
                    64
                    <span>(313)</span>
                  </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume"
                     value="128">
              <span class="check-list__desc">
                    128
                    <span>(313)</span>
                  </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume"
                     value="264">
              <span class="check-list__desc">
                    264
                    <span>(313)</span>
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
import { onMounted, ref } from 'vue';
import { API_BASE_URL } from '@/config';

export default {
  props: ['priceFrom', 'priceTo', 'categoryId', 'page', 'colorId'],
  setup(props, { emit: $emit }) {
    const currentPriceFrom = ref(props.priceFrom);
    const currentPriceTo = ref(props.priceTo);
    const currentCategoryId = ref(props.categoryId);
    const currentColorId = ref(props.colorId);
    const colors = ref(null);
    const categories = ref(null);

    const onSubmit = () => {
      $emit('update:page', 1);
      $emit('update:priceFrom', currentPriceFrom.value);
      $emit('update:priceTo', currentPriceTo.value);
      $emit('update:categoryId', currentCategoryId.value);
      $emit('update:colorId', currentColorId.value);
    };
    const onReset = () => {
      $emit('update:page', 1);
      $emit('update:priceFrom', 0);
      $emit('update:priceTo', 0);
      $emit('update:categoryId', 0);
      $emit('update:colorId', 0);
    };
    const onLoadParams = async () => {
      axios.get(`${API_BASE_URL}/productCategories`)
        .then((response) => { categories.value = response.data.items; });
      axios.get(`${API_BASE_URL}/colors`)
        .then((response) => { colors.value = response.data.items; });
    };
    onMounted(onLoadParams);
    return {
      currentPriceFrom,
      currentPriceTo,
      currentCategoryId,
      currentColorId,
      colors,
      categories,
      onSubmit,
      onReset,
    };
  },
  //
  // data() {
  //   return {
  //     currentPriceFrom: 0,
  //     currentPriceTo: 0,
  //     currentCategoryId: 0,
  //     currentColorId: 0,
  //     colorsData: null,
  //     categoriesData: null,
  //   };
  // },
  // methods: {
  //   submit() {
  //     this.$emit('update:page', 1);
  //     this.$emit('update:priceFrom', this.currentPriceFrom);
  //     this.$emit('update:priceTo', this.currentPriceTo);
  //     this.$emit('update:categoryId', this.currentCategoryId);
  //     this.$emit('update:colorId', this.currentColorId);
  //   },
  //
  //   reset() {
  //     this.$emit('update:page', 1);
  //     this.$emit('update:priceFrom', 0);
  //     this.$emit('update:priceTo', 0);
  //     this.$emit('update:categoryId', 0);
  //     this.$emit('update:colorId', 0);
  //   },
  //
  //   loadCategories() {
  //     axios.get(`${API_BASE_URL}/productCategories`).then(
  //       (response) => {
  //         this.categoriesData = response.data;
  //       },
  //     );
  //   },
  //
  //   loadColors() {
  //     axios.get(`${API_BASE_URL}/colors`).then(
  //       (response) => {
  //         this.colorsData = response.data;
  //       },
  //     );
  //   },
  // },
  // watch: {
  //   priceFrom(value) {
  //     this.currentPriceFrom = value;
  //   },
  //   priceTo(value) {
  //     this.currentPriceTo = value;
  //   },
  //   categoryId(value) {
  //     this.currentCategoryId = value;
  //   },
  // },
  //
  // computed: {
  //   categories() {
  //     return this.categoriesData ? this.categoriesData.items : [];
  //   },
  //
  //   colors() {
  //     return this.colorsData ? this.colorsData.items : [];
  //   },
  // },
  //
  // created() {
  //   this.currentCategoryId = this.categoryId;
  //   this.loadCategories();
  //   this.loadColors();
  // },
};
</script>
