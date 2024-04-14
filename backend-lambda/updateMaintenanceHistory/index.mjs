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
    const {
        old_type, old_date, old_maintenance, old_cost,
        new_type, new_date, new_maintenance, new_cost
    } = event.body;

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const garage = database.collection("user_vehicle_info");
            const update = await garage.updateOne(
                {
                    email: email,
                    config_id: parseInt(config_id),
                    "completed_maintenance.type": old_type,
                    "completed_maintenance.date": old_date,
                    "completed_maintenance.maintenance": old_maintenance,
                    "completed_maintenance.cost": parseInt(old_cost)
                },
                {
                    $set: {
                        "completed_maintenance.$.type": new_type,
                        "completed_maintenance.$.date": new_date,
                        "completed_maintenance.$.maintenance": new_maintenance,
                        "completed_maintenance.$.cost": parseInt(new_cost)
                    }
                });
            if (update.modifiedCount === 1) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({message: `Maintenance history updated for vehicle with config ${config_id}`})
                };
            }
            else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: `Maintenance history not updated for vehicle with config ${config_id}`})
                };
            }

        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};