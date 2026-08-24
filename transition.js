(() => {
  const body = document.body;
  let navigationStarted = false;

  function revealPage({ instant = false } = {}) {
    const transition = document.querySelector(".page-transition");

    if (instant && transition) {
      transition.style.transition = "none";
    }

    body.classList.remove("page-leaving");
    body.classList.add("page-loaded");

    if (instant && transition) {
      // Force l'état masqué avant de réactiver l'animation.
      void transition.offsetWidth;
      requestAnimationFrame(() => {
        transition.style.removeProperty("transition");
      });
    }

    navigationStarted = false;
  }

  // Chrome peut restaurer une page depuis son cache avec "page-leaving"
  // encore présent. Dans ce cas, le rideau est retiré immédiatement.
  window.addEventListener("pageshow", (event) => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const isHistoryRestore =
      event.persisted || navigationEntry?.type === "back_forward";

    revealPage({ instant: isHistoryRestore });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const transition = document.querySelector(".page-transition");

    if (!transition) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => revealPage());
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (
          navigationStarted ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          !href ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          link.target === "_blank" ||
          link.hasAttribute("download")
        ) {
          return;
        }

        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        event.preventDefault();
        navigationStarted = true;

        body.classList.remove("page-loaded");
        body.classList.add("page-leaving");

        let hasNavigated = false;
        const navigate = () => {
          if (hasNavigated) return;
          hasNavigated = true;
          window.location.assign(url.href);
        };

        transition.addEventListener(
          "transitionend",
          (transitionEvent) => {
            if (transitionEvent.propertyName === "transform") navigate();
          },
          { once: true }
        );

        // Sécurité si transitionend n'est pas émis.
        window.setTimeout(navigate, 850);
      });
    });
  });
})();
