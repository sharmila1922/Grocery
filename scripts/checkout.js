import { getCart, updateCart } from '../data/cart.js';
import { fetchProducts } from '../data/products.js';
import { formatCurrency } from './money.js';

const SHIPPING_COST = 1.2;  // Define a static shipping cost
const INITIAL_SHIPPING_COST = 0;  // Initial shipping cost when cart is empty

async function updateCartSummary() {
  try {
    const cart = getCart();  // Fetch the cart from local storage
    const products = await fetchProducts();  // Fetch products from the server

    let cartSummaryHTML = '';
    let totalItems = 0;
    let itemTotalCost = 0;

    // Calculate item totals and render cart items
    cart.forEach((cartItem, index) => {
      const productID = cartItem.productID;
      const matchingProduct = products.find(product => product.id === productID);

      if (matchingProduct) {
        const itemCost = (matchingProduct.priceCents / 100) * cartItem.quantity;
        itemTotalCost += itemCost;  // Accumulate total cost of all items in cart
        totalItems += cartItem.quantity;  // Accumulate total quantity of items

        // Build the HTML for the cart items
        cartSummaryHTML += `
          <div class="cart-item-container" data-index="${index}">
            <div class="cart-item-details-grid">
              <img class="product-image" src="${matchingProduct.image}" style="width: 100px; height: 100px; object-fit: cover;">
              <div class="cart-item-details">
                <div class="product-name" style="font-size: 16px; font-weight: bold;">${matchingProduct.name}</div>
                <div class="product-price" style="font-size: 14px; color: #555;">${formatCurrency(matchingProduct.priceCents)}</div>
                <div class="product-quantity" style="margin-top: 8px;">
                  Quantity: <span class="quantity-label" style="font-weight: bold;">${cartItem.quantity}</span>
                  <button class="delete-button" style="
                    background-color: #ff4d4d; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    padding: 8px 12px; 
                    cursor: pointer; 
                    font-size: 14px; 
                    margin-left: 10px; 
                    transition: background-color 0.3s ease;
                  ">Delete</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    });

    // Update the cart summary HTML
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    // Update the item count in the header
    document.querySelector('.return-to-home-link').textContent = totalItems;

    // Calculate totals
    const subtotal = itemTotalCost;  // Item total cost (without shipping)
    const tax = subtotal * 0.10;  // Assuming a tax rate of 10%
    const shippingCost = totalItems > 0 ? SHIPPING_COST : INITIAL_SHIPPING_COST;  // Update shipping cost if items are in the cart
    const orderTotal = subtotal + shippingCost + tax;  // Items total + shipping + tax

    // Update the values in the payment summary section
    document.querySelector('.total-items-price').textContent = formatCurrency(itemTotalCost * 100);  // Convert to cents for formatting
    document.querySelector('.shipping-cost').textContent = formatCurrency(shippingCost * 100);  // Convert shipping cost to cents
    document.querySelector('.estimated-tax').textContent = formatCurrency(tax * 100);  // Convert tax to cents
    document.querySelector('.order-total').textContent = formatCurrency(orderTotal * 100);  // Convert order total to cents

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', handleDeleteButtonClick);
    });

    // Enable or disable the Place Order button based on checkbox status and cart state
    updatePlaceOrderButtonState();

  } catch (error) {
    console.error('Error updating cart summary:', error);
  }
}

// Function to handle the delete button click
function handleDeleteButtonClick(event) {
  const cart = getCart();
  const productIndex = event.target.closest('.cart-item-container').getAttribute('data-index');

  // Remove the product from the cart based on index
  cart.splice(productIndex, 1);

  // Save the updated cart back to local storage
  updateCart(cart);

  // Update the UI to reflect changes
  updateCartSummary();
}

// Function to update the Place Order button state based on cart and checkbox
function updatePlaceOrderButtonState() {
  const cashOnDeliveryCheckbox = document.getElementById('cashOnDelivery');
  const placeOrderButton = document.querySelector('.place-order-button');
  const cart = getCart();
  
  // Enable the Place Order button only if items are in the cart and checkbox is checked
  placeOrderButton.disabled = !(cart.length > 0 && cashOnDeliveryCheckbox.checked);
  
  // Add an event listener for the checkbox to update the button state
  cashOnDeliveryCheckbox.addEventListener('change', () => {
    placeOrderButton.disabled = !(cart.length > 0 && cashOnDeliveryCheckbox.checked);
  });
}

// Call the function to update the UI when the page loads
updateCartSummary();

document.querySelector('.place-order-button').addEventListener('click', handlePlaceOrderClick);

function handlePlaceOrderClick() {
  const cart = getCart();

  // Check if cart is not empty and Cash on Delivery is selected
  const isCartNotEmpty = cart.length > 0;
  const isCashOnDeliveryChecked = document.getElementById('cashOnDelivery').checked;

  if (isCartNotEmpty && isCashOnDeliveryChecked) {
    // Show the success modal
    $('#successModal').modal('show');

    // Clear the cart and update the UI after modal is dismissed
    $('#successModal').on('hidden.bs.modal', function () {
      updateCart([]);  // Clear the cart
      updateCartSummary();  // Update the UI to reflect changes
    });
  } else {
    // Show an error message if conditions are not met
    if (!isCartNotEmpty) {
      alert('Your cart is empty. Please add items to the cart.');
    } else if (!isCashOnDeliveryChecked) {
      alert('Please select the "Cash on Delivery" option.');
    }
  }
}
