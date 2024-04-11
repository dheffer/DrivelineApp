import {MongoClient, ServerApiVersion} from "mongodb";
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
    const model = event['model'];
    const engine = event['engine'];
    const transmission = event['transmission'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const config = database.collection("configurations");
            const vehicle_config = await config.findOne({
                year: parseInt(year),
                make: make,
                model: model,
                engine: engine,
                transmission: transmission
            });
            return vehicle_config.map(config => config.config_id);
        }).then(config => {
            return {
                statusCode: 200,
                body: JSON.stringify(config)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};