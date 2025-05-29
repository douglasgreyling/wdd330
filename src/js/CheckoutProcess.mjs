import {
  setLocalStorage,
  getLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  return items.map(item => {
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.Quantity,
    };
  });
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.displayItemTotals();
    this.displayOrderTotals();

    const zip = document.querySelector(`#zip`);
    zip.addEventListener('change', event => {
      this.calculateOrderTotal();
      this.displayOrderTotals();
    });
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((total, item) => total + (item.ListPrice * item.Quantity), 0);
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = (this.list.length > 0 ? 10 : 0) + (this.list.length > 1 ? (this.list.length - 1) * 2 : 0);
  }

  displayItemTotals() {
    const element = document.querySelector(`${this.outputSelector} #subtotal`);

    this.calculateItemSubTotal();

    element.innerText = `Subtotal: $${this.itemTotal.toFixed(2)}`;
  }

  displayOrderTotals() {
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotalElement = document.querySelector(`${this.outputSelector} #total`);

    taxElement.innerText = `Tax: $${this.tax.toFixed(2)}`;
    shippingElement.innerText = `Shipping: $${this.shipping.toFixed(2)}`;
    orderTotalElement.innerHTML = `<strong>Order Total: $${(this.itemTotal + this.tax + this.shipping).toFixed(2)}</strong>`;
  }

  async checkout() {
    const formElement = document.getElementById('checkout-form');
    const order = formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    console.log(order);

    try {
      const response = await services.checkout(order);
      console.log(response);
      // setLocalStorage("so-cart", []);
      location.assign("/checkout/success.html");
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }

      console.log(err);
    }
  }
}
