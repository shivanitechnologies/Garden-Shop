(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form || !status) return;

  const visitDate = form.elements.namedItem('visit-date');
  if (visitDate instanceof HTMLInputElement && visitDate.type === 'date') {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    visitDate.min = localDate;
  }

  form.addEventListener('input', () => {
    status.textContent = '';
    status.classList.remove('is-visible');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Your site visit details are complete. This demo is not connected to a booking service, so your request has not been sent or booked.';
    status.classList.add('is-visible');
  });
})();
