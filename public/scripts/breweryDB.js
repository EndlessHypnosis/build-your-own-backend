var http = require('http');
const fs = require('fs');
const keys = {
  apiKey: process.env.BREW_API_KEY
};

//========================================================
//
//     This file is used to seed our dataset from the breweryDB api
//     This has been separated from the server.js, as it doesn't directly
//     pertain to the project requirements.
//
//========================================================

const cleanBreweryData = (dataToClean) => {
  let breweries = dataToClean.data;
  let cleanedBreweries = breweries.map(brewery => {
    let newBrewery = Object.assign({}, {
      breweryDB_id: brewery.id,
      name: brewery.name || 'Default Brewery',
      established: brewery.established || '1995',
      website: brewery.website || 'http://brewery.com'
    });
    return newBrewery;
  });
  fetchBeers(cleanBeerData, cleanedBreweries);
};

const cleanBeerData = (dataToClean, breweries) => {
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

  let BreweriesWithBeers = breweries.map((brewery, index) => {
    if (index < 25) {
      let newBrewery = Object.assign({}, {
        name: brewery.name,
        website: brewery.website,
        established: brewery.established,
        beers: []
      });
      newBrewery.beers.push(cleanedBeerData[index * 2]);
      newBrewery.beers.push(cleanedBeerData[(index * 2) + 1]);
      return newBrewery;
    } else {
      return brewery;
    }
  });

  let outputJson = JSON.stringify(BreweriesWithBeers, null, 2);
  fs.writeFile('./breweries.json', outputJson, 'utf8', (error) => {
    if (error) {
      /* eslint-disable no-alert, no-console */
      return console.error(error);
      /* eslint-enable no-alert, no-console */
    }
  });
};

const fetchBeers = (callback, breweryData) => {
  http.get(`http://api.brewerydb.com/v2/beers?key=${keys.apiKey}&withBreweries=Y`, (res) => {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      var beers = JSON.parse(body);
      callback(beers, breweryData);
    });
  }).on('error', function (e) {
    /* eslint-disable no-alert, no-console */
    console.log('Got an error: ', e);
    /* eslint-enable no-alert, no-console */
  });
};


const fetchBreweries = (callback) => {
  http.get(`http://api.brewerydb.com/v2/breweries?key=${keys.apiKey}`, (res) => {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      var breweries = JSON.parse(body);
      callback(breweries);
    });
  }).on('error', function (e) {
    /* eslint-disable no-alert, no-console */
    console.log('Got an error: ', e);
    /* eslint-enable no-alert, no-console */
  });
};

module.exports = { cleanBreweryData, fetchBreweries };