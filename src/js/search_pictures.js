import ImageApiServise from './fetch';
import Notiflix from 'notiflix';
import galleryTamplate from '../tamplates/gallery.hbs';

const refs = {
  formEl: document.querySelector('#search-form'),
  gelleryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const imageApiServise = new ImageApiServise();


refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();
  imageApiServise.query = e.currentTarget.elements.searchQuery.value;
  imageApiServise.resetPage();

  imageApiServise.getPictures().then(resp => {
    if (resp.ok) {
      throw new Error(resp.status);
    } else if (resp.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      galleryRemove();
      galleryMarkUP(resp);
      refs.loadMore.classList.remove('hidden');
      imageApiServise.incrementPage();
    }
  });
}

function onLoadMore(e) {
  imageApiServise.getPictures().then(resp => {
    if (resp.ok) {
      throw new Error(resp.status);
    } else {
      galleryMarkUP(resp)
    }
  });
}

function galleryMarkUP(images) {
  refs.gelleryEl.insertAdjacentHTML('beforeend', galleryTamplate(images));
}

function galleryRemove() {
  refs.gelleryEl.innerHTML = '';
}
