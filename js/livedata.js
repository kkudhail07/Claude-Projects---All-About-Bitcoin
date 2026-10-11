/* ==========================================================================
   All About Bitcoin — live network data
   - BTC price in GBP + USD (+ 24h change, market cap)  -> CoinGecko
   - Coins mined to date, % of 21M, block height, halving -> mempool.space
   All free, no API key, fetched client-side and polled on an interval.
   Updates EVERY element carrying the matching data hook, so the slim
   ticker and the full home dashboard stay in sync.
   ========================================================================== */
(function () {
  'use strict';

  var HALVING_INTERVAL = 210000;
  var MAX_SUPPLY = 21000000;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- formatting helpers --------------------------------------------------
  var gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
  var usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat('en-GB');

  function compactCurrency(value, symbol) {
    if (value >= 1e12) return symbol + (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9)  return symbol + (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6)  return symbol + (value / 1e6).toFixed(2) + 'M';
    return symbol + num.format(Math.round(value));
  }

  function setAll(hook, text, flash) {
    var nodes = document.querySelectorAll('[data-live="' + hook + '"]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.textContent === text) continue;
      el.textContent = text;
      if (flash && !prefersReduced) {
        el.classList.remove('flash');
        void el.offsetWidth;            // restart animation
        el.classList.add('flash');
      }
    }
  }

  function setDelta(hook, change) {
    var nodes = document.querySelectorAll('[data-live="' + hook + '"]');
    if (change == null || isNaN(change)) return;
    var up = change >= 0;
    var label = (up ? '▲ ' : '▼ ') + Math.abs(change).toFixed(2) + '%';
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = label;
      nodes[i].classList.toggle('up', up);
      nodes[i].classList.toggle('down', !up);
    }
  }

  function markLive(ok) {
    var dots = document.querySelectorAll('[data-pulse]');
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('stale', !ok);
    var stamp = ok ? 'Updated ' + new Date().toLocaleTimeString('en-GB') : 'Reconnecting…';
    setAll('updated', stamp, false);
  }

  // ---- mined supply from block height (precise, epoch by epoch) ------------
  function minedFromHeight(height) {
    var blocks = height + 1; // genesis is block 0
    var mined = 0, subsidy = 50, remaining = blocks;
    while (remaining > 0) {
      var inEpoch = Math.min(remaining, HALVING_INTERVAL);
      mined += inEpoch * subsidy;
      remaining -= inEpoch;
      subsidy /= 2;
    }
    return mined;
  }

  // ---- network calls -------------------------------------------------------
  function fetchPrice() {
    return fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp,usd&include_24hr_change=true&include_market_cap=true')
      .then(function (r) { if (!r.ok) throw new Error('price ' + r.status); return r.json(); })
      .then(function (d) {
        var b = d.bitcoin;
        setAll('price-gbp', gbp.format(b.gbp), true);
        setAll('price-usd', usd.format(b.usd), true);
        setDelta('change-gbp', b.gbp_24h_change);
        setDelta('change-usd', b.usd_24h_change);
        if (b.usd_market_cap) setAll('mcap', compactCurrency(b.usd_market_cap, '$'), false);
        return true;
      });
  }

  var lastHeight = 0;
  function fetchSupply() {
    return fetch('https://mempool.space/api/blocks/tip/height')
      .then(function (r) { if (!r.ok) throw new Error('height ' + r.status); return r.text(); })
      .then(function (t) {
        var height = parseInt(t, 10);
        if (isNaN(height)) throw new Error('bad height');
        var newBlock = height > lastHeight && lastHeight !== 0;
        lastHeight = height;

        var mined = minedFromHeight(height);
        var pct = (mined / MAX_SUPPLY) * 100;
        var epoch = Math.floor(height / HALVING_INTERVAL);
        var nextHalving = (epoch + 1) * HALVING_INTERVAL;
        var toHalving = nextHalving - height;

        setAll('mined', num.format(Math.round(mined)) + ' BTC', newBlock);
        setAll('mined-pct', pct.toFixed(2) + '%', false);
        setAll('height', '#' + num.format(height), newBlock);
        setAll('halving', num.format(toHalving) + ' blocks', false);
        setAll('halving-date', estHalvingDate(toHalving), false);

        var bars = document.querySelectorAll('[data-supply-bar]');
        for (var i = 0; i < bars.length; i++) bars[i].style.width = pct.toFixed(2) + '%';
        return true;
      });
  }

  function estHalvingDate(blocksLeft) {
    var ms = blocksLeft * 10 * 60 * 1000; // ~10 min/block
    var d = new Date(Date.now() + ms);
    return '~' + d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  // ---- orchestration -------------------------------------------------------
  function refresh() {
    Promise.allSettled([fetchPrice(), fetchSupply()]).then(function (results) {
      var ok = results.every(function (r) { return r.status === 'fulfilled'; });
      markLive(ok);
    });
  }

  function start() {
    if (!document.querySelector('[data-live]')) return; // nothing to populate
    refresh();
    setInterval(fetchPrice, 30000);  // price every 30s
    setInterval(fetchSupply, 60000); // supply / blocks every 60s
    setInterval(function () { setAll('updated', 'Updated ' + new Date().toLocaleTimeString('en-GB'), false); }, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
