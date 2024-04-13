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
    const { type, date, maintenance, cost } = event.body;

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const garage = database.collection("user_vehicle_info");
            await garage.updateOne(
                {
                    email: email,
                    config_id: parseInt(config_id)
                },
                {$pull: { completed_maintenance: {
                                type: type,
                                date: date,
                                maintenance: maintenance,
                                cost: cost
                        }
                    }
                }
            );
            return {
                statusCode: 200,
                body: JSON.stringify({message: `History deleted: ${type} ${date} ${maintenance} ${cost} deleted from config ${config_id}`})
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};