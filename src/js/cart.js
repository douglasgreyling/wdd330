import { getLocalStorage, loadHeaderFooter } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';

loadHeaderFooter();

const element = document.querySelector('.product-list');

const shoppingCart = new ShoppingCart(
  getLocalStorage('so-cart') || [],
  element,
);

shoppingCart.init();
