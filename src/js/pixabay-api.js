import axios from 'axios';

const API_KEY = '52480069-e3f81e86b58f6705753339629';
const PER_PAGE = 40;

const api = axios.create({
  baseURL: 'https://pixabay.com/api/',
  timeout: 15000,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  },
});

/** @returns {Promise<Object>} data */
export async function getImagesByQuery(query, page) {
  const { data } = await api.get('', { params: { q: query, page } });
  return data;
}

export { PER_PAGE };
