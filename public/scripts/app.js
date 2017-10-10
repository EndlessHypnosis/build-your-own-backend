
// SETUP: knex
const environment = 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);



let btnFillData = $('#btn-fill-data');
let btnMigrateLatest = $('#btn-migrate-latest');
let btnMigrateRollback = $('#btn-migrate-rollback');


const fillData = () => {
  // console.log('key:', apiKey);
}

const migrateLatest = () => {
  database.migrate.latest();
}

const migrateRollback = () => {
  database.migrate.rollback();
}

const fetchAllBreweries = () => {
  return fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}`)
    .then(results => results.json())
    .then(movies => {
      return cleanMovieData(movies.results)
    })
}


const cleanMovieData = (movieArray) => {
  return movieArray.map(movie => {
    return {
      movieId: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      description: movie.overview,
      voteAverage: movie.vote_average,
      posterImg: movie.poster_path,
      isFavorited: false
    }
  })
}





btnFillData.on('click', fillData);
btnMigrateLatest.on('click', migrateLatest);
btnMigrateRollback.on('click', migrateRollback);