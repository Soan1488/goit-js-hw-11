import ImageApiServise from './fetch';
import Notiflix from 'notiflix';
import galleryTamplate from '../tamplates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('#search-form'),
  gelleryEl: document.querySelector('.gallery'),
};

const imageApiServise = new ImageApiServise();

refs.formEl.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', infiniteScroll);

async function onFormSubmit(e) {
  try {
    e.preventDefault();
    imageApiServise.query = e.currentTarget.elements.searchQuery.value;
    imageApiServise.resetPage();
    galleryRemove();

    const images = await imageApiServise.getPictures();
    if (images.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      galleryMarkUP(images.hits);
    }
  } catch (error) {
    Notiflix.Notify.warning(`Ooops ${error.message}`);
  }
}

async function onLoadMore(e) {
  try {
    const images = await imageApiServise.getPictures();
    if ((imageApiServise.page - 1) * 40 > images.totalHits) {
      window.removeEventListener('scroll', infiniteScroll);
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      galleryMarkUP(images.hits);
    } else {
      galleryMarkUP(images.hits);
      lazyScroll();
    }
  } catch (error) {
    Notiflix.Notify.warning(`Ooops ${error.message}`);
  }
}

function galleryMarkUP(images) {
  refs.gelleryEl.insertAdjacentHTML('beforeend', galleryTamplate(images));
  galleryLightBox();
}

function galleryRemove() {
  refs.gelleryEl.innerHTML = '';
}

function galleryLightBox() {
  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  gallery.on('show.simplelightbox', () => {});
  gallery.refresh();
}

function lazyScroll() {
  const { height: cardHeight } =
    refs.gelleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function infiniteScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    onLoadMore();
  }
}
