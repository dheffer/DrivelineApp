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

    return client.connect()
        .then(() => {
            const database = client.db("vehicleDB");
            const configurations = database.collection("configurations");

            return configurations.aggregate([
                { $group: { _id: "$year", years: { $addToSet: "$year" } }}
            ]).toArray();
        }).then(years => {
            return {
                statusCode: 200,
                body: JSON.stringify(years)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" })
            };
        }).finally(() => client.close());
};