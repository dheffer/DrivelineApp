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

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            const userVehicle = database.collection("user_vehicle_info");

            const exist = await garage.findOne({email: email});
            if (exist) {
                await garage.updateOne(
                    { email: email },
                    { $addToSet: { vehicle_config_ids: config_id } }
                );
                await userVehicle.insertOne(
                    { email: email, config_id: config_id, odometer: 0, upcoming_maintenance: [], completed_maintenance: [] })
                return {
                    statusCode: 200,
                    body: JSON.stringify({message: `Vehicle with config ${config_id} updated in garage`})
                };
            }
            else {
                await garage.insertOne(
                    { email: email, vehicle_config_ids: [config_id] }
                )
                await userVehicle.insertOne(
                    { email: email, config_id: config_id, odometer: 0, upcoming_maintenance: [], completed_maintenance: [] })
                return {
                    statusCode: 200,
                    body: JSON.stringify({message: "Vehicle with config ${config_id} added to garage"})
                };
            }
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};