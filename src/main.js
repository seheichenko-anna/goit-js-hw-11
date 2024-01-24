import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
let lightbox;

form.addEventListener('submit', onSearchImages);

function onSearchImages(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  document.querySelector('.loader').classList.remove('hidden');
  const searchValue = form.elements.q.value;
  getImages(searchValue)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.show({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
          backgroundColor: '#EF4040',
          titleColor: '#FFFFFF',
          messageColor: '#FFFFFF',
        });
      }
      renderGallery(data.hits);
    })
    .catch(error => console.log(error))
    .finally(() => {
      document.querySelector('.loader').classList.add('hidden');
      form.reset();
    });
}

function getImages(searchValue) {
  const API_KEY = '42001706-084c655b89d9d100c07cefb17';
  const BASE_URL = 'https://pixabay.com/api/';
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });
  const url = `${BASE_URL}?${searchParams}`;

  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
}

function renderGallery(data) {
  const markup = data.map(item => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = item;
    return `<li class="gallery-item">
                <a class="gallery-link" href=${largeImageURL}>
                <img src=${webformatURL} alt="${tags}" /></a>
                    <ul class="image-desc">
                        <li class="image-desc-item"><p>Likes</p><p>${likes}</p></li>
                        <li class="image-desc-item"><p>Views</p><p>${views}</p></li>
                        <li class="image-desc-item"><p>Comments</p><p>${comments}</p></li>
                        <li class="image-desc-item"><p>Downloads</p><p>${downloads}</p></li>
                    </ul>
            </li>`;
  });

  addMarkup(markup);
  lightbox.refresh();
}

function addMarkup(markup) {
  gallery.innerHTML = markup.join('');
  lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
  });
}
