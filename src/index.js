import axios from 'axios';

const formRef = document.querySelector('.search-form');
const gallleryRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onFormSearch);

const URL = 'https://pixabay.com/api/';
const API_KEY = '31298446-18dbc6951dc09e2b2b9c5e503';

function onFormSearch(e) {
  e.preventDefault();
  let searchValue = e.target.searchQuery.value;

  getFetch(searchValue).then(markupImg);
}

async function getFetch(searchValue) {
  const data = await axios.get(
    `${URL}?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  //   const data = await axios.get(
  //     'https://pixabay.com/api/?key=31298446-18dbc6951dc09e2b2b9c5e503&q=yellow+flowers&image_type=photo'
  //   );
  return data.data.hits;
}

function markupImg(array) {
  const markup = array
    .map(img => {
      return `
  <div class="photo-card card-set">
  <img src=${img.webformatURL} alt=${img.tags} loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes ${img.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${img.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${img.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${img.downloads}</b>
    </p>
  </div>
</div>
`;
    })
    .join('');
  gallleryRef.innerHTML = markup;
}
