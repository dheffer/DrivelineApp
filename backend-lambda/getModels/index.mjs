import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';

export const handler = async (event, context) => {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );
    const year = event['year'];
    const make = event['make'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const configurations = database.collection("configurations");

            const models = await configurations.aggregate([
                {$match: {year: parseInt(year), make: make}},
                {$group: {_id: "$model", models: {$addToSet: "$model"}}},
                {$sort: {_id: 1}}
            ]).toArray();
            return models.map(model => model._id);
        }).then(models => {
            return {
                statusCode: 200,
                body: JSON.stringify(models)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};