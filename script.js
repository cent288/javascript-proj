document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("highlight-slider");
  if (!slider) return; // only run if the slider exists

  const slides = Array.from(slider.children);

  // Shuffle slides on page load
  slides.sort(() => Math.random() - 0.5);
  slides.forEach(slide => slider.appendChild(slide));

  // Auto slide every 3s
  let index = 0;
  setInterval(() => {
    index++;
    if (index > slides.length - 2) index = 0; // since 2 are visible
    slider.style.transform = `translateX(-${index * 50}%)`;
  }, 3000);
});
