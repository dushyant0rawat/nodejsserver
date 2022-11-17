const {MongoClient,ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017/';

const client = new MongoClient(url);
const dbname = 'myMongoDb';
const db = client.db(dbname);

const maindbInsert = async function(url,data) {
  const collection = db.collection(url);
  const insertResult = await collection.insertOne({comment: data.comment});
  console.log('inserted documents =>',insertResult);
}

const maindbGet = async function(url) {
  const collection = db.collection(url);
  const cursor = await collection.find({},{ projection: { _id: 1, comment: 1 }}).sort({_id:-1});
  return cursor;
}

const maindbUpdate = async function(url,data) {
  const collection = db.collection(url);
  const key = new ObjectId(data._id);
  const query = {_id: key};
  var newValues = { $set: {comment: data.comment } };
  const updateResult = await collection.updateOne(query,newValues);
  console.log('update documents =>',updateResult);
}

const maindbDelete = async function(url,data) {
  const collection = db.collection(url);
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
