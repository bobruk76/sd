import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import config from '../../vue.config';

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
    meta: { title: 'Технозавррр' },
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductPage,
    meta: { title: 'Технозавррр' },
  },
  {
    path: '/cart/',
    name: 'cart',
    component: CartPage,
    meta: { title: 'Технозавррр' },
  },
  {
    path: '/order/',
    name: 'order',
    component: OrderPage,
    meta: { title: 'Технозавррр' },
  },
  {
    path: '/order/:id',
    name: 'orderInfo',
    component: OrderInfoPage,
    meta: { title: 'Технозавррр' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundPage,
    meta: { title: 'Технозавррр' },
  },
];

const router = createRouter({
  history: createWebHistory(config.publicPath),
  routes,
});

export default router;
