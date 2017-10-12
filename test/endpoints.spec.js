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
          // response.body[0].should.have.property('id');
          // response.body[0].should.have.property('name');
          // response.body[0].should.have.property('created_at');
          // response.body[0].should.have.property('updated_at');

          // let projectOne = response.body.filter(project => {
          //   return project.name === 'project 1'
          // })
          // projectOne.length.should.equal(1);

          // let projectFoo = response.body.filter(project => {
          //   return project.name === 'foo'
          // })
          // projectFoo.length.should.equal(0);

          done();
        });
    });

  });


});