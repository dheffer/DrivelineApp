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
    const odometer = event['odometer'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const collection = database.collection("maintenance");
            const docObject = await collection.findOne({config_id: config_id});

            if(docObject && docObject.schedules){
                for (const schedule of docObject.schedules) {
                    const mileage = parseInt(schedule.service_schedule_mileage.replace(',', ''));

                    if (mileage > odometer) {
                        return schedule;
                    }
                }
            }
        }).then(maintenance => {
            return {
                statusCode: 200,
                body: JSON.stringify(maintenance)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};