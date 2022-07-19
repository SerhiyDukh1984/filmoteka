import Pagination from 'tui-pagination';
import { TheMovieDBApi } from './fetchfilm';
import filmcard from '../templates/filmcard.hbs';
import axios from 'axios';
import placeholder from '../images/placeholder.png';
// import { pagination } from './pagination';

export const api = new TheMovieDBApi();
const mainListEl = document.querySelector('.js-home-page');

const container = document.getElementById('tui-pagination-container');
export const pagination = new Pagination(container, {
  itemsPerPage: 20,
  visiblePages: 5,
  centerAlign: false,
  firstItemClassName: 1,
  template: {
    currentPage: '<a class="page-btn is-selected">{{page}}</a>',
    page: '<a class="page-btn">{{page}}</a>',
    moveButton: `<button class="move-btn move-btn-{{type}}"></button>`,
    disabledMoveButton:
      '<button class="move-btn move-btn-{{type}} disabled" disabled></button>',
    moreButton: '<a class="page-btn next-is-ellip last-child">...</a>',
  },
});

pagination.on('afterMove', event => {
  const currentPage = event.page;
  renderTrendingPerPage(currentPage);
});

export async function renderFilmCard() {
  const response = await api.fetchTrendingFilms();
  renderFilmsList(response.data.results);
  pagination.reset(response.data.total_results);
  
}

async function renderTrendingPerPage (page) {  
  api.page = page;  
  const response = await api.fetchTrendingFilms();
  renderFilmsList(response.data.results);
}

async function renderFilmsList (films) {   
  const genresIds = await api.getGenres();
  films.map(el => {
    if (!el.poster_path) {
      el.poster_path = placeholder;
    } else {
      el.poster_path = `https://image.tmdb.org/t/p/w500${el.poster_path}`;
    }
  });
  films.map(el => {
    const changedGenders = el.genre_ids.map(el => {
      el = genresIds[el];
      return el;
    });
    el.genre_ids = changedGenders;
  });
  const filmItemsMarkup = filmcard(films); 
  mainListEl.innerHTML = filmItemsMarkup;
}


renderFilmCard();
