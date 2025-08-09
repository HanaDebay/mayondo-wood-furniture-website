// contact.js

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents form from refreshing page

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let agreement = document.getElementById("agreement").checked;

    if (!agreement) {
      alert("Please accept the Terms of Service before sending.");
      return;
    }
    // Simple validation
    // if (name === "" || email === "" || message === "") {
    //   alert("Please fill in all fields.");
    //   return;
    // }
    // console.table({
    //   Name: name,
    //   Email: email,
    //   Message: message,
    //   Agreed: agree,
    // });

    // Example: Display success message
    alert(`Thank you, ${name}! Your message has been sent.`);

    // Reset form after submission
    contactForm.reset();
  });
});

// Scroll animation: show elements when they enter viewport
const featureBoxes = document.querySelectorAll(".feature-box");

function checkVisibility() {
  const triggerBottom = window.innerHeight * 0.9;

  featureBoxes.forEach((box) => {
    const boxTop = box.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      box.classList.add("visible");
    } else {
      box.classList.remove("visible");
    }
  });
}

window.addEventListener("scroll", checkVisibility);
window.addEventListener("load", checkVisibility);
