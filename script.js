// ========== Mobile Menu Toggle ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ========== Navbar Scroll Effect ==========
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========== Active Nav Link on Scroll ==========
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

// ========== Tabs Functionality ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    // Remove active class from all buttons and contents
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

// ========== Contact Form Submission ==========
const contactForm = document.getElementById("contactForm");
const contactSubmitButton = contactForm.querySelector(".contact-submit-btn");
const submitButtonLabel = contactSubmitButton.querySelector(".submit-button-label");
const submitIcon = contactSubmitButton.querySelector(".submit-icon");
const submitSpinner = contactSubmitButton.querySelector(".submit-spinner");
const contactNotification = document.getElementById("contactNotification");
const contactNotificationTitle = document.getElementById("contactNotificationTitle");
const contactNotificationDescription = document.getElementById("contactNotificationDescription");
const notificationCloseButton = contactNotification.querySelector(".notification-close");
let notificationTimeout;
let notificationHideTimeout;
let isSubmitting = false;

function hideContactNotification() {
  clearTimeout(notificationTimeout);
  contactNotification.classList.remove("is-visible");
  clearTimeout(notificationHideTimeout);
  notificationHideTimeout = setTimeout(() => {
    if (!contactNotification.classList.contains("is-visible")) {
      contactNotification.hidden = true;
    }
  }, 300);
}

function showContactNotification(type) {
  clearTimeout(notificationTimeout);
  clearTimeout(notificationHideTimeout);

  const isSuccess = type === "success";
  contactNotification.classList.toggle("is-success", isSuccess);
  contactNotification.classList.toggle("is-error", !isSuccess);
  contactNotification.setAttribute("role", isSuccess ? "status" : "alert");
  contactNotification.setAttribute("aria-live", isSuccess ? "polite" : "assertive");
  contactNotificationTitle.textContent = isSuccess
    ? "Message Sent Successfully!"
    : "Message Couldn't Be Sent";
  contactNotificationDescription.textContent = isSuccess
    ? "Thanks for reaching out! Your message has been delivered. I'll get back to you soon."
    : "Something went wrong. Please try again.";
  contactNotification.hidden = false;
  contactNotification.classList.remove("is-visible");
  requestAnimationFrame(() => contactNotification.classList.add("is-visible"));

  if (isSuccess) {
    notificationTimeout = setTimeout(hideContactNotification, 6000);
  }
}

notificationCloseButton.addEventListener("click", hideContactNotification);

contactForm.addEventListener("submit", async function(e) {
  e.preventDefault();

  if (isSubmitting) return;

  isSubmitting = true;
  const formData = new FormData(contactForm);

  contactSubmitButton.disabled = true;
  contactSubmitButton.classList.add("is-loading");
  contactSubmitButton.setAttribute("aria-busy", "true");
  submitButtonLabel.textContent = "Sending Message...";
  submitIcon.hidden = true;
  submitSpinner.hidden = false;

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwvzkNoL9Je5l_8_50bWzHAg_m7KLfqhrWCfAbRE3wGKzFCkWVR-C7ojWHFWKKz4dWx/exec", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Contact form request failed with status ${response.status}`);
    }

    contactForm.reset();
    showContactNotification("success");

  } catch (error) {
    console.error("Contact form submission failed:", error);
    showContactNotification("error");
  } finally {
    isSubmitting = false;
    contactSubmitButton.disabled = false;
    contactSubmitButton.classList.remove("is-loading");
    contactSubmitButton.removeAttribute("aria-busy");
    submitButtonLabel.textContent = "Send Message";
    submitSpinner.hidden = true;
    submitIcon.hidden = false;
  }
});

// ========== Smooth Scroll for Internal Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========== Intersection Observer for Animations ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-card");
    }
  });
}, observerOptions);

// Apply fade-in animation to cards
document.querySelectorAll('.service-card, .portfolio-card, .contact-item').forEach(el => {
  el.classList.add("hidden-card");
  observer.observe(el);
});