import { getCart, addToCart } from '../data/cart.js';
import { fetchProducts, getProducts } from '../data/products.js'; 
import { formatCurrency } from './money.js';

async function displayProducts() {
  try {
    await fetchProducts(); // Fetch products from server

    const products = getProducts(); // Get the fetched products
    let productsHTML = '';

    products.forEach((product) => {
      productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-price">
            ${formatCurrency(product.priceCents)}
          </div>

          <div class="product-spacer"></div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
    });

    document.querySelector('.js-products-grid').innerHTML = productsHTML;

    // Add event listeners to buttons
    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const productID = button.dataset.productId; // Get the product ID from the button
        addToCart(productID); // Add the product to the cart
        updateCartQuantity(); // Update the cart quantity display
      });
    });
  } catch (error) {
    console.error('Error displaying products:', error);
  }
}

function updateCartQuantity() {
  const cart = getCart(); // Fetch the cart from local storage
  console.log('Cart in updateCartQuantity:', cart); // Debugging
  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  console.log('Calculated cart quantity:', cartQuantity); // Debug log
  document.querySelector('.js-cart-quantity').textContent = cartQuantity;
}


document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('cart'); // Clear cart from local storage
  displayProducts(); // Display products
});
