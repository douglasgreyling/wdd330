import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter, humanize } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');

const categoryElement = document.querySelector('#category-title');

const humanizedCategory = humanize(category);
categoryElement.textContent =
  humanizedCategory.charAt(0).toUpperCase() + humanizedCategory.slice(1);

const dataSource = new ProductData();

const element = document.querySelector('.product-list');

const productList = new ProductList(category, dataSource, element);

productList.init();
