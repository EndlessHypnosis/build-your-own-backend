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

  before(done => {
    database.migrate.latest()
      .then(() => {
        done();
      });
  });

  // Re-seed data between tests
  beforeEach(done => {
    database.seed.run()
      .then(() => {
        done();
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


});