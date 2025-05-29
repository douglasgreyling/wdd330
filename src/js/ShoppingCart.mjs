import { renderListWithTemplate, setLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(dataSource, listElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = this.dataSource;
    this.listElement.innerHTML = '';
    this.renderList(list);
    this.registerRemoveCartButtons();
  }

  renderList(list) {
    renderListWithTemplate(cartItemTemplate, this.listElement, list);
  }

  registerRemoveCartButtons() {
    const removeButtons = document.querySelectorAll('.cart-remove');

    removeButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const itemId = event.target.dataset.id;
        this.removeItemFromCart(itemId);
      });
    });
  }

  removeItemFromCart(itemId) {
    const itemIndex = this.dataSource.findIndex(item => item.Id === itemId);

    if (itemIndex !== -1) {
      this.dataSource = this.dataSource.filter(item => item.Id !== itemId);

      setLocalStorage('so-cart', this.dataSource);

      this.init();
    }
  }
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Images.PrimarySmall}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <p class="cart-remove" data-id="${item.Id}">X</p>
  </li>`;
}
