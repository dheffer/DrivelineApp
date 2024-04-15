import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';

export const handler = async (event, context) => {
    console.log(event);
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const authorization  = event.headers['Authorization'];

    const config_id = event['queryStringParameters'].config_id;
    const odometer = event['queryStringParameters'].odometer;

    return client.connect()
        .then(async () => {
            const token = authorization.split(" ")[1];
            console.log("Token:", token);
            const database = client.db("vehicleDB");
            const collection = database.collection("maintenance");
            const docObject = await collection.findOne({config_id: config_id});
            let recommended = null;

            if (docObject && docObject.schedules) {
                for (const schedule of docObject.schedules) {
                    const mileage = parseInt(schedule.service_schedule_mileage.replace(',', ''));

                    if (mileage > odometer) {
                        recommended = schedule;
                        break;
                    }
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({message: "Maintenance schedule not found"})
                }
            }
            return {
                statusCode: 200,
                body: JSON.stringify(recommended)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" })
            };
        }).finally(() => client.close());
};