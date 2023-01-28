import Notiflix from 'notiflix';
import { pixabayAPI } from './fetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const searchMore = document.querySelector('.js-load__more');

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

let page = 0;
let perPage = 40;
let inputValue = input.value;

searchMore.hidden = true;

form.addEventListener('submit', onSubmit);
searchMore.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();
  inputValue = input.value.trim();
  if (!inputValue) {
    clearMarkup();
    return;
  }
  page = 1;
  pixabayAPI(inputValue, page, perPage)
    .then(data => {
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        clearMarkup();
        return;
      }
      clearMarkup();
      markupGallery(data.hits);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      gallerySimpleLightbox.refresh();
      searchMore.hidden = false;

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(err => console.log(err));
}

function markupGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
  <a href="${largeImageURL}"><img class="photo"  src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info_item">
      <b>Likes</b><span class="info_item-api">${likes}</span>
    </p>
    <p class="info_item">
      <b>Views</b><span class="info_item-api">${views}</span>
    </p>
    <p class="info_item">
      <b>Comments</b><span class="info_item-api">${comments}</span>
    </p>
    <p class="info_item">
      <b>Downloads</b><span class="info_item-api">${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  gallery.innerHTML = '';
}

function onLoadMore() {
  page += 1;
  inputValue = input.value.trim();

  pixabayAPI(inputValue, page, perPage)
    .then(data => {
      markupGallery(data.hits);
      let totalPages = data.totalHits / perPage;
      gallerySimpleLightbox.refresh();

      if (page >= totalPages) {
        searchMore.hidden = true;
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => console.log(err));
}
