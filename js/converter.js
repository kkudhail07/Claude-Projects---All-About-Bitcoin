/* ==========================================================================
   Sats converter — "how much Bitcoin can I get for X?"
   Reuses the same live CoinGecko price the rest of the site uses. Self-contained:
   it owns its own fetch so the Get-started page doesn't need the full live feed.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-converter]');
  if (!root) return;

  var amountEl = root.querySelector('[data-conv-amount]');
  var btcEl    = root.querySelector('[data-conv-btc]');
  var satsEl   = root.querySelector('[data-conv-sats]');
  var rateEl   = root.querySelector('[data-conv-rate]');
  var curBtns  = root.querySelectorAll('[data-conv-cur]');
  var presets  = root.querySelectorAll('[data-conv-preset]');

  var prices  = { gbp: null, usd: null };
  var symbols = { gbp: '£', usd: '$' };
  var cur = 'gbp';

  function fmtSats(n) { return Math.round(n).toLocaleString('en-GB'); }
  function fmtMoney(n) { return n.toLocaleString('en-GB', { maximumFractionDigits: 0 }); }
  function fmtBtc(n) {
    if (!n) return '0';
    var s = n.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }

  function render() {
    var price = prices[cur];
    var amount = parseFloat(amountEl.value) || 0;
    if (!price) {
      btcEl.textContent = '—';
      satsEl.textContent = '';
      rateEl.textContent = 'Fetching the live price…';
      return;
    }
    var btc = amount / price;
    btcEl.textContent = fmtSats(btc * 1e8) + ' sats';
    satsEl.textContent = '= ' + fmtBtc(btc) + ' BTC';
    rateEl.innerHTML = 'At <span class="text-ink">' + symbols[cur] + fmtMoney(price) +
      '</span> per bitcoin · live price';
  }

  function setCur(next) {
    cur = next;
    curBtns.forEach(function (b) {
      var on = b.getAttribute('data-conv-cur') === cur;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    render();
  }

  function fetchPrices() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp,usd')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.bitcoin) {
          prices.gbp = d.bitcoin.gbp;
          prices.usd = d.bitcoin.usd;
          render();
        }
      })
      .catch(function () {
        if (!prices[cur]) rateEl.textContent = 'Couldn’t load the live price right now — try refreshing.';
      });
  }

  amountEl.addEventListener('input', render);
  curBtns.forEach(function (b) {
    b.addEventListener('click', function () { setCur(b.getAttribute('data-conv-cur')); });
  });
  presets.forEach(function (p) {
    p.addEventListener('click', function () {
      amountEl.value = p.getAttribute('data-conv-preset');
      render();
    });
  });

  setCur('gbp');
  fetchPrices();
  setInterval(fetchPrices, 60000);
})();
