// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.getElementById("mobile-menu");   // hamburger button
  const navMenu = document.querySelector(".navbar__menu");    // menu list
  const navLinks = document.querySelectorAll(".navbar__links"); // each link

  // Toggle menu open/close
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileBtn.classList.toggle("is-active");
      navMenu.classList.toggle("active");
    });
  }

  // Close menu when a link is clicked (mobile UX)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileBtn.classList.remove("is-active");
      navMenu.classList.remove("active");
    });
  });
});
