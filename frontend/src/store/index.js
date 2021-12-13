import { createStore } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default createStore({
  state: {
    cartId: null,
    cartProducts: null,
    userKey: null,
    preloader: false,
    orderInfo: null,
    orderId: null,
    options: [
      { value: 12 },
      { value: 24 },
      { value: 32 },
    ],
  },

  mutations: {
    preloaderChangeStatus(state, status) {
      state.preloader = status;
    },

    updateCartId(state, cartId) {
      state.cartId = cartId;
    },

    updateCartProducts(state, cartProducts) {
      state.cartProducts = cartProducts.map((item) => ({
        ...item,
        title: item.productOffer.title,
        productId: item.productOffer.product.id,
        amount: item.quantity,
        totalPrice: item.quantity * item.price,
        img: item.productOffer.product.preview.file.url,
      }));
    },

    updateUserKey(state, userKey) {
      state.userKey = userKey;
      localStorage.setItem('userKey', userKey);
    },

    removeUserKey(state) {
      state.userKey = null;
      localStorage.clear();
    },

    updateOrderId(state, orderId) {
      state.orderId = orderId;
      let orders = localStorage.getItem('orders');
      orders = orders ? orders.split(',') : [];
      orders.push(orderId);
      localStorage.setItem('orders', orders);
    },

    changeAmountProduct(state, {
      basketItemId,
      amount,
    }) {
      const Item = state.cartProducts.find((element) => element.id === basketItemId);
      if (Item) {
        Item.amount = +amount;
        Item.totalPrice = Item.amount * Item.price;
      }
    },
  },

  actions: {
    loadBaskets(context) {
      context.commit('preloaderChangeStatus', true);
      if ('userKey' in localStorage) {
        context.commit('updateUserKey', localStorage.getItem('userKey'));
      }
      return axios.get(`${API_BASE_URL}/baskets`, {
        params: {
          userAccessKey: context.state.userKey,
        },
      })
        .then(
          (response) => {
            const responseData = response.data;
            if (!context.state.userKey) {
              context.commit('updateUserKey', responseData.user.accessKey);
            }
            context.commit('updateCartId', responseData.id);
            context.commit('updateCartProducts', responseData.items);
          },
        )
        .catch((error) => {
          console.log(error);
          console.log('заходит');
          // userAccessKey
        })
        .then(
          () => {
            context.commit('preloaderChangeStatus', false);
          },
        );
    },

    addProductToCart(context, {
      productOfferId,
      colorId,
      quantity,
    }) {
      return new Promise(((resolve) => setTimeout(resolve, 0)))
        .then(() => (
          axios.post(`${API_BASE_URL}/baskets/products`, {
            productOfferId,
            colorId,
            quantity,
          }, {
            params: {
              userAccessKey: context.state.userKey,
            },
          })
            .then(
              (response) => {
                context.commit('updateCartProducts', response.data.items);
              },
            )
            .catch((error) => {
              const errorQuery = error.response.data.error.query;
              if ('userAccessKey' in errorQuery) {
                context.commit('removeUserKey');
                context.dispatch('loadBaskets')
                  .then(() => {});
              }
            })
        ))
        .catch((error) => {
          console.log(error);
        });
    },

    removeProduct(context, basketItemId) {
      return axios.delete(`${API_BASE_URL}/baskets/products`, {
        params: {
          userAccessKey: context.state.userKey,
        },
        data: {
          basketItemId,
        },
      })
        .then(
          (response) => {
            context.commit('updateCartProducts', response.data.items);
          },
        );
    },

    updateProductToCart(context, {
      basketItemId,
      amount,
    }) {
      return axios.put(`${API_BASE_URL}/baskets/products`, {
        basketItemId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userKey,
        },
      })
        .then(
          () => {
            context.commit('changeAmountProduct', {
              basketItemId,
              amount,
            });
          },
        );
    },

  },

  getters: {
    getOptions(state) {
      return state.options;
    },

    getUserKey(state) {
      return state.userKey;
    },

    preloaderActive(state) {
      return state.preloader;
    },

    cartDetailsProducts(state) {
      return state.cartProducts ? state.cartProducts : [];
    },

    cartTotalAmounts(state) {
      return state.cartProducts ? state.cartProducts.reduce((count, item) => count
        + item.amount, 0) : 0;
    },

    cartTotalSum(state) {
      return state.cartProducts ? state.cartProducts.reduce(
        (sum, item) => sum + item.totalPrice, 0,
      ) : 0;
    },

  },
});
