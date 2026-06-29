(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const cssPath = "CSS/brochure-modal.css";
    let cssLoaded = Promise.resolve();

    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      cssLoaded = new Promise((resolve) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssPath;
        link.onload = () => resolve();
        link.onerror = () => resolve();
        document.head.appendChild(link);
      });
    }

    const htmlFetched = fetch("brochure-modal.html").then((response) => {
      if (!response.ok)
        throw new Error("Failed to load brochure modal HTML file.");
      return response.text();
    });

    Promise.all([cssLoaded, htmlFetched])
      .then(([_, html]) => {
        const containerDiv = document.createElement("div");
        containerDiv.innerHTML = html.trim();
        const modalElement = containerDiv.firstChild;
        document.body.appendChild(modalElement);
        initializeModalControls();
      })
      .catch((error) => {
        console.error("Error initializing brochure modal:", error);
      });

    function initializeModalControls() {
      const modal = document.getElementById("brochureModal");
      const closeBtn = document.getElementById("brochureModalClose");
      const form = document.getElementById("brochure-submit-form");

      if (!modal) return;

      function openModal() {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        const selectEl = form ? form.querySelector("#course") : null;
        if (selectEl) {
          if (window.location.pathname.includes("global-degree")) {
            selectEl.value = "global-degree-program";
          } else if (window.location.pathname.includes("language")) {
            selectEl.value = "language";
          } else {
            selectEl.value = "language";
          }
        }

        const firstInput = form ? form.querySelector("input") : null;
        if (firstInput) setTimeout(() => firstInput.focus(), 150);
      }

      function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        // ← form ke andar se dhundho
        const errorBox = form ? form.querySelector("#brochureFormError") : null;
        if (errorBox) {
          errorBox.style.display = "none";
          errorBox.textContent = "";
        }
      }

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

      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          closeModal();
        });
      }

      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active"))
          closeModal();
      });

      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();

          // ← SUBMIT KE ANDAR errorBox fetch karo — tab tak DOM mein hoga
          const errorBox = form.querySelector("#brochureFormError");

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
          if (!fields.course.value) {
            fields.course.style.borderColor = "red";
            isValid = false;
          }

          if (!isValid) return;

          const submitBtn = form.querySelector(".form-submit-btn");
          if (!submitBtn) return;

          const originalText = submitBtn.textContent;
          submitBtn.textContent = "Sending...";
          submitBtn.disabled = true;

          // Error box reset
          if (errorBox) {
            errorBox.style.display = "none";
            errorBox.textContent = "";
          }

          try {
            const formData = {
              name: fields.name.value.trim(),
              email: fields.email.value.trim(),
              phone: fields.phone.value.trim(),
              subject: fields.subject.value.trim(),
              message: fields.message.value.trim(),
              course: fields.course.value,
              source: "Brochure Popup",
            };

            const response = await fetch("/api/lead", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log("Popup Lead:", result);

            if (result.success) {
              // ✅ SUCCESS
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
              // ❌ DUPLICATE / ERROR
              if (errorBox) {
                errorBox.textContent =
                  result.message || "Something went wrong.";
                errorBox.style.display = "block";
              }
              submitBtn.textContent = "Failed!";
              setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
              }, 2000);
            }
          } catch (error) {
            console.error("Error:", error);
            if (errorBox) {
              errorBox.textContent = "Unable to connect to the server.";
              errorBox.style.display = "block";
            }
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
