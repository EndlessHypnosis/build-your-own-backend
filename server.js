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


// get all beers
app.get('/api/v1/beers', (request, response) => {
  database('beers')
    .select()
    .then(beers => {
      response.status(200).json(beers)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

// get a beer by beer id
app.get('/api/v1/beers/:id', (request, response) => {
  database('beers').where('id', request.params.id).select()
    .then(beers => {
      if (beers.length) {
        response.status(200).json(beers);
      } else {
        response.status(404).json({
          error: `Could not find beer with that id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// save new beer to a brewery by brewery id
app.post('/api/v1/beers', (request, response) => {
  const beer = request.body;
  for (let requiredParameter of ['name', 'abv', 'is_organic', 'style', 'brewery_id']) {
    if (!beer[requiredParameter]) {
      return response
        .status(422)
        .send({
          error: `Expected format: { name: <String>, abv: <decimal>, is_organic: <String>, style: <String>, brewery_id: <integer> }.
          You're missing a "${requiredParameter}" property.`
        });
    }
  }
  database('beers')
    .insert(beer, '*')
    .then(beer => {
      response.status(201).json(beer[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    })
});

// delete individual beer by beer id
app.delete('/api/v1/beers/:id', (request, response) => {
  if (!Number.isInteger(parseInt(request.params.id))) {
    return response
      .status(422)
      .send({ error: `Inavlid id.  Cannot delete beer` });
  }
  const beerIdToDelete = request.params.id;
  database('beers')
    .where('id', beerIdToDelete)
    .del()
    .then(beer => {
      response.sendStatus(200)
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});





// get all beers associated with brewery id
app.get('/api/v1/breweries/:id/beers', (request, response) => {
  database('beers').where('brewery_id', request.params.id).select()
    .then(beers => {
      if (beers.length) {
        response.status(200).json(beers);
      } else {
        response.status(404).json({
          error: `Could not find beers for that Brewery ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});







// GET all breweries
app.get('/api/v1/breweries', (request, response) => {
  database('breweries').select()
    .then(breweries => {
      if (breweries.length) {
        response.status(200).json(breweries);
      } else {
        response.status(404).json({
          error: `Could not find any Breweries`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// GET brewery based on specific ID
app.get('/api/v1/breweries/:id', (request, response) => {
  database('breweries').where('id', request.params.id).select()
    .then(breweries => {
      if (breweries.length) {
        response.status(200).json(breweries);
      } else {
        response.status(404).json({
          error: `Could not find any Breweries with ID ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


// POST a new brewery
app.post('/api/v1/breweries', (request, response) => {
  const brewery = request.body;

  for (let requiredParameter of ['name', 'established', 'website']) {
    if (!brewery[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, established: <String>, website: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('breweries').insert(brewery, '*')
    .then(brewery => {
      response.status(201).json(brewery[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// DELETE brewery based on ID
app.delete('/api/v1/breweries/:id', (request, response) => {
  if (!Number.isInteger(parseInt(request.params.id))) {
    return response
      .status(422)
      .send({ error: `Invalid ID. Cannot delete brewery.` });
  }

  const breweryIdToDelete = request.params.id;

  database('breweries')
    .where('id', breweryIdToDelete)
    .del()
    .then(brewery => {
      response.sendStatus(200);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
