// AviCore Custom Scripts
// Loaded AFTER main.js. Keep everything namespaced and defensive so it never
// interferes with the template's GSAP / Swiper / Slick / Bootstrap behavior.
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* 1. Highlight the current page in the desktop nav.
              Adds `.active` to the top-level item-link whose href matches the
              current file (falls back to index.html for the site root). */
        try {
            var path = window.location.pathname.split("/").pop() || "index.html";
            var links = document.querySelectorAll(".nav-menu-main .item-link[href]");
            links.forEach(function (link) {
                var href = link.getAttribute("href");
                if (href && href === path) {
                    link.classList.add("active");
                    var parentItem = link.closest(".menu-item");
                    if (parentItem) {
                        var topLink = parentItem.querySelector(":scope > .item-link");
                        if (topLink) { topLink.classList.add("active"); }
                    }
                }
            });
        } catch (e) { /* non-critical */ }

        /* 2. Show the chosen filename next to file inputs (quote / contact forms). */
        try {
            document.querySelectorAll('input[type="file"]').forEach(function (input) {
                input.addEventListener("change", function () {
                    var label = input.closest("fieldset")
                        ? input.closest("fieldset").querySelector("span")
                        : null;
                    if (label && input.files && input.files.length) {
                        label.textContent = input.files[0].name;
                    }
                });
            });
        } catch (e) { /* non-critical */ }

        /* 3. Front-end-only form guard.
              Until a backend is wired up, prevent AviCore forms from doing a raw
              GET to "#" and give the user feedback. Remove/replace when the
              backend endpoint is connected.
              TODO: Connect forms to backend (PHP mailer / Formspree / Laravel). */
        try {
            document.querySelectorAll("form.form-contact, form.avicore-form").forEach(function (form) {
                form.addEventListener("submit", function (ev) {
                    if (form.getAttribute("data-backend") === "true") { return; }
                    ev.preventDefault();
                    var note = form.querySelector(".avicore-form-note");
                    if (!note) {
                        note = document.createElement("p");
                        note.className = "avicore-form-note fw-semibold";
                        note.style.marginTop = "16px";
                        form.appendChild(note);
                    }
                    note.textContent = "Thanks — your request is ready to send. (Form backend not yet connected.)";
                });
            });
        } catch (e) { /* non-critical */ }

    });
})();
