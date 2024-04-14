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
    const config_id = event['config_id'];
    const email = event['email'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const info = database.collection("user_vehicle_info");
            const history = await info.aggregate([
                {
                    $match: {
                        config_id: parseInt(config_id),
                        email: email
                    }
                },
                {
                    $project: {
                        _id: 0,
                        completed_maintenance: 1
                    }
                }
            ]).toArray();
            return history.map(info => info.completed_maintenance)
        }).then(history => {
            return {
                statusCode: 200,
                body: JSON.stringify(history)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};