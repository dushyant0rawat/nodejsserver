const {MongoClient,ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017/';

const client = new MongoClient(url);
const dbname = 'myMongoDb';
const db = client.db(dbname);

const dbCall = async function(req,res){
  const collection = db.collection(req.coll);
  const key = typeof req.post._id === 'undefined' ? "": new ObjectId(req.post._id);
  const src  = typeof req.post.src === 'undefined' ? "": req.post.src.split('/').splice(-1)[0];
  const query = {_id: key};
  let result = '';
  switch(req.post.type) {
    case "delete":
      result = await collection.deleteOne(query);
      break;
    case "update":
      const newValues = { $set: {comment: req.post.comment } };
      result = await collection.updateOne(query,newValues);
      break;
    case "insert":
      result = await collection.insertOne({comment: req.post.comment, src: src});
      break;
    case "get":
      result = await collection.find({src: src},{ projection: { _id: 1, comment: 1 }}).sort({_id:-1});
      break;
    default:
      // code block
  }

  return result;
}

exports.client = client;
exports.dbCall = dbCall;
