import Notiflix from 'notiflix';
import card from '../templates/gallery-card.hbs';
import { imageRequest } from './api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputEl = document.querySelector('input');
const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-btn');
loadBtnEl.classList.add('is-hidden');

const emojiFail = String.fromCodePoint(0x1f621);
const emojiOk = String.fromCodePoint(0x1f601);

let page = 1;
let query = '';
let count = 0;
let lightbox = null;

formEl.addEventListener('submit', findImg);
loadBtnEl.addEventListener('click', loadMoreImg);

const mutationObserver = new MutationObserver(mutation => {
  mutation.forEach(el => {
    const mutationEl = [...el.addedNodes].filter(el => el.nodeName !== '#text');
    setTimeout(() => {
      mutationEl.forEach(el => {
        el.classList.add('appear');
      });
    }, 0);
  });
});
mutationObserver.observe(galleryEl, { childList: true });

function findImg(ev) {
  ev.preventDefault();
  page = 1;
  count = 0;
  galleryEl.innerHTML = '';
  count += 40;
  query = ev.currentTarget.elements['searchQuery'].value.trim();
  imageRequest(query, page)
    .then(({ data }) => {
      if (!data.hits.length) {
        inputEl.value = '';
        Notiflix.Notify.failure(
          `${emojiFail} Sorry, there are no images matching your search query. Please try again.`
        );
        loadBtnEl.classList.add('is-hidden');
        galleryEl.innerHTML = '';
        return;
      }
      Notiflix.Notify.success(
        `${emojiOk} Hooray!We found ${data.totalHits} images.`
      );
      render(data, page);
      // const galleryAllEl = galleryEl.querySelectorAll('.photo-card');
      // setTimeout(() => {
      //   galleryAllEl.forEach(el => {
      //     el.classList.add('appear');
      //   });
      // }, 0);

      lightbox = new SimpleLightbox('.gallery a', {
        overlay: true,
        captionsData: 'alt',
        captionDelay: 250,
        fadeSpeed: 500,
        scaleImageToRatio: true,
      });
      loadBtnEl.classList.remove('is-hidden');
    })
    .catch(err => {
      galleryEl.innerHTML = '';
      console.log(err);
    });
}

function loadMoreImg(ev) {
  page += 1;
  count += 40;
  imageRequest(query, page)
    .then(({ data }) => {
      if (count > data.totalHits) {
        inputEl.value = '';
        count = 0;
        Notiflix.Notify.failure(
          `${emojiFail} We're sorry, but you've reached the end of search results.`
        );
        loadBtnEl.classList.add('is-hidden');
        return;
      }
      render(data, page);
      lightbox.refresh();
    })
    .catch(err => {
      galleryEl.innerHTML = '';
      console.log(err);
    });
}

function render(data, page) {
  const resultForHbs = card(data.hits);
  if (page > 1) {
    galleryEl.insertAdjacentHTML('beforeend', resultForHbs);
  } else {
    galleryEl.innerHTML = resultForHbs;
  }
  // const galleryAllEl = galleryEl.querySelectorAll('.photo-card');
  // setTimeout(() => {
  //   galleryAllEl.forEach(el => {
  //     el.classList.add('appear');
  //   });
  // }, 0);
}
