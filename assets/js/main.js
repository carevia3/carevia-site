// ===============================
// ✅ CAREVIA FOUNDATION - main.js
// Handles navigation, contact form, gallery & testimonials from Supabase
// ===============================

import { supabase } from "./supabase.js";

// ✅ When page is loaded → run functions
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initContactForm();
    loadGallery();
    loadTestimonials();
});
// ✅ MOBILE NAVIGATION - IMPROVED VERSION //
// ==========================================================
function initNavigation() {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.querySelector(".site-nav");
    const closeMenu = document.querySelector(".close-menu");

    if (!navToggle || !siteNav) return;

    // ✅ Open menu
    navToggle.addEventListener("click", () => {
        siteNav.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    // ✅ Close menu using X button
    if (closeMenu) {
        closeMenu.addEventListener("click", () => {
            siteNav.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    // ✅ Close when clicking any nav link
    document.querySelectorAll(".site-nav a").forEach(link => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    // ✅ Close when clicking outside the menu (optional)
    document.addEventListener("click", (e) => {
        if (siteNav.classList.contains("active") && 
            !siteNav.contains(e.target) && 
            e.target !== navToggle) {
            siteNav.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

// ==========================================================
// ✅ CONTACT FORM → SUPABASE
// ==========================================================
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !phone || !subject || !message) {
            alert("⚠ Please fill all fields");
            return;
        }

        const { error } = await supabase
            .from("contacts")
            .insert([{ name, email, phone, subject, message }]);

        if (error) {
            console.error(error);
            alert("❌ Failed to send message");
            return;
        }

        alert("✅ Message submitted successfully!");
        form.reset();
    });
}

// ==========================================================
// ✅ LOAD GALLERY FROM SUPABASE
// ==========================================================
async function loadGallery() {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  container.innerHTML = "";

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("id", { ascending: false });

  if (error || !data.length) {
    container.innerHTML = "<p>No gallery images found</p>";
    return;
  }

  data.forEach(item => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.innerHTML = `
        <div class="gallery-card">
          <img src="${item.image_url}" class="gallery-img">
        </div>
    `;
    container.appendChild(slide);
  });

  // ✅ Initialize after slides rendered
  setTimeout(() => {
    new Swiper(".gallerySwiper", {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }, 200);
}


// ==========================================================
// ✅ LOAD TESTIMONIALS / STORIES
// ==========================================================
async function loadTestimonials() {
    const container = document.querySelector(".testimonials-grid");
    if (!container) return;

    container.innerHTML = "";

    const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("id", { ascending: false });

    if (error || !data.length) {
        container.innerHTML = "<p>No stories found</p>";
        return;
    }

    data.forEach(story => {
        const card = document.createElement("div");
        card.classList.add("story-accordion");

        card.innerHTML = `
            <div class="story-header">
                <strong>${story.title || "Story"}</strong>
                <span class="arrow">+</span>
            </div>

            <div class="story-content">
                ${story.image_url ? `<img src="${story.image_url}" class="testimonial-img">` : ""}
                <p>${story.content}</p>
                <div class="testimonial-author">
                    <strong>${story.author || "Anonymous"}</strong>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    const headers = document.querySelectorAll(".story-header");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const arrow = header.querySelector(".arrow");

            // ✅ close all other open ones
            document.querySelectorAll(".story-content.open").forEach(openContent => {
                if (openContent !== content) {
                    openContent.classList.remove("open");
                    openContent.previousElementSibling.querySelector(".arrow").classList.remove("rotate");
                }
            });

            // ✅ toggle this one
            content.classList.toggle("open");
            arrow.classList.toggle("rotate");

            // ✅ smooth scroll into view when opening
            if (content.classList.contains("open")) {
                setTimeout(() => {
                    content.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 300);
            }
        });
    });
}

