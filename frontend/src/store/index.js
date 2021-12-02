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

    updateOrderId(state, orderId) {
      state.orderId = orderId;
      let orders = localStorage.getItem('orders');
      orders = orders ? orders.split(',') : [];
      orders.push(orderId);
      localStorage.setItem('orders', orders);
    },

    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },

    changeAmountProduct(state, {
      productId,
      amount,
    }) {
      const Item = state.cartProducts.find((item) => item.productId === productId);
      if (Item) {
        Item.amount = +amount;
        Item.totalPrice = Item.amount * Item.price;
      }
    },

  },

  actions: {

    sendOrder(context) {
      context.commit('preloaderChangeStatus', true);
      return new Promise(((resolve) => setTimeout(resolve, 2500)))
        .then(() => (
          axios.post(`${API_BASE_URL}/orders`, {
            // ...formFields,
          }, {
            params: {
              userAccessKey: context.state.userKey,
            },
          })
            .then(
              (response) => {
                context.commit('updateOrderId', response.data.orderId);
              },
            )
            .catch(
              () => {
                // formErrors = error.request.errors;
              },
            )
            .then(
              () => {
                context.commit('preloaderChangeStatus', false);
              },
            )));
    },

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
              console.log(error);
            })
        ));
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
      productId,
      amount,
    }) {
      return axios.put(`${API_BASE_URL}/baskets/products`, {
        productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userKey,
        },
      })
        .then(
          () => {
            context.commit('changeAmountProduct', {
              productId,
              amount,
            });
          },
        );
    },

    loadOrder(context, orderId) {
      context.commit('preloaderChangeStatus', true);
      return axios.get(`${API_BASE_URL}/orders/${orderId}`, {
        params: {
          userAccessKey: context.state.userKey,
        },
      })
        .then(
          (response) => {
            context.commit('updateOrderInfo', response.data);
          },
        )
        .catch(
          (error) => {
            console.log(error);
          },
        )
        .then(
          () => {
            context.commit('preloaderChangeStatus', false);
          },
        );
    },

  },

  getters: {
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

    getOrderInfo(state) {
      return state.orderInfo ? state.orderInfo : {};
    },

    getAllOrders(state) {
      return ('orders' in localStorage) ? localStorage.getItem('orders')
        .split(',') : state.orderId;
    },

  },
});
