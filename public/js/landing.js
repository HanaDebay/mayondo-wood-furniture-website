const messages = [
  "Delivering quality wood and furniture solutions...",
  "Trusted by builders and dealers across the country.",
  "From forests to furniture — we’ve got you covered.",
  "Building homes, offices, and futures with MWF."
];

let index = 0;
const rotatingText = document.getElementById("rotatingText");

setInterval(() => {
  index = (index + 1) % messages.length;
  rotatingText.textContent = messages[index];
}, 3000);
