export const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(productID) {
  let cart = getCart();
  console.log('Cart before adding item:', cart); // Debugging

  let matchingItem = cart.find(item => item.productID === productID);

  if (matchingItem) {
    matchingItem.quantity += 1; // Increment quantity if item exists
    console.log(`Updated quantity for product ID ${productID}: ${matchingItem.quantity}`);
  } else {
    cart.push({ productID, quantity: 1 }); // Add new item with quantity 1 if not exists
    console.log(`Added new product ID ${productID} to cart`);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to local storage
  console.log('Cart after adding item:', cart); // Debugging
}

// New function to update the cart after changes
export function updateCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('Cart updated:', cart); // Debugging
}
