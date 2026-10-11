/* ==========================================================================
   All About Bitcoin — shared chrome + UI behaviour

   The nav and footer are defined ONCE here and injected into every page's
   <header id="site-header"> and <footer id="site-footer"> placeholders.
   To change the menu, edit the NAV array below — that's it, every page updates.
   The active item is chosen from <body data-page="..."> (the page's filename
   without .html, e.g. data-page="faq").
   ========================================================================== */
(function () {
  'use strict';

  // ---- single source of truth for the menu --------------------------------
  // Plain items are { href, label }. A group { label, children:[...] } renders as
  // an "Explore" dropdown on desktop and a labelled group in the mobile overlay.
  var NAV = [
    { href: 'index.html', label: 'Home' },
    { href: 'learn.html', label: 'Learn' },
    { href: 'why.html',   label: 'Why' },
    { label: 'Explore', children: [
      { href: 'videos.html',   label: 'Videos',   desc: 'Watch & learn' },
      { href: 'books.html',    label: 'Books',    desc: 'Go deeper' },
      { href: 'articles.html', label: 'Articles', desc: 'Essential essays' },
      { href: 'network.html',  label: 'Network',  desc: 'Live data' }
    ] },
    { href: 'start.html', label: 'Get started' },
    { href: 'safety.html', label: 'Safety' },
    { href: 'faq.html',    label: 'FAQ' }
  ];

  var current = (document.body.getAttribute('data-page') || 'index') + '.html';

  var caret = '<svg class="nav-dd-caret" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var arrow = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // every page, flattened (groups expanded in place) — used for the footer
  function flatten() {
    var out = [];
    NAV.forEach(function (item) {
      if (item.children) { item.children.forEach(function (c) { out.push(c); }); }
      else { out.push(item); }
    });
    return out;
  }

  // desktop nav: plain links + an Explore dropdown
  function desktopNav() {
    return NAV.map(function (item) {
      if (item.children) {
        var groupActive = item.children.some(function (c) { return c.href === current; });
        var items = item.children.map(function (c) {
          var act = c.href === current ? ' active' : '';
          return '<a href="' + c.href + '" role="menuitem" class="nav-dd-item' + act + '">' +
            '<span class="ddi-label">' + c.label + '</span>' +
            '<span class="ddi-desc">' + c.desc + '</span></a>';
        }).join('');
        return '<div class="nav-dd" data-nav-dd>' +
          '<button type="button" data-nav-dd-btn class="nav-link nav-dd-btn' + (groupActive ? ' active' : '') + '" aria-haspopup="true" aria-expanded="false">' +
            item.label + caret + '</button>' +
          '<div class="nav-dd-menu" role="menu"><div class="nav-dd-panel">' + items + '</div></div>' +
        '</div>';
      }
      var active = item.href === current ? ' active' : '';
      return '<a href="' + item.href + '" class="nav-link' + active + '">' + item.label + '</a>';
    }).join('');
  }

  // full-screen mobile overlay: big spine links + a labelled Explore group
  function mobileNav() {
    return NAV.map(function (item) {
      if (item.children) {
        return '<div class="mobile-group">' + item.label + '</div>' +
          item.children.map(function (c) {
            var act = c.href === current ? ' active' : '';
            return '<a href="' + c.href + '" class="mobile-link mobile-sub' + act + '">' + c.label + arrow + '</a>';
          }).join('');
      }
      var active = item.href === current ? ' active' : '';
      return '<a href="' + item.href + '" class="mobile-link' + active + '">' + item.label + arrow + '</a>';
    }).join('');
  }

  // footer keeps every page as a flat, comprehensive list
  function footerLinks() {
    return flatten().map(function (c) {
      return '<a href="' + c.href + '" class="hover:text-ink">' + c.label + '</a>';
    }).join('');
  }

  function brand() {
    return '<a href="index.html" class="flex items-center gap-2.5">' +
      '<img src="assets/logo.png" alt="All About Bitcoin logo" class="brand-logo">' +
      '<span class="font-display font-bold text-lg tracking-tight">All About <span class="text-bitcoin">Bitcoin</span></span></a>';
  }

  // ---- icons --------------------------------------------------------------
  var sun  = '<svg class="theme-ic-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var moon = '<svg class="theme-ic-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  var themeBtn = '<button data-theme-toggle type="button" aria-label="Switch between light and dark theme" aria-pressed="false" title="Toggle theme" class="icon-btn">' + sun + moon + '</button>';
  var menuBtn  = '<button data-menu-toggle aria-label="Open menu" aria-expanded="false" class="lg:hidden icon-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>';
  var closeBtn = '<button data-menu-close type="button" aria-label="Close menu" class="icon-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg></button>';

  // ---- social links -------------------------------------------------------
  var socials = '<div class="flex items-center gap-3">' +
    '<a href="https://x.com/all_about_btc_" target="_blank" rel="noopener" aria-label="Follow All About Bitcoin on X" title="X" class="social-link"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a>' +
    '<a href="https://www.instagram.com/all_about_btc" target="_blank" rel="noopener" aria-label="Follow All About Bitcoin on Instagram" title="Instagram" class="social-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>' +
    '<a href="https://www.tiktok.com/@all_about_btc" target="_blank" rel="noopener" aria-label="Follow All About Bitcoin on TikTok" title="TikTok" class="social-link"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>' +
  '</div>';

  // ---- header + footer markup ---------------------------------------------
  var headerHTML =
    '<nav class="nav">' +
      '<div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">' +
        brand() +
        '<div class="flex items-center gap-2">' +
          '<div class="hidden lg:flex items-center gap-5 mr-1">' + desktopNav() + '</div>' +
          themeBtn + menuBtn +
        '</div>' +
      '</div>' +
    '</nav>' +
    '<div data-mobile-menu class="mobile-menu">' +
      '<div class="mobile-menu-head">' + brand() + closeBtn + '</div>' +
      '<nav class="mobile-menu-links">' + mobileNav() + '</nav>' +
      '<div class="mobile-menu-foot">' + socials + '</div>' +
    '</div>';

  var footerHTML =
    '<div class="max-w-7xl mx-auto px-4 py-12">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">' +
        brand() +
        '<nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">' + footerLinks() + '</nav>' +
      '</div>' +
      socials +
      '<div class="border-t border-line mt-8 pt-6 text-sm text-dim flex flex-col sm:flex-row justify-between gap-2">' +
        '<p>© <span data-year></span> All About Bitcoin · Educational resource, not financial advice.</p>' +
        '<p>Live data: CoinGecko · mempool.space</p>' +
      '</div>' +
    '</div>';

  var headerEl = document.getElementById('site-header');
  if (headerEl) headerEl.innerHTML = headerHTML;
  var footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.innerHTML = footerHTML;

  // =========================================================================
  // Behaviour (runs after the chrome above is in the DOM)
  // =========================================================================

  // Mobile menu (full-screen overlay)
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    var closeEl = menu.querySelector('[data-menu-close]');
    if (closeEl) closeEl.addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // Desktop "Explore" dropdown — CSS opens it on hover/focus; JS just keeps
  // aria-expanded in sync and lets Escape close it for keyboard users.
  document.querySelectorAll('[data-nav-dd]').forEach(function (dd) {
    var btn = dd.querySelector('[data-nav-dd-btn]');
    var expanded = function (v) { if (btn) btn.setAttribute('aria-expanded', v ? 'true' : 'false'); };
    dd.addEventListener('mouseenter', function () { expanded(true); });
    dd.addEventListener('mouseleave', function () { expanded(false); });
    dd.addEventListener('focusin', function () { expanded(true); });
    dd.addEventListener('focusout', function () { expanded(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var a = document.activeElement;
    if (a && a.closest && a.closest('[data-nav-dd]') && a.blur) a.blur();
  });

  // Sticky mobile CTA — reveal after the hero, hide near the footer
  var stickies = document.querySelectorAll('[data-sticky-cta]');
  if (stickies.length) {
    var syncSticky = function () {
      var nearFooter = (window.innerHeight + window.scrollY) > (document.body.scrollHeight - 240);
      var show = window.scrollY > 460 && !nearFooter;
      stickies.forEach(function (el) { el.classList.toggle('show', show); });
    };
    window.addEventListener('scroll', syncSticky, { passive: true });
    window.addEventListener('resize', syncSticky);
    syncSticky();
  }

  // Scroll reveal
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Footer year
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  // Theme toggle (the no-flash <head> script sets the initial theme)
  var root = document.documentElement;
  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function syncPressed() {
    var light = currentTheme() === 'light';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', light ? 'true' : 'false');
    });
  }
  syncPressed();
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('aab-theme', next); } catch (e) {}
      syncPressed();
    });
  });
})();
