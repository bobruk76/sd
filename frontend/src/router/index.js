import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import config from '../../vue.config';

const DEFAULT_TITLE = 'Технозавррр';
const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductPage,
  },
  {
    path: '/cart/',
    name: 'cart',
    component: CartPage,
    meta: { title: 'Коррррзина' },
  },
  {
    path: '/order/',
    name: 'order',
    component: OrderPage,
  },
  {
    path: '/order/:id',
    name: 'orderInfo',
    component: OrderInfoPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(config.publicPath),
  routes,
});
router.beforeEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
