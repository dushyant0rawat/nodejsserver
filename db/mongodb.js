const {MongoClient,ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017/';

const client = new MongoClient(url);
const dbname = 'myMongoDb';
const db = client.db(dbname);
const collection = db.collection('documents');

const maindbInsert = async function(data) {
  const insertResult = await collection.insertOne({fountain: data.fountain});
  console.log('inserted documents =>',insertResult);
}

const maindbGet = async function() {
  const cursor = await collection.find({},{ projection: { _id: 1, fountain: 1 }}).sort({_id:-1});
  return cursor;
}

const maindbUpdate = async function(data) {
  const key = new ObjectId(data._id);
  const query = {_id: key};
  var newValues = { $set: {fountain: data.fountain } };
  const updateResult = await collection.updateOne(query,newValues);
  console.log('update documents =>',updateResult);
}

const maindbDelete = async function(data) {
  console.log("key is:",data._id);
  const key = new ObjectId(data._id);
  const query = {_id: key};
  const deleteResult = await collection.deleteOne(query);
  console.log('deleted documents =>',deleteResult);
}


exports.maindbInsert = maindbInsert;
exports.maindbGet = maindbGet;
exports.maindbUpdate = maindbUpdate;
exports.maindbDelete = maindbDelete;
exports.client = client;
