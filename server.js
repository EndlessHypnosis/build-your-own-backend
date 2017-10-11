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

const fs = require('fs');

const cleanBreweryData = (dataToClean) => {
  console.log('clean brewery data called');
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
  // use the cleanedbreweries
  fetchBeers(cleanBeerData, cleanedBreweries);
}


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
  //return cleanedBeerData;
  console.log('### CLEANED BEERS:', cleanedBeerData.length);
  console.log('### CLEANED BREWERIES:', breweries.length);


  let BreweriesWithBeers = breweries.map((brewery, index) => {

    if (index < 25) {

      let newBrewery = Object.assign({}, {
        name: brewery.name,
        website: brewery.website,
        established: brewery.established,
        beers: []
      });

      newBrewery.beers.push(cleanedBeerData[index * 2])
      newBrewery.beers.push(cleanedBeerData[(index * 2) + 1])
  
      return newBrewery;

    } else {
      return brewery;
    }

  });



  let outputJson = JSON.stringify(BreweriesWithBeers, null, 2);

  fs.writeFile('./breweries.json', outputJson, 'utf8', (error) => {
    if (error) {
      return console.error(error);
    }
  });
  
////// BEERS
// {
//   name: '#2 Brett Golden Sour',
//     abv: '6.50',
//       is_organic: 'N',
//         style: 'Golden or Blonde Ale',
//           breweryDB_id: 'WgTa5f'
// },
// {
//   name: '#2 Strong Ale',
//     abv: '10.00',
//       is_organic: 'Y',
//         style: 'Strong Ale',
//           breweryDB_id: 'sNQLDD'
// }
// //////// BREWERY
// {
//   breweryDB_id: 'YXDiJk',
//   name: '#FREEDOM Craft Brewery',
//   established: '2012',
//   website: 'http://freedombrew.us'
// },
// {
//   breweryDB_id: 'Klgom2',
//   name: '\'t Hofbrouwerijke',
//   established: '1995',
//   website: 'http://www.thofbrouwerijke.be/'
// }


  
}


const fetchBeers = (callback, breweryData) => {
  // let cleanedBeers = [];
  http.get(`http://api.brewerydb.com/v2/beers?key=${keys.apiKey}&withBreweries=Y`, (res) => {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      var beers = JSON.parse(body);
      // cleanedBeers = cleanBeerData(beers);
      callback(beers, breweryData);
    });

  }).on('error', function (e) {
    console.log("Got an error: ", e);
  });
  // console.log('cleanedBeerscleanedBeers:', cleanedBeers);
  // return cleanedBeers;
}


const fetchBreweries = (callback) => {
  // let cleanedBreweries = [];

  http.get(`http://api.brewerydb.com/v2/breweries?key=${keys.apiKey}`, (res) => {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      var breweries = JSON.parse(body);
      callback(breweries);
      // cleanedBreweries = cleanBreweryData(breweries);
      // return cleanedBreweries;
    });

  }).on('error', function (e) {
    console.log("Got an error: ", e);
  });
}


app.get('/api/v1/seedbyob', (request, response) => {

  console.log('it worked');
  console.log('your API KEy:', keys.apiKey);

  // http.get(`http://api.brewerydb.com/v2/breweries?key=${keys.apiKey}`, data => {
  //   console.log('your data is:', data)
  // })

  fetchBreweries(cleanBreweryData);
  console.log('cleaned brewery data');
  
  // let cleanedBeers = fetchBeers();

  // response.status(200).json(cleanedBreweries);

  // database('projects').select()
  //   .then(projects => {
  //     response.status(200).json(projects);
  //   })
  //   .catch(error => {
  //     response.status(500).json({ error });
  //   });
});






app.get('/api/v1/breweries', (request, response) => {
  database('breweries').select()
    .then(breweries => {
      response.status(200).json(breweries);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


app.get('/api/v1/breweries/:id', (request, response) => {
  database('breweries').select().where('id', request.params.id)
    .then(breweries => {
      response.status(200).json(breweries);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;