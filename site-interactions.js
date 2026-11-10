(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form || !status) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Thanks for sharing your project. This demo form is not connected to a booking service, so your inquiry was not sent.';
    status.classList.add('is-visible');
    form.reset();
  });
})();
