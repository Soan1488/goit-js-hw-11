import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30861394-45e6fcfd438676dc717df7503';

export default class ImageApiServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getPictures() {
    const options = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });
    const response = await axios.get(`${BASE_URL}?${options}`);
    this.incrementPage();
    return response.data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
