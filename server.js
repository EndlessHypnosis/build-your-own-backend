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


const jwt = require('jsonwebtoken');
// JWT SECRET KEY
let secretKey = process.env.JWT_SECRET || 'jasonandnicksawesomebyobproject'
app.set('secretKey', secretKey);

// uncomment this when you need to re-seed the database.
// const keys = require('./public/scripts/key');

const keys = {
  apiKey: 'INVALID KEY'
}

const fs = require('fs');

const isInt = (value) => {
 return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

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
















const checkAuth = (request, response, next) => {

  let tokenDoesExist = false;
  let token;

  // check for token in headers.Authorization
  if (request.headers.authorization) {
    tokenDoesExist = true;
    token = request.headers.authorization;
  }

  // check for token in body
  if (request.body.token) {
    tokenDoesExist = true;
    token = request.body.token;
  }

  // check for token in query params
  if (request.query.token) {
    tokenDoesExist = true;
    token = request.query.token;
  }



  // if no token exists, respond with 403...not authorized
  if (!tokenDoesExist) {
    return response.status(403).send('You must be authorized to use this endpoint.')
  }

  // if token does exist, verify token
  if (tokenDoesExist) {
    jwt.verify(token, app.get('secretKey'), (err, decoded) => {
      if (err) {
        return response.status(403).json({ error: 'Invalid Token' });
      }

      if (!decoded.admin) {
        return response.status(403).json({ error: 'Authorization Error. You must have admin rights to access this resource.' });
      }

      // then call next (this is middleware, so passes on execution)
      next();

    })
  }
}





// POST for authenticate

app.post('/api/v1/authenticate', (request, response) => {

  const { appName, email } = request.body;

  // check if appName exists in payload
  if (!appName || !email) {
    return response.status(400).json({error: 'Invalid Request. Please enter valid appName and email'})
  }

  // check if Email ends with @turing.io
  let doesItEndWithTuring = email.endsWith("@turing.io");
  let adminVerification = false;

  if (doesItEndWithTuring) {
    let subEmail = email.replace("@turing.io", "");
    if (subEmail.length > 0) {
      adminVerification = true;
    }
  }

  // add {admin: true} to request body before passing payload into token signing.
  let newTokenPayload = Object.assign({}, request.body, { admin: adminVerification })


  let token = jwt.sign(newTokenPayload, app.get('secretKey'), { expiresIn: '48h' })
  response.status(201).json({token, adminVerification});
});




// GET /beers endpoint with optional query param: abv
app.get('/api/v1/beers', (request, response) => {
  let userAbv = request.query.abv;
  let myDataBase
  if(userAbv) {
    myDataBase = database('beers').where('abv', '>=', request.query.abv)
  } else {
    myDataBase = database('beers')
  }
  myDataBase.select()
    .then(beers => {
      if (!beers.length) {
        return response.sendStatus(404).json({
          error: `Could not find any beers`
        });
      }
      response.status(200).json(beers)
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


// GET /beers/:id endpoint to request a specific beer by id
app.get('/api/v1/beers/:id', (request, response) => {
  database('beers').where('id', request.params.id).select()
    .then(beers => {
      if (!beers.length) {
        return response.status(404).json({
          error: `Could not find beer with id ${request.params.id}`
        });
      }
      response.status(200).json(beers);
    })  
    .catch(error => {
      response.status(500).json({ error });
    });  
});    


// GET /breweries/:id/beers endpoint to request all beers associated with a brewery
app.get('/api/v1/breweries/:id/beers', (request, response) => {
  database('beers').where('brewery_id', request.params.id).select()
    .then(beers => {
      if (!beers.length) {
        return response.status(404).json({
          error: `Could not find any beers for brewery with id ${request.params.id}`
        });
      }
      response.status(200).json(beers);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// POST /beers endpoint saves a new beer to a brewery
app.post('/api/v1/beers', checkAuth, (request, response) => {
  const beer = request.body;
  delete beer.token;
  for (let requiredParameter of ['name', 'abv', 'is_organic', 'style', 'brewery_id']) {
    if (!beer[requiredParameter]) {
      return response.status(422)
        .json({
          error: `Expected format: { name: <String>, abv: <decimal>, is_organic: <String>, style: <String>, brewery_id: <integer> }.
          You're missing a "${requiredParameter}" property.`
        });  
    }
  }
  database('beers')
    .insert(beer, '*')
    .then(beers => {
      if (!beers[0]) {
        return response.status(422).json({
          error: `Could not create beer. Unexpected error`
        });
      }
      response.status(201).json(beers[0]);
    })  
    .catch(error => {
      response.status(500).json({ error });
    })  
});    


// PATCH /beers/:id endpoint to update partial information of a specific beer
app.patch('/api/v1/beers/:id', checkAuth, (request, response) => {
  if (!isInt(request.params.id)) {
    return response.status(422).json({ error: `Invalid ID. Cannot update beer.` });
  }
  const newBeerData = request.body;
  delete newBeerData.token;
  database('beers').where('id', request.params.id)
    .update(newBeerData, '*')
    .then(beers => {
      if (!beers[0]) {
        return response.status(422).json({
          error: 'Could not update beer. Unexpected error'
        })
      }
      response.status(200).json(beers[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// DELETE /beers/:id endpoint to remove an individual beer by id
app.delete('/api/v1/beers/:id', checkAuth, (request, response) => {
  if (!isInt(request.params.id)) {
    return response.status(422).json({ error: `Invalid ID. Cannot delete beer.` });
  }    
  const beerIdToDelete = request.params.id;
  database('beers')
    .where('id', beerIdToDelete)
    .delete()
    .then(beer => {
      response.sendStatus(204);
    })  
    .catch(error => {
      response.status(500).json({ error });
    });  
});    

// GET /breweries endpoint retrieves all the breweries
app.get('/api/v1/breweries', (request, response) => {
  database('breweries').select()
    .then(breweries => {
      if (!breweries.length) {
        return response.status(404).json({
          error: `Could not find any Breweries`
        });
      } 
      response.status(200).json(breweries);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// GET /breweries/:id endpoint retrieves specific brewery based on id
app.get('/api/v1/breweries/:id', (request, response) => {
  database('breweries').where('id', request.params.id).select()
    .then(breweries => {
      if (!breweries.length) {
        return response.status(404).json({
          error: `Could not find any Breweries with ID ${request.params.id}`
        });
      }
      response.status(200).json(breweries);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// POST /breweries endpoint creates a new brewery
app.post('/api/v1/breweries', checkAuth, (request, response) => {
  const brewery = request.body;
  delete brewery.token;
  for (let requiredParameter of ['name', 'established', 'website']) {
    if (!brewery[requiredParameter]) {
      return response.status(422)
        .json({ error: `Expected format: { name: <String>, established: <String>, website: <String> }. You're missing a
        "${requiredParameter}" property.` });
    }
  }
  database('breweries')
  .insert(brewery, '*')
  .then(breweries => {
    if (!breweries[0]) {
      return response.status(422).json({
        error: 'Could not create brewery. Unexpected error'
      });
    }
    response.status(201).json(breweries[0]);
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

// PUT /breweries/:id updates the entire record for a given brewery by id
app.put('/api/v1/breweries/:id', checkAuth, (request, response) =>  {
  const newBreweryData = request.body;
  delete newBreweryData.token;
  if(!isInt(request.params.id)) {
    return response.status(422).json({ error: `Invalid ID. Incorrect ID format.` });
  }
  for (let requiredParameter of ['name', 'established', 'website']) {
    if (!newBreweryData[requiredParameter]) {
      return response.status(422)
        .send({ error: `Expected format: { name: <String>, established: <String>, website: <String> }.
          You're missing a "${requiredParameter}" property.` });
    }
  }
  database('breweries').where('id', request.params.id)
  .update(newBreweryData, '*')
  .then(brewery => {
    if(!brewery.length) {
      return response.status(422).json({
        error: 'Unable to update brewery. Unexpected Error.'
      })
    }
    response.status(200).json(brewery[0]);
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

// DELETE /breweries endpoint deletes a brewery based on id
app.delete('/api/v1/breweries/:id', checkAuth, (request, response) => {
  if (!isInt(request.params.id)) {
    return response.status(422).json({ error: `Invalid ID. Cannot delete brewery.` });
  }
  const breweryIdToDelete = request.params.id;
  database('breweries')
    .where('id', breweryIdToDelete)
    .delete()
    .then(brewery => {
      response.sendStatus(204);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
