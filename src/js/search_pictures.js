import ImageApiServise from './fetch';
import Notiflix from 'notiflix';
import galleryTamplate from '../tamplates/gallery.hbs';

const refs = {
  formEl: document.querySelector('#search-form'),
  gelleryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const imageApiServise = new ImageApiServise();

console.log('F');

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();
  imageApiServise.query = e.currentTarget.elements.searchQuery.value;
  imageApiServise.resetPage();
  galleryRemove();

  imageApiServise.getPictures().then(resp => {
    if (resp.length === 0) {
      refs.loadMore.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      galleryMarkUP(resp.hits);
      refs.loadMore.classList.remove('hidden');
      console.log(resp.totalHits);
    }
  });
}

function onLoadMore(e) {
  imageApiServise.getPictures().then(resp => {
    if ((imageApiServise.page - 1) * 40 > resp.totalHits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      galleryMarkUP(resp.hits);
      refs.loadMore.classList.add('hidden');
    } else {
      galleryMarkUP(resp.hits);
    }
  });
}

function galleryMarkUP(images) {
  refs.gelleryEl.insertAdjacentHTML('beforeend', galleryTamplate(images));
}

function galleryRemove() {
  refs.gelleryEl.innerHTML = '';
}
