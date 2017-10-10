
// const knexDialect = require('knex/lib/dialects/postgres');


// SETUP: knex
// const environment = 'development';
// const configuration = require('../../knexfile')[environment];
// configuration.client = knexDialect;
// const database = require('knex')(configuration);



const pg = require('pg');


// let knex = require('knex');
const knexDialect = require('knex/lib/dialects/postgres');

const knexConfig = {
  client: 'pg',
  connection: 'postgres://localhost/byob',
  migrations: {
    directory: '../../db/migrations'
  },
  seeds: {
    directory: '../../db/seeds/test'
  },
  useNullAsDefault: true
}

knexConfig.client = knexDialect;

const database = require('knex')(knexConfig);

// bookshelf(knex);








let btnFillData = $('#btn-fill-data');
let btnMigrateLatest = $('#btn-migrate-latest');
let btnMigrateRollback = $('#btn-migrate-rollback');


const fillData = () => {
  // console.log('key:', apiKey);
}

const migrateLatest = () => {
  console.log('what is database:', database);
  
  database.migrate.latest()
  .then(() => {
    console.log('done migrating');
  })
}

const migrateRollback = () => {
  database.migrate.rollback();
}

// const fetchAllBreweries = () => {
//   return fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}`)
//     .then(results => results.json())
//     .then(movies => {
//       return cleanMovieData(movies.results)
//     })
// }


// const cleanMovieData = (movieArray) => {
//   return movieArray.map(movie => {
//     return {
//       movieId: movie.id,
//       title: movie.title,
//       releaseDate: movie.release_date,
//       description: movie.overview,
//       voteAverage: movie.vote_average,
//       posterImg: movie.poster_path,
//       isFavorited: false
//     }
//   })
// }





btnFillData.on('click', fillData);
btnMigrateLatest.on('click', migrateLatest);
btnMigrateRollback.on('click', migrateRollback);