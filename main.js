// navbar //
window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('window-scroll', window.scrollY > 50);
});

// slider //
let next = document.querySelector('.next');
let prev = document.querySelector('.prev');
next.addEventListener('click', function() {
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').appendChild(items[0]);
});
prev.addEventListener('click', function() {
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').prepend(items[items.length - 1]);
});


// sign-up cliend side js //
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.sign-up__form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Form submitted');

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      console.log('Form data:', data);

      try {
        console.log('Sending request to /signup');
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        const responseElement = document.getElementById('response');
        if (responseElement) {
          responseElement.textContent = result.message;
        } else {
          console.log('Signup response:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        const responseElement = document.getElementById('response');
        if (responseElement) {
          responseElement.textContent = 'An error occurred. Please try again.';
        } else {
          console.log('Error signing up. Please try again.');
        }
      }
    });
  } else {
    console.error('Form with class "sign-up__form" not found');
  }
});

