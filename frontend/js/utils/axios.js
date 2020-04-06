import axios from 'axios';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (const element of cookies) {
      const cookie = element.trim();
      // Does this cookie string begin with the name we want?
      if (cookie.slice(0, Math.max(0, name.length + 1)) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.slice(Math.max(0, name.length + 1)));
        break;
      }
    }
  }
  return cookieValue;
}

const client = axios.create({
  headers: {
    'x-CSRFToken': getCookie('csrftoken'),
  },
  baseURL: process.env.BASE_URL || 'http://localhost:8000/track',
});

export default client;
