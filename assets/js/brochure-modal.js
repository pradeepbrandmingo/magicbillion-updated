/**
 * Global Brochure Download Modal Component
 * Loads HTML and CSS files dynamically and hooks up brochure triggers.
 */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject CSS stylesheet dynamically if not already loaded
    const cssPath = "CSS/brochure-modal.css";
    let cssLoaded = Promise.resolve();

    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      cssLoaded = new Promise((resolve) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssPath;
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Proceed even if CSS fails to load
        document.head.appendChild(link);
      });
    }

    // 2. Fetch and Inject the HTML modal structure
    const htmlFetched = fetch("brochure-modal.html").then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load brochure modal HTML file.");
      }
      return response.text();
    });

    // Wait for both CSS and HTML to be ready before appending to prevent flash of unstyled HTML (FOUC)
    Promise.all([cssLoaded, htmlFetched])
      .then(([_, html]) => {
        // Append modal HTML to document body
        const containerDiv = document.createElement("div");
        containerDiv.innerHTML = html.trim();
        const modalElement = containerDiv.firstChild;
        document.body.appendChild(modalElement);

        // Initialize triggers and events
        initializeModalControls();
      })
      .catch((error) => {
        console.error("Error initializing brochure modal:", error);
      });

    /**
     * Set up all triggers and handlers for the brochure modal
     */
    function initializeModalControls() {
      const modal = document.getElementById("brochureModal");
      const closeBtn = document.getElementById("brochureModalClose");
      const form = document.getElementById("brochure-submit-form");

      if (!modal) return;

      // Opens the modal
      function openModal() {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        // Auto-select course based on page URL/context
        const selectEl = form ? form.querySelector('#course') : null;
        if (selectEl) {
          if (window.location.pathname.includes("global-degree")) {
            selectEl.value = "global-degree-program";
          } else if (window.location.pathname.includes("language")) {
            selectEl.value = "language";
          } else {
            // Default fallback for index.html or other pages
            selectEl.value = "language";
          }
        }

        // Set focus to the first input field
        const firstInput = form ? form.querySelector("input") : null;
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 150);
        }
      }

      // Closes the modal
      function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
      }

      // 3. Listen for clicks on brochure triggers globally (Event Delegation)
      document.addEventListener("click", (e) => {
        const trigger =
          e.target.closest(".download-brochure-btn") ||
          e.target.closest('[href="#brochure"]') ||
          e.target.closest('[data-trigger="brochure"]');

        if (trigger) {
          e.preventDefault();
          openModal();
        }
      });

      // 4. Close on 'X' button click
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          closeModal();
        });
      }

      // 5. Close on backdrop overlay click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // 6. Close on Escape key press
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
          closeModal();
        }
      });

      // 7. Form submission feedback animation
      // 7. Form submit to webhook
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();

          // ---- Validation ----
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^[6-9]\d{9}$/;

          const fields = {
            name: form.querySelector('[name="name"]'),
            email: form.querySelector('[name="email"]'),
            phone: form.querySelector('[name="phone"]'),
            subject: form.querySelector('[name="subject"]'),
            message: form.querySelector('[name="message"]'),
            course: form.querySelector('[name="course"]'),
          };

          Object.values(fields).forEach((el) => (el.style.borderColor = ""));

          let isValid = true;

          if (!fields.name.value.trim()) {
            fields.name.style.borderColor = "red";
            isValid = false;
          }
          if (
            !fields.email.value.trim() ||
            !emailRegex.test(fields.email.value.trim())
          ) {
            fields.email.style.borderColor = "red";
            isValid = false;
          }
          if (
            !fields.phone.value.trim() ||
            !phoneRegex.test(fields.phone.value.trim())
          ) {
            fields.phone.style.borderColor = "red";
            isValid = false;
          }
          if (!fields.subject.value.trim()) {
            fields.subject.style.borderColor = "red";
            isValid = false;
          }
          if (!fields.message.value.trim()) {
            fields.message.style.borderColor = "red";
            isValid = false;
          }
          /* ADD THIS */
          if (!fields.course.value) {
            fields.course.style.borderColor = "red";
            isValid = false;
          }

          if (!isValid) return;
          // ---- Validation End ----

          const submitBtn = form.querySelector(".form-submit-btn");
          if (!submitBtn) return;

          const originalText = submitBtn.textContent;

          submitBtn.textContent = "Sending...";
          submitBtn.disabled = true;

          try {
            const formData = {
              name: form.querySelector('[name="name"]').value.trim(),
              email: form.querySelector('[name="email"]').value.trim(),
              phone: form.querySelector('[name="phone"]').value.trim(),
              subject: form.querySelector('[name="subject"]').value.trim(),
              message: form.querySelector('[name="message"]').value.trim(),
              course: form.querySelector('[name="course"]').value,
              source: "Brochure Popup",
            };

            let success = false;
            let errorMsg = "Something went wrong";

            try {
              const response = await fetch("/api/lead", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });

              if (response.ok) {
                const result = await response.json();
                if (result.success) {
                  success = true;
                  console.log("Popup Lead:", result);
                } else {
                  errorMsg = result.message || errorMsg;
                }
              }
            } catch (e) {
              console.warn(
                "API route failed, falling back to direct Google Sheets post:",
                e,
              );
            }

            if (success) {
              submitBtn.textContent = "✓ Sent!";
              submitBtn.style.backgroundColor = "#2e7d32";
              submitBtn.style.borderColor = "#2e7d32";

              setTimeout(() => {
                form.reset();

                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = "";
                submitBtn.style.borderColor = "";
                submitBtn.disabled = false;

                closeModal();
              }, 2000);
            } else {
              throw new Error(errorMsg);
            }
          } catch (error) {
            console.error(error);

            submitBtn.textContent = "Failed!";

            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }, 2000);
          }
        });
      }
    }
  });
})();
