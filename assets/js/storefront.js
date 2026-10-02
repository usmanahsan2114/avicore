(function () {
    "use strict";

    function initMobileMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!toggle || !menu) {
            return;
        }

        var closeMenu = function (restoreFocus) {
            toggle.setAttribute("aria-expanded", "false");
            menu.classList.remove("is-open");
            document.body.classList.remove("menu-open");
            if (restoreFocus) {
                toggle.focus();
            }
        };

        var openMenu = function () {
            toggle.setAttribute("aria-expanded", "true");
            menu.classList.add("is-open");
            document.body.classList.add("menu-open");
            var firstLink = menu.querySelector("a");
            if (firstLink) {
                firstLink.focus();
            }
        };

        toggle.addEventListener("click", function () {
            if (toggle.getAttribute("aria-expanded") === "true") {
                closeMenu(false);
            } else {
                openMenu();
            }
        });

        menu.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                closeMenu(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && menu.classList.contains("is-open")) {
                closeMenu(true);
            }

            if (event.key !== "Tab" || !menu.classList.contains("is-open")) {
                return;
            }

            var focusable = Array.from(
                menu.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')
            );
            if (!focusable.length) {
                return;
            }

            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 860 && menu.classList.contains("is-open")) {
                closeMenu(false);
            }
        });
    }

    function initTemplateNavigation() {
        var header = document.querySelector(".tf-header");
        if (!header) {
            return;
        }

        var current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        var directLinks = Array.from(header.querySelectorAll(".nav-menu-main a[href]"));
        directLinks.forEach(function (link) {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        });

        var exact = directLinks.find(function (link) {
            return (link.getAttribute("href") || "").split("#")[0].toLowerCase() === current;
        });
        if (exact) {
            exact.classList.add("active");
            exact.setAttribute("aria-current", "page");
            var parentMenu = exact.closest(".menu-item.has-child");
            var parentLink = parentMenu && parentMenu.querySelector(":scope > .item-link");
            if (parentLink) {
                parentLink.classList.add("active");
            }
        }

        /*
         * Older Apache rules briefly issued permanent redirects containing a
         * Windows filesystem path. Chrome can retain those 301 responses even
         * after the server is fixed. Give every header destination a canonical
         * web path and a versioned query so cached redirects cannot be replayed.
         */
        var isLocalAvicoreSubfolder = /^\/avicore(?:\/|$)/i.test(window.location.pathname);
        var siteRoot = isLocalAvicoreSubfolder ? "/avicore/" : "/";
        var navigationVersion = isLocalAvicoreSubfolder ? "?nav=20260728-2" : "";

        Array.from(header.querySelectorAll("a[href]")).forEach(function (link) {
            var rawHref = (link.getAttribute("href") || "").trim();
            if (!rawHref || rawHref.charAt(0) === "#" || /^(?:https?:|mailto:|tel:)/i.test(rawHref)) {
                return;
            }

            var normalized = rawHref.replace(/\\/g, "/");
            var hashIndex = normalized.indexOf("#");
            var hash = hashIndex >= 0 ? normalized.slice(hashIndex) : "";
            var pathOnly = (hashIndex >= 0 ? normalized.slice(0, hashIndex) : normalized).split("?")[0];
            var fileName = pathOnly.split("/").pop();
            if (!/^[a-z0-9][a-z0-9-]*\.html$/i.test(fileName)) {
                return;
            }

            link.setAttribute("href", siteRoot + fileName + navigationVersion + hash);
        });

        var toggle = header.querySelector(".open-mb-menu");
        var sourceNav = header.querySelector(".nav-menu-main");
        if (!toggle || !sourceNav) {
            return;
        }

        var drawer = document.createElement("div");
        drawer.className = "avicore-mobile-drawer";
        drawer.id = "avicore-mobile-navigation";
        drawer.setAttribute("aria-hidden", "true");
        drawer.innerHTML =
            '<button type="button" class="avicore-mobile-backdrop" aria-label="Close navigation"></button>' +
            '<div class="avicore-mobile-panel" role="dialog" aria-modal="true" aria-label="Site navigation">' +
            '<div class="avicore-mobile-top"><span class="avicore-mark">Avi<span class="avicore-mark-accent">Core</span></span>' +
            '<button type="button" class="avicore-mobile-close" aria-label="Close navigation">&times;</button></div>' +
            '<nav aria-label="Mobile navigation"></nav>' +
            '<a class="tf-btn avicore-mobile-cta" href="quote.html">Start a Project</a></div>';

        var clonedNav = sourceNav.cloneNode(true);
        clonedNav.classList.add("avicore-mobile-links");
        drawer.querySelector("nav").appendChild(clonedNav);
        document.body.appendChild(drawer);

        var closeButton = drawer.querySelector(".avicore-mobile-close");
        var backdrop = drawer.querySelector(".avicore-mobile-backdrop");
        var firstLink = drawer.querySelector("a[href]");

        var close = function (restoreFocus) {
            drawer.classList.remove("is-open");
            drawer.setAttribute("aria-hidden", "true");
            toggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("avicore-drawer-open");
            if (restoreFocus) {
                toggle.focus();
            }
        };

        var open = function () {
            drawer.classList.add("is-open");
            drawer.setAttribute("aria-hidden", "false");
            toggle.setAttribute("aria-expanded", "true");
            document.body.classList.add("avicore-drawer-open");
            if (firstLink) {
                firstLink.focus();
            }
        };

        toggle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (drawer.classList.contains("is-open")) {
                close(false);
            } else {
                open();
            }
        }, true);
        closeButton.addEventListener("click", function () { close(true); });
        backdrop.addEventListener("click", function () { close(true); });
        drawer.addEventListener("click", function (event) {
            if (event.target.closest("a[href]")) {
                close(false);
            }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && drawer.classList.contains("is-open")) {
                close(true);
            }
        });
    }

    function initProductFilters() {
        var filters = document.querySelector("[data-product-filters]");
        var grid = document.querySelector("[data-product-grid]");
        if (!filters || !grid) {
            return;
        }

        var buttons = Array.from(filters.querySelectorAll("[data-filter]"));
        var cards = Array.from(grid.querySelectorAll("[data-category]"));
        var status = document.querySelector("[data-filter-status]");

        var applyFilter = function (filter) {
            var visible = 0;
            cards.forEach(function (card) {
                var categories = (card.getAttribute("data-category") || "").split(" ");
                var show = filter === "all" || categories.indexOf(filter) !== -1;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });

            buttons.forEach(function (button) {
                button.setAttribute(
                    "aria-pressed",
                    String(button.getAttribute("data-filter") === filter)
                );
            });

            if (status) {
                status.textContent =
                    visible + (visible === 1 ? " product line shown" : " product lines shown");
            }
        };

        filters.addEventListener("click", function (event) {
            var button = event.target.closest("[data-filter]");
            if (!button) {
                return;
            }
            applyFilter(button.getAttribute("data-filter") || "all");
        });

        applyFilter("all");
    }

    function setFormStatus(form, message, kind) {
        var status = form.querySelector("[data-form-status]");
        if (!status) {
            return;
        }
        status.textContent = message;
        status.classList.remove("is-success", "is-error");
        if (kind) {
            status.classList.add("is-" + kind);
        }
    }

    function initInquiryForms() {
        document.querySelectorAll("form[data-avicore-form]").forEach(function (form) {
            var startedAt = form.querySelector('input[name="form_started_at"]');
            if (startedAt) {
                startedAt.value = String(Math.floor(Date.now() / 1000));
            }

            var file = form.querySelector('input[type="file"]');
            var fileHint = form.querySelector("[data-file-hint]");
            if (file && fileHint) {
                file.addEventListener("change", function () {
                    fileHint.textContent = file.files && file.files.length
                        ? file.files[0].name
                        : "PDF, JPG, PNG, WebP, DOCX, DXF or DWG up to 8 MB.";
                });
            }

            form.addEventListener("submit", async function (event) {
                event.preventDefault();
                if (!form.checkValidity()) {
                    form.reportValidity();
                    setFormStatus(form, "Please complete the required fields.", "error");
                    return;
                }

                var submit = form.querySelector('button[type="submit"]');
                var originalText = submit ? submit.textContent : "";
                if (submit) {
                    submit.disabled = true;
                    submit.textContent = "Sending…";
                }
                setFormStatus(form, "Securely sending your request…");

                try {
                    var data = new FormData(form);
                    data.set("page_url", window.location.href);
                    var response = await fetch(form.action, {
                        method: "POST",
                        body: data,
                        headers: { Accept: "application/json" },
                    });
                    var payload = await response.json().catch(function () {
                        return {};
                    });

                    if (!response.ok || !payload.ok) {
                        throw new Error(payload.message || "Your request could not be sent.");
                    }

                    var reference = payload.reference ? " Reference: " + payload.reference + "." : "";
                    setFormStatus(
                        form,
                        "Thank you—your request has been received." + reference,
                        "success"
                    );
                    form.reset();
                    if (startedAt) {
                        startedAt.value = String(Math.floor(Date.now() / 1000));
                    }
                    if (fileHint) {
                        fileHint.textContent = "PDF, JPG, PNG, WebP, DOCX, DXF or DWG up to 8 MB.";
                    }
                } catch (error) {
                    setFormStatus(
                        form,
                        error && error.message
                            ? error.message + " You can also email info@fsdcpak.com."
                            : "Your request could not be sent. Email info@fsdcpak.com.",
                        "error"
                    );
                } finally {
                    if (submit) {
                        submit.disabled = false;
                        submit.textContent = originalText;
                    }
                }
            });
        });
    }

    function setCurrentYear() {
        document.querySelectorAll("[data-current-year]").forEach(function (node) {
            node.textContent = String(new Date().getFullYear());
        });
    }

    function initCompatibilityTabs() {
        var tabs = Array.from(document.querySelectorAll("[data-avicore-tab]"));
        var panels = Array.from(document.querySelectorAll("[data-avicore-panel]"));
        if (!tabs.length || !panels.length) {
            return;
        }

        var activate = function (key, focusTab) {
            tabs.forEach(function (tab) {
                var active = tab.getAttribute("data-avicore-tab") === key;
                tab.classList.toggle("is-active", active);
                tab.setAttribute("aria-selected", String(active));
                tab.setAttribute("tabindex", active ? "0" : "-1");
                if (active && focusTab) {
                    tab.focus();
                }
            });

            panels.forEach(function (panel) {
                var active = panel.getAttribute("data-avicore-panel") === key;
                panel.classList.toggle("is-active", active);
                panel.hidden = !active;
            });
        };

        tabs.forEach(function (tab, index) {
            tab.addEventListener("click", function () {
                activate(tab.getAttribute("data-avicore-tab"), false);
            });
            tab.addEventListener("keydown", function (event) {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") {
                    return;
                }
                event.preventDefault();
                var nextIndex = index;
                if (event.key === "ArrowRight") {
                    nextIndex = (index + 1) % tabs.length;
                } else if (event.key === "ArrowLeft") {
                    nextIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (event.key === "Home") {
                    nextIndex = 0;
                } else if (event.key === "End") {
                    nextIndex = tabs.length - 1;
                }
                activate(tabs[nextIndex].getAttribute("data-avicore-tab"), true);
            });
        });
    }

    function initPointerInteractions() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        document.querySelectorAll("[data-parallax-card]").forEach(function (card) {
            card.addEventListener("pointermove", function (event) {
                if (event.pointerType === "touch") {
                    return;
                }
                var rect = card.getBoundingClientRect();
                var x = (event.clientX - rect.left) / rect.width - 0.5;
                var y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    "perspective(900px) rotateX(" + (-y * 3.5).toFixed(2) +
                    "deg) rotateY(" + (x * 4).toFixed(2) + "deg) translateY(-3px)";
            });
            card.addEventListener("pointerleave", function () {
                card.style.transform = "";
            });
        });

        var orbs = Array.from(document.querySelectorAll("[data-parallax-orb]"));
        if (!orbs.length) {
            return;
        }
        window.addEventListener("pointermove", function (event) {
            var x = event.clientX / window.innerWidth - 0.5;
            var y = event.clientY / window.innerHeight - 0.5;
            orbs.forEach(function (orb, index) {
                var strength = index % 2 === 0 ? 18 : -14;
                orb.style.marginLeft = (x * strength).toFixed(1) + "px";
                orb.style.marginTop = (y * strength).toFixed(1) + "px";
            });
        }, { passive: true });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initMobileMenu();
        initTemplateNavigation();
        initProductFilters();
        initInquiryForms();
        initCompatibilityTabs();
        initPointerInteractions();
        setCurrentYear();
    });
})();
