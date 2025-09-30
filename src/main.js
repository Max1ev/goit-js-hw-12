import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  getFirstCardHeight,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './css/styles.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-text');
const loadMoreBtn = document.querySelector('[data-load-more]');
const statusTop = document.querySelector('#status-message');
const statusBottom = document.querySelector('#bottom-status');

let currentQuery = '';
let page = 1;
let totalHits = 0;


iziToast.settings({
  position: 'topRight',
  timeout: 1200,
  maxWidth: 280,
  progressBar: false,
  closeOnClick: true,
  drag: false,
  transitionIn: 'fadeInDown',
  transitionOut: 'fadeOutUp',
});


function showTopStatus(text) {
  statusTop.textContent = text;
  statusTop.classList.add('loading');
}
function clearTopStatus() {
  statusTop.textContent = '';
  statusTop.classList.remove('loading');
}

function showBottomStatus(text) {
  statusBottom.textContent = text;
  statusBottom.classList.add('loading');
}
function clearBottomStatus() {
  statusBottom.textContent = '';
  statusBottom.classList.remove('loading');
}


form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);


async function onSearch(e) {
  e.preventDefault();
  const query = input.value.trim();

  hideLoadMoreButton();
  clearGallery();
  clearBottomStatus();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search term.' });
    return;
  }

  currentQuery = query;
  page = 1;

  showTopStatus('Loading results…');
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, page);
    totalHits = data.totalHits ?? 0;

    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query.',
      });
      return;
    }

    createGallery(data.hits);

    const loaded = Math.min(page * PER_PAGE, totalHits);
    showTopStatus(`Loaded ${loaded} of ${totalHits}`);

    if (loaded < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch {
    iziToast.error({ message: 'Oops! Something went wrong. Try later.' });
  } finally {
    hideLoader();
    setTimeout(clearTopStatus, 1200);
  }
}


async function onLoadMore() {
  page += 1;

  showBottomStatus(`Loading page ${page}…`);
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, page);

    if (!data.hits || data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
      return;
    }

    const cardH = getFirstCardHeight();
    createGallery(data.hits);


    if (cardH > 0) {
      window.scrollBy({ top: cardH * 3, behavior: 'smooth' });
    }

    const loaded = Math.min(page * PER_PAGE, totalHits);
    showBottomStatus(`Loaded ${loaded} of ${totalHits}`);

    if (loaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch {
    iziToast.error({ message: 'Oops! Something went wrong. Try later.' });
  } finally {
    hideLoader();
    setTimeout(clearBottomStatus, 1200);
  }
}
