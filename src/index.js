import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');

const formRef = document.querySelector('.search-form');
const gallleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('input');

formRef.addEventListener('submit', onFormSearch);
gallleryRef.addEventListener('click', e => e.preventDefault());
loadMoreBtn.addEventListener('click', onLoadMoreClick);

const URL = 'https://pixabay.com/api/';
const API_KEY = '31298446-18dbc6951dc09e2b2b9c5e503';

let page = 1;
let searchValue;
let totalRenderHits = 0;

function onFormSearch(e) {
  e.preventDefault();
  let searchValue = e.target.searchQuery.value;
  clearMarkup();
  hideBtn();
  getFetch(searchValue).then(renderCards);
}

async function getFetch(searchValue, page) {
  try {
    const dataResponse = await axios.get(
      `${URL}?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );

    return dataResponse.data;
  } catch (error) {
    Notify.failure(error);
  }
}

function onLoadMoreClick() {
  page += 1;
  searchValue = input.value;

  getFetch(searchValue, page).then(renderCards);
}

function renderCards(data) {
  totalRenderHits += data.hits.length;

  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (page === 1) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    showBtn();
  }
  if (totalRenderHits >= data.totalHits) {
    hideBtn();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  markupImg(data.hits);
  lightbox.refresh();
}

function markupImg(array) {
  const markup = array
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <a class="card-set" href=${largeImageURL} >
  <div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
</a>

`;
      }
    )
    .join('');
  gallleryRef.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  gallleryRef.innerHTML = '';
  page = 1;
  totalRenderHits = 0;
}

function showBtn() {
  loadMoreBtn.style.display = 'block';
}
function hideBtn() {
  loadMoreBtn.style.display = 'none';
}
