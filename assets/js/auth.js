// auth.js — Supabase login + set cookie for middleware
import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) {
    console.error("❌ loginForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    const button = form.querySelector("button");

    if (!emailEl || !passEl || !button) {
      alert("Login form is missing required fields.");
      return;
    }

    const email = emailEl.value.trim();
    const password = passEl.value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    // UI state
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "⏳ Logging in...";

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Supabase returns error on invalid credentials
      if (error) {
        console.warn("Login error:", error);
        alert("❌ Wrong email or password");
        button.disabled = false;
        button.textContent = originalText;
        return;
      }

      // Successful login: set a cookie that your middleware can read.
      // Cookie lifetime: 1 day (86400 seconds). Adjust if needed.
      // Use Secure flag when served over HTTPS.
      const cookieParts = [
        "loggedIn=true",
        "path=/",
        "max-age=86400",
        "SameSite=Lax"
      ];
      if (location.protocol === "https:") cookieParts.push("Secure");

      document.cookie = cookieParts.join("; ");

      // Optional: you can store a short identifier (not token) if you want:
      // document.cookie = `adminEmail=${encodeURIComponent(email)}; path=/; max-age=86400; ${location.protocol==='https:'?'Secure':''}`;

      button.textContent = "✅ Success!";
      // short delay so cookie is set before redirect
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 400);

    } catch (err) {
      console.error("Unhandled login error:", err);
      alert("❌ An unexpected error occurred. Check console.");
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});
