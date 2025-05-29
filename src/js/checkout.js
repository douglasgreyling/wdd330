import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkoutProcess = new CheckoutProcess('so-cart', '#order-summary');

const form = document.querySelector('#checkout-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await checkoutProcess.checkout();
});

checkoutProcess.init();
