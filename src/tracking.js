const ttTrack = (eventName, params = {}) => {
  try {
    if (window.ttq?.track) window.ttq.track(eventName, params);
  } catch (_) {
    // Tracking must never break the page experience.
  }
};

const normalizeLabel = (el) =>
  (el?.getAttribute('aria-label') || el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);

const trackLinkInteraction = (el) => {
  const href = el?.getAttribute?.('href') || '';
  const label = normalizeLabel(el);

  const isContact =
    /^tel:/i.test(href) ||
    /^mailto:/i.test(href) ||
    /wa\.me|whatsapp\.com/i.test(href) ||
    el?.matches?.('[data-track-contact]');

  if (isContact) {
    ttTrack('Contact', {
      content_type: 'contact',
      description: label || 'contact_click'
    });
    return;
  }

  const isWatchCTA = href === '#watch' || /youtube\.com|youtu\.be/i.test(href);
  if (isWatchCTA) {
    ttTrack('ViewContent', {
      content_type: 'entertainment',
      description: label || 'watch_cta_click'
    });
    return;
  }

  if (href === '#about') {
    ttTrack('ViewContent', {
      content_type: 'entertainment',
      description: label || 'about_cta_click'
    });
  }
};

// Delegated tracking keeps working even if CTA markup changes later.
document.addEventListener('click', (event) => {
  const interactive = event.target?.closest?.('a,button');
  if (!interactive) return;

  trackLinkInteraction(interactive);

  const chatviceHost = interactive.closest?.('[id*="chatvice" i],[class*="chatvice" i],[data-chatvice]');
  if (chatviceHost) {
    ttTrack('Contact', {
      content_type: 'chat',
      description: 'chatvice_open'
    });
  }
}, true);

// Track meaningful section exposure only once per page view.
const observeImportantSections = () => {
  const watchSection = document.getElementById('watch');
  if (!watchSection || !('IntersectionObserver' in window)) return;

  let sent = false;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!sent && entry.isIntersecting && entry.intersectionRatio >= 0.55) {
        sent = true;
        ttTrack('ViewContent', {
          content_type: 'entertainment',
          description: 'watch_section_view'
        });
        observer.disconnect();
        break;
      }
    }
  }, { threshold: [0.55] });

  observer.observe(watchSection);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeImportantSections, { once: true });
} else {
  observeImportantSections();
}

// Some Chatvice versions render a same-document launcher after an async load.
// Observe it so a launcher click can be tracked without depending on load order.
const chatviceObserver = new MutationObserver(() => {
  const launcher = document.querySelector('[id*="chatvice" i],[class*="chatvice" i],[data-chatvice]');
  if (launcher) launcher.setAttribute('data-track-contact', 'chatvice');
});
chatviceObserver.observe(document.documentElement, { childList: true, subtree: true });
