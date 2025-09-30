import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('#gallery');
const loadMoreBtn = document.querySelector('[data-load-more]');
const loader = document.querySelector('#loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      ({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => `
      <li class="card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${escapeHtml(tags)}" loading="lazy" />
        </a>
        <ul class="meta">
          <li><span>Likes</span><b>${likes}</b></li>
          <li><span>Views</span><b>${views}</b></li>
          <li><span>Comments</span><b>${comments}</b></li>
          <li><span>Downloads</span><b>${downloads}</b></li>
        </ul>
      </li>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.remove('is-hidden');
}
export function hideLoader() {
  loader.classList.add('is-hidden');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}
export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}

export function getFirstCardHeight() {
  const firstCard = gallery.querySelector('.card');
  return firstCard ? firstCard.getBoundingClientRect().height : 0;
}

function escapeHtml(str = '') {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
