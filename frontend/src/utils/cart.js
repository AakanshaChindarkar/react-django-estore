export function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

// Add or update product in cart with the given quantity
export function addToCart(product) {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    // Update quantity if product already exists
    cart[existingIndex].quantity = product.quantity;
  } else {
    // Add new product with specified quantity
    cart.push({ ...product, quantity: product.quantity || 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Remove product from cart by ID
export function removeFromCart(productId) {
  const updatedCart = getCart().filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
}

// Check if product exists in cart
export function isInCart(productId) {
  const cart = getCart();
  return cart.some((item) => item.id === productId);
}
