require('dotenv').config();

import { MongoClient } from 'mongodb';

const mongo = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Connect to database
 * @returns {Promise} MongoClient connected
 */
export const client = async () => await mongo.connect()

/**
 * Connect to collection
 * @param {MongoClient} mongo client manager
 * @param {string} dbName name of database
 * @param {string} colName name of collection
 * @returns {Object} collection client manager
 */
export const collection = (mongo, dbName, colName) => mongo.db(dbName).collection(colName);
