import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config';

export const handler = async (event, content) => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });
  const carYear = event['year'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const configurations = database.collection("configurations");
            const makes = await configurations.aggregate([
                {$match: {year: parseInt(carYear)}},
                {$group: {_id: "$make", makes: {$addToSet: "$make"}}},
                {$sort: {_id: 1}}
            ]).toArray();
            return makes.map(make => make._id);
        }).then(makes => {
            return {
                statusCode: 200,
                body: JSON.stringify(makes)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};