(() => {
  document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input');
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      button.textContent = reveal ? 'Hide' : 'Show';
      button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    });
  });

  document.querySelectorAll('[data-auth-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const password = form.elements.password;
      const confirmation = form.elements['confirm-password'];
      const message = form.querySelector('.auth-message');
      if (password && confirmation && password.value !== confirmation.value) {
        confirmation.setCustomValidity('Passwords do not match.');
        confirmation.reportValidity();
        confirmation.setCustomValidity('');
        return;
      }
      if (!form.reportValidity()) return;
      message.textContent = 'This interface is ready for an authentication service, but no account action was performed.';
      message.classList.add('is-visible');
    });
  });
  document.querySelectorAll('[data-social]').forEach((button) => {
    button.addEventListener('click', () => {
      const message = document.querySelector('.auth-message');
      if (message) {
        message.textContent = `${button.dataset.social} sign-in is not connected yet.`;
        message.classList.add('is-visible');
      }
    });
  });
})();
