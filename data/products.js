let products = [];

export async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export function getProducts() {
  return products;
}
