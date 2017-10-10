const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var http = require('http');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const keys = require('./public/scripts/key');


const cleanBreweryData = (dataToClean) => {
  let breweries = dataToClean.data;
  // console.log('brew 1:', breweries[0])
  let cleanedBreweries = breweries.map(brewery => {
    let newBrewery = Object.assign({}, {
      breweryDB_id: brewery.id,
      name: brewery.name || 'Default Brewery',
      established: brewery.established || '1995',
      website: brewery.website || 'http://brewery.com'
    });
    return newBrewery;
  })
  // console.log('brew 1 CLEANED:', cleanedBreweries[0])
  return cleanedBreweries;
}


const cleanBeerData = (dataToClean) => {
  console.log('beer looks like:', dataToClean.data[0]);
  let beers = dataToClean.data;

  let cleanedBeerData = beers.map(beer => {
    let newBeer = Object.assign({}, {
      name: beer.name || 'Default Beer',
      abv: parseFloat(beer.abv).toFixed(2) || 5.5,
      is_organic: beer.isOrganic || 'N',
      style: beer.style.name || 'Default Beer Style',
      breweryDB_id: beer.breweries[0].id || 'snQlvg'
    });
    return newBeer;
  });
  return cleanedBeerData;
}


const fetchBeers = () => {
  http.get(`http://api.brewerydb.com/v2/beers?key=${keys.apiKey}&withBreweries=Y`, (res) => {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      var beers = JSON.parse(body);
      // console.log("Got beers: ", beers);

      let cleanedBeers = cleanBeerData(beers);

      response.status(200).json(cleanedBeers)
    });
  }).on('error', function (e) {
    console.log("Got an error: ", e);
    response.status(500).json({ e });
  });
}

const fetchBreweries = () => {
  http.get(`http://api.brewerydb.com/v2/breweries?key=${keys.apiKey}`, (res) => {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      
      var breweries = JSON.parse(body);
      let cleanedBreweries = cleanBreweryData(breweries);
      response.status(200).json(cleanedBreweries);

    });
  }).on('error', function (e) {
    console.log("Got an error: ", e);
    response.status(500).json({ e });
  });
}


app.get('/api/v1/seedbyob', (request, response) => {

  console.log('it worked');
  console.log('your API KEy:', keys.apiKey);

  // http.get(`http://api.brewerydb.com/v2/breweries?key=${keys.apiKey}`, data => {
  //   console.log('your data is:', data)
  // })

  let cleanedBreweries = fetchBreweries();
  let cleanedBeers = fetchBeers();

  // database('projects').select()
  //   .then(projects => {
  //     response.status(200).json(projects);
  //   })
  //   .catch(error => {
  //     response.status(500).json({ error });
  //   });
});



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;