const shopNowBtn = document.getElementById("shopNowBtn");
const addCartButtons = document.querySelectorAll(".add-cart-btn");
const cartCount = document.getElementById("cartCount");
const footerText = document.getElementById("footerText");

let count = 0;

shopNowBtn.addEventListener("click", () => {
  alert("Welcome to ShopVue. Start exploring our featured products.");
});

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    count++;
    cartCount.textContent = count;
    alert("Product added to cart.");
  });
});

const currentYear = new Date().getFullYear();
footerText.textContent = `© ${currentYear} ShopVue — Mini Project`;