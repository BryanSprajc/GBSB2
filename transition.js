document.addEventListener("DOMContentLoaded", () => {
  const transition = document.querySelector(".page-transition");

  if (!transition) return;

  // Au chargement : enlève le bloc vers la gauche
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("page-loaded");
    });
  });

  // Au clic sur un lien interne
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank"
      ) {
        return;
      }

      const url = new URL(link.href);

      // Lien externe → pas de transition
      if (url.origin !== window.location.origin) return;

      e.preventDefault();

      // Fait revenir le bloc sur l'écran
      document.body.classList.remove("page-loaded");
      document.body.classList.add("page-leaving");

      transition.addEventListener(
        "transitionend",
        () => {
          window.location.href = link.href;
        },
        { once: true }
      );
    });
  });
});