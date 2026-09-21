(() => {
  const motionAllowed = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  ).matches;

  if (!motionAllowed || !("IntersectionObserver" in window)) return;

  const selector = [
    "main h1",
    "main h2",
    "main h3",
    "main p",
    "main li",
    "main .eyebrow",
    "main .hero__actions",
    "main .contract-tab",
    "main .realisation-card",
    "main .contact-info-item7",
    "main .contact-rdv-card7",
    "main .contact-field7",
    "main .process-back3"
  ].join(",");

  const elements = Array.from(document.querySelectorAll(selector)).filter(
    (element) => !element.closest(".navbar")
  );

  elements.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.style.setProperty("--reveal-delay", `${(index % 5) * 45}ms`);
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -7% 0px"
    }
  );

  elements.forEach((element) => observer.observe(element));
})();
