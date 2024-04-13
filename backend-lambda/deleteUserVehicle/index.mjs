import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config';

export const handler = async (event, context) => {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
    const config_id = event['config_id'];
    const email = event.headers['email'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            await garage.updateOne(
                { email: email },
                { $pull: { vehicle_config_ids: config_id } }
            );
            return {
                statusCode: 200,
                body: JSON.stringify({message: `Vehicle with config ${config_id} deleted from garage`})
            };
        }).then(async () => {
            const database = client.db("vehicleDB");
            const vehicInfo = database.collection("user_vehicle_info");
            await vehicInfo.deleteOne(
                { email: email, config_id: config_id }
            );
            return {
                statusCode: 200,
                body: JSON.stringify({message: `Vehicle with config ${config_id} deleted from garage`})
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};