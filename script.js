(() => {
  const root = document.getElementById('world');
  const materials = document.getElementById('materials');
  if (!root) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;

  function update() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (reducedMotion.matches) {
        root.style.setProperty('--world-p', '0');
        root.style.setProperty('--explode', '0');
        root.style.setProperty('--turn', '-29deg');
        root.style.setProperty('--scale', '1.12');
        root.style.setProperty('--drift', '0px');
        return;
      }

      // To keep the "burst out" animation consistent as it was earlier,
      // we need the scroll progress (p) to reach 1.0 at a similar scroll position,
      // regardless of the extra content added below the animated sections.
      // Assuming the animation should complete roughly around the materials section.
      const animationEnd = materials ? materials.offsetTop + materials.offsetHeight : document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, animationEnd - innerHeight);

      const p = Math.min(1, Math.max(0, scrollY / maxScroll));
      const explode = p < 0.24 ? p / 0.24 : p < 0.58 ? 1 : p < 0.82 ? 1 - (p - 0.58) / 0.24 : 0;

      root.style.setProperty('--world-p', p.toFixed(4));
      root.style.setProperty('--explode', explode.toFixed(4));
      root.style.setProperty('--turn', (-29 + p * 125).toFixed(2) + 'deg');
      root.style.setProperty('--scale', (1.12 + p * 0.4).toFixed(4));
      root.style.setProperty('--drift', ((p - 0.4) * 160).toFixed(2) + 'px');
    });
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', update);
  }
  update();
})();
