const API = '27850756-bbddce2f901f47d46fa8e0033';
const ROOT_URL = 'https://pixabay.com/api/';
const axios = require('axios');

export const imageRequest = async (query, page) => {
  const params = new URLSearchParams({
    key: API,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });

  // return fetch(`${ROOT_URL}?${params}`).then(response => {
  //     if (!response.ok) {
  //         throw new Error(response.status);
  //       }
  //   return response.json();
  // });
  return (await axios.get(`${ROOT_URL}?${params}`)).data;
};
