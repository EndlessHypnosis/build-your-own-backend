
const breweries = require('../../../breweries.json')


exports.seed = (knex, Promise) => {
  console.log(breweries)
  return knex('beers').del() // delete footnotes first
    .then(() => knex('breweries').del()) // delete all papers
    .then(() => {
      let breweriesPromises = [];

      breweries.forEach(brewery => {
        breweriesPromises.push(createBrewery(knex, brewery));
      });

      return Promise.all(breweriesPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

const createBrewery = (knex, brewery) => {
  return knex('breweries')
    .insert(
      {
        name: brewery.name,
        established: brewery.established,
        website: brewery.website
      },
      'id'
    )
    .then(breweryId => {
      let beersPromises = [];
      if(brewery.beers) {
        brewery.beers.forEach(beer => {
        let newBeer = Object.assign({}, beer, {brewery_id: breweryId[0]})
        beersPromises.push(createBeer(knex, newBeer));
      });
    }
      return Promise.all(beersPromises);
    });
};

const createBeer = (knex, beer) => {
  delete beer.breweryDB_id
  return knex('beers').insert(beer);
};
