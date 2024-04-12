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
    const config_id = event['config_id'];
    const email = event['email'];
    const maintenance = {
        type: event.body.type,
        date: event.body.date,
        maintenance: event.body.maintenance,
        cost: parseInt(event.body.cost)
    }

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const garage = database.collection("user_vehicle_info");

            const add = await garage.updateOne(
                { email: email, config_id: parseInt(config_id) },
                { $push: { completed_maintenance: maintenance } }
            );
            return {
                statusCode: 200,
                body: JSON.stringify({message: `Maintenance history added to vehicle with config ${config_id}`})
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};