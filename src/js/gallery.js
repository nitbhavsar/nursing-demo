/* gallery.js
   Handles:
   1. Category filter (show/hide with fade)
   2. Lightbox (open, close, prev, next, keyboard, swipe)
*/
(function () {

  // ── FILTER ────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.gf-btn');
  const items      = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.display = '';
          setTimeout(() => item.classList.remove('gi-hidden'), 10);
        } else {
          item.classList.add('gi-hidden');
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ── LIGHTBOX ──────────────────────────────────────────────
  const lightbox  = document.getElementById('lightbox');
  const backdrop  = document.getElementById('lightboxBackdrop');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  let currentIndex  = 0;
  let visibleItems  = [];

  function getVisible() {
    return Array.from(items).filter(el => el.style.display !== 'none');
  }

  function openLightbox(index) {
    visibleItems = getVisible();
    currentIndex = index;
    showImage(currentIndex);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => lightbox.classList.add('lb-active'), 10);
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-active');
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  function showImage(index) {
    const item    = visibleItems[index];
    const img     = item.querySelector('img');
    const caption = item.querySelector('.gi-caption');

    lbImg.src       = img.src;
    lbImg.alt       = img.alt;
    lbCaption.textContent = caption ? caption.textContent : '';
    lbCounter.textContent = `${index + 1} / ${visibleItems.length}`;

    // Disable prev/next at edges
    lbPrev.disabled = index === 0;
    lbNext.disabled = index === visibleItems.length - 1;
  }

  function prevImage() {
    if (currentIndex > 0) {
      currentIndex--;
      showImage(currentIndex);
    }
  }

  function nextImage() {
    if (currentIndex < visibleItems.length - 1) {
      currentIndex++;
      showImage(currentIndex);
    }
  }

  // Open on zoom button click
  items.forEach((item, i) => {
    const zoomBtn = item.querySelector('.gi-zoom');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        visibleItems = getVisible();
        openLightbox(visibleItems.indexOf(item));
      });
    }
    // Also open on image click
    const img = item.querySelector('img');
    if (img) {
      img.addEventListener('click', () => {
        visibleItems = getVisible();
        openLightbox(visibleItems.indexOf(item));
      });
    }
  });

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'none') return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  }, { passive: true });

})();
