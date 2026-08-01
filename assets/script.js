// Static email: click to copy, never opens a mail app
(function () {
  var emailEls = document.querySelectorAll('.copy-email');
  emailEls.forEach(function (el) {
    var originalText = el.textContent;
    var email = el.getAttribute('data-email') || originalText;
    el.setAttribute('title', 'Click to copy');
    el.addEventListener('click', function () {
      copyToClipboard(email);
      el.textContent = 'Copied';
      el.classList.add('copied');
      setTimeout(function () {
        el.textContent = originalText;
        el.classList.remove('copied');
      }, 1500);
    });
  });

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(temp);
  }
})();

// Load devices.json and render into #device-grid, if present on the page
(function () {
  var grid = document.getElementById('device-grid');
  if (!grid) return;

  fetch('devices.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load devices.json');
      return res.json();
    })
    .then(function (devices) {
      if (!devices || devices.length === 0) {
        grid.innerHTML = '<p class="device-empty">No devices listed right now — check back soon, or get in touch to ask what is coming up.</p>';
        return;
      }
      grid.innerHTML = devices.map(renderDeviceCard).join('');
    })
    .catch(function () {
      grid.innerHTML = '<p class="device-empty">Could not load current stock. Please get in touch directly to check availability.</p>';
    });

  function renderDeviceCard(d) {
    var isSold = (d.status || '').toLowerCase() === 'sold';
    var statusClass = isSold ? 'device-status sold' : 'device-status';
    var statusLabel = isSold ? 'Sold' : 'In stock';
    return (
      '<div class="device-card">' +
        '<div class="' + statusClass + '">' + statusLabel + '</div>' +
        '<h3>' + escapeHtml(d.name || '') + '</h3>' +
        '<div class="device-specs">' + escapeHtml(d.specs || '') + '</div>' +
        '<div class="device-price">' + escapeHtml(d.price || '') + '</div>' +
        '<div class="device-note">' + escapeHtml(d.note || '') + '</div>' +
      '</div>'
    );
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
