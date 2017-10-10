(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// import { getSchema } from '../utils/schemaBuilder';

// const pg = require('pg');
// const Client = require('pg-native');

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

},{"../utils/schemaBuilder":2}],2:[function(require,module,exports){



exports.getSchema = (version = 'default') => {


  let inputCol1 = $('#input-col1').val() || 'column1name';


  return inputCol1;
}


},{}]},{},[1]);
