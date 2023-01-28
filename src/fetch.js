import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33196555-32542256d6492fa532620aad6';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';

const pixabayAPI = async (inputValue, page = 1, perPage) => {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${inputValue}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}&page=${page}&per_page=${perPage}`
  );
  return response.data;
};

export { pixabayAPI };
