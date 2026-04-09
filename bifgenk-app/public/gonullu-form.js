var gonulluForm = document.getElementById('gonulluForm');
if (gonulluForm) {
  gonulluForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var btn = document.getElementById('gonulluSubmitBtn');
    var successEl = document.getElementById('gonulluSuccess');
    var errorEl = document.getElementById('gonulluError');

    btn.disabled = true;
    btn.textContent = 'Gönderiliyor...';
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    var formData = new FormData(gonulluForm);

    fetch('https://formsubmit.co/ajax/info@brisk.be', {
      method: 'POST',
      body: formData
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success === 'true' || data.success === true) {
        successEl.style.display = 'block';
        gonulluForm.reset();
      } else {
        errorEl.style.display = 'block';
      }
      btn.disabled = false;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Başvurumu Gönder';
    })
    .catch(function() {
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Başvurumu Gönder';
    });
  });
}
