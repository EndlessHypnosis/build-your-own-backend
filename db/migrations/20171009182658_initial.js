
// import { getSchema } from '../utils/schemaBuilder';


const schemaBuilder = require('../utils/schemaBuilder');

exports.up = function (knex, Promise) {
  console.log('GOING UP: ', schemaBuilder.getSchema());
  return Promise.all([
    knex.schema.createTable('breweries', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('established');
      table.string('location');
      table.string('website');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('beers', table => {
      table.increments('id').primary();
      table.string('name');
      table.decimal('abv');
      table.string('is_organic');
      table.string('style');
      table.integer('brewery_id').unsigned();
      table.foreign('brewery_id').references('breweries.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('beers'),
    knex.schema.dropTable('breweries')
  ]);
};
