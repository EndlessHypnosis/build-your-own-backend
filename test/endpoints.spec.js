const chai = require('chai');
/* eslint-disable no-alert, no-unused-vars */
const should = chai.should();
/* eslint-enable no-alert, no-unused-vars */
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

// SETUP: knex
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);


// Before we test our endpoints, lets just make sure the page rendered correctly
describe('Client Routes', () => {
  // happy path test
  it('should return the homepage with the correct header', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('<h1 class=\'main-title\'>Build Your Own Backend Brewery</h1>');
        done();
      });
  });

  // sad path test
  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/foo')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});


// Endpoint tests
describe('API Routes', () => {

  let beerID = 0;
  let breweryID = 0;
  let key = null;

  before(done => {
    chai.request(server)
      .post('/api/v1/authenticate')
      .send({
        'email': 'jason@turing.io',
        'appName': 'test'
      })
      .end((error, response) => {
        key = response.body.token;
        database.migrate.latest()
          .then(() => {
            done();
          });
      });
  });

  // Re-seed data between tests
  // beforeEach(done => {
  //   database.migrate.rollback()
  //     .then(() => {
  //       database.migrate.latest()
  //         .then(() => {
  //           database.seed.run()
  //             .then(() => {
  //               done();
  //             });
  //         });
  //     });
  // });

  beforeEach(done => {
    database.seed.run()
      .then(() => {
        chai.request(server)
          .get('/api/v1/beers')
          .end((error, response) => {
            beerID = response.body[0].id;
            chai.request(server)
              .get('/api/v1/breweries')
              .end((error, response) => {
                breweryID = response.body[0].id;
                done();
              });
          });
      });
  });

  describe('GET /api/v1/beers', () => {

    it('should return all of the beers', done => {
      chai.request(server)
        .get('/api/v1/beers')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(50);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('abv');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('style');
          response.body[0].should.have.property('is_organic');
          response.body[0].should.have.property('brewery_id');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        });
    });

    it('should return error when trying to fetch beer with invalid abv', done => {
      chai.request(server)
        .get('/api/v1/beers?abv=foo')
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Invalid abv param. Please enter valid number.');
          done();
        });
    });

    it('should return a 404 when trying to find beers with high abv', done => {
      chai.request(server)
        .get('/api/v1/beers?abv=100')
        .end((error, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find any beers');
          done();
        });
    });

    it('should return all beers with abv above 11.5', done => {
      chai.request(server)
        .get('/api/v1/beers?abv=10.2')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(6);
          done();
        });
    });

  });


  describe('GET /api/v1/beers/:id', () => {

    it('should return a specific beer by its unique id', done => {
      chai.request(server)
        .get(`/api/v1/beers/${beerID}`)
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(beerID);
          response.body[0].should.have.property('abv');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('style');
          response.body[0].should.have.property('is_organic');
          response.body[0].should.have.property('brewery_id');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        });
    });

    it('should return error when an invalid id is entered', done => {
      chai.request(server)
        .get('/api/v1/beers/100000')
        .end((error, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          done();
        });
    });

  });


  describe('GET /api/v1/breweries/:id/beers', () => {

    it('should return all beers associated with a brewery', done => {      
      chai.request(server)
        .get(`/api/v1/breweries/${breweryID}/beers`)
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('abv');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('style');
          response.body[0].should.have.property('is_organic');
          response.body[0].should.have.property('brewery_id');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        });
    });

    it('should return error when an invalid brewery id is enetered', done => {
      chai.request(server)
        .get('/api/v1/breweries/10000/beers')
        .end((error, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find any beers for brewery with id 10000');
          done();
        });
    });

  });



  describe('POST /api/v1/beers', () => {

    it('should create a new beer successfully', done => {
      // check record count before posting
      chai.request(server)
        .get('/api/v1/beers')
        .end((error, response) => {
          response.body.should.have.length(50);

          // post new record
          chai.request(server)
            .post(`/api/v1/beers?token=${key}`)
            .send({
              'name': 'test beer 1',
              'abv': '10.3',
              'is_organic': 'Y',
              'style': 'Belgin',
              'brewery_id': breweryID
            })
            .end((error, response) => {
              response.should.have.status(201);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.should.have.property('name');
              response.body.should.have.property('abv');
              response.body.should.have.property('is_organic');
              response.body.name.should.equal('test beer 1');
              response.body.abv.should.equal('10.30');
              response.body.brewery_id.should.equal(breweryID);

              // check record count again
              chai.request(server)
                .get('/api/v1/beers')
                .end((error, response) => {
                  response.body.should.have.length(51);
                  done();
                });
            });
        });
    });

    it('should error if the post is missing a parameter', done => {
      chai.request(server)
        .post(`/api/v1/beers?token=${key}`)
        .send({
          'name': 'test1',
          'is_organic': 'Y'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should return a 403 error with incorrect token', done => {
      chai.request(server)
        .post('/api/v1/beers?token=203')
        .end((error, response) => {
          response.should.have.status(403);
          done();
        });
    });

  });


  describe('POST /api/v1/breweries', () => {

    it('should create a new brewery successfully', done => {
      // check record count before posting
      chai.request(server)
        .get('/api/v1/breweries')
        .end((error, response) => {
          response.body.should.have.length(50);

          // post new record
          chai.request(server)
            .post(`/api/v1/breweries?token=${key}`)
            .send({
              'name': 'my first brewery',
              'established': '2001',
              'website': 'http://beerme.com'
            })
            .end((error, response) => {
              response.should.have.status(201);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.should.have.property('name');
              response.body.should.have.property('established');
              response.body.should.have.property('website');
              response.body.name.should.equal('my first brewery');
              response.body.established.should.equal('2001');

              // check record count again
              chai.request(server)
                .get('/api/v1/breweries')
                .end((error, response) => {
                  response.body.should.have.length(51);
                  done();
                });
            });
        });
    });

    it('should error if the post is missing a parameter', done => {
      chai.request(server)
        .post(`/api/v1/breweries?token=${key}`)
        .send({
          'name': 'test1',
          'website': 'http://beerme.com'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should return a 403 error with incorrect token', done => {
      chai.request(server)
        .post('/api/v1/breweries?token=203')
        .end((error, response) => {
          response.should.have.status(403);
          done();
        });
    });

  });



  describe('DELETE /api/v1/beers/:id', () => {

    it('should delete a beer by its id', done => {
      chai.request(server)
        .delete(`/api/v1/beers/${beerID}?token=${key}`)
        .end((error, response) => {
          response.should.have.status(204);

          chai.request(server)
            .get('/api/v1/beers')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(49);
              done();
            });
        });
    });

    it('should return an error with incorrect id', done => {
      chai.request(server)
        .delete(`/api/v1/beers/foo?token=${key}`)
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal('Invalid ID. Cannot delete beer.');
          done();
        });
    });

    it('should return a 403 error with incorrect token', done => {
      chai.request(server)
        .delete(`/api/v1/beers/${beerID}?token=203`)
        .end((error, response) => {
          response.should.have.status(403);
          done();
        });
    });

  });

  describe('DELETE /api/v1/breweries/:id', () => {

    it.skip('should delete a brewery by its id', done => {
      chai.request(server)
        .delete(`/api/v1/breweries/${breweryID}?token=${key}`)
        .end((error, response) => {
          response.should.have.status(204);

          chai.request(server)
            .get('/api/v1/breweries')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(49);
              done();
            });
        });
    });

    it('should return an error with incorrect id', done => {
      chai.request(server)
        .delete(`/api/v1/breweries/foo?token=${key}`)
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal('Invalid ID. Cannot delete brewery.');
          done();
        });
    });

    it('should return a 403 error with incorrect token', done => {
      chai.request(server)
        .delete(`/api/v1/breweries/${breweryID}?token=203`)
        .end((error, response) => {
          response.should.have.status(403);
          done();
        });
    });

  });


  describe('PUT /api/v1/breweries/:id', () => {

    it('should replace all brewery data by brewery id', done => {
      chai.request(server)
        .put(`/api/v1/breweries/${breweryID}?token=${key}`)
        .send({
          'name': 'test1',
          'established': '2010',
          'website': 'test web'
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('name');
          response.body.should.have.property('established');
          response.body.should.have.property('website');
          response.body.name.should.equal('test1');
          response.body.established.should.equal('2010');
          response.body.website.should.equal('test web');
          done();
        });
    });

    it('should error if the put is missing a parameter', done => {
      chai.request(server)
        .put(`/api/v1/breweries/${breweryID}?token=${key}`)
        .send({
          'name': 'test1',
          'established': '2010'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should return an error with incorrect id', done => {
      chai.request(server)
        .put(`/api/v1/breweries/foo?token=${key}`)
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal('Invalid ID. Incorrect ID format.');
          done();
        });
    });

    it('should return a 403 error with incorrect token', done => {
      chai.request(server)
        .put(`/api/v1/breweries/${breweryID}?token=203`)
        .end((error, response) => {
          response.should.have.status(403);
          done();
        });
    });

  });


  describe('GET /api/v1/breweries', () => {

    it('should return all of the breweries', done => {
      chai.request(server)
        .get('/api/v1/breweries')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(50);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('established');
          response.body[0].should.have.property('website');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        });
    });

  });


  describe('GET /api/v1/breweries/:id', () => {

    it('should return a specific brewery for valid id', done => {
      chai.request(server)
        .get(`/api/v1/breweries/${breweryID}`)
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(breweryID);
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('established');
          response.body[0].should.have.property('website');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');

          done();
        });
    });

    it('should return a 404 for an invalid id', done => {
      chai.request(server)
        .get('/api/v1/breweries/1')
        .end((error, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find any Breweries with ID 1');

          done();
        });
    });

    it('should return a 422 error for an invalid id format', done => {
      chai.request(server)
        .get('/api/v1/breweries/abc')
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Invalid input data type: id');

          done();
        });
    });

  });


  describe('PATCH /api/v1/beers/:id', () => {

    it('should replace some of a specific beers information', done => {
      chai.request(server)
        .patch(`/api/v1/beers/${beerID}?token=${key}`)
        .send({
            'name': 'beer test1',
            })
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('name');
          response.body.name.should.equal('beer test1');
          response.body.should.have.property('abv');
          response.body.should.have.property('is_organic');
          response.body.should.have.property('style');
          response.body.should.have.property('brewery_id');
          done();
        });
    });

    it('should return an error with incorrect id', done => {
      chai.request(server)
        .patch(`/api/v1/beers/foo?token=${key}`)
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal('Invalid ID. Cannot update beer.');
          done();
        });
    });

    it('should return a 403 error with incorrect token', done => {
      chai.request(server)
        .patch(`/api/v1/beers/40?token=203`)
        .end((error, response) => {
          response.should.have.status(403);
          done();
        });
    });

  });



});
