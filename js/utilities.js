// ANIMACION AL HACER SCROLL PARA EL ICONO CART
const cartLink = document.getElementById("cart-link");

const toggleFixedCart = () => {
  window.scrollY > 60
    ? cartLink.classList.add("fixed-cart")
    : cartLink.classList.remove("fixed-cart");
};

window.addEventListener("scroll", toggleFixedCart);

toggleFixedCart();

// LOADER
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  loader.classList.add("loader--hidden");

  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});
