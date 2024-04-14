import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';
import jwt from 'jsonwebtoken';

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
    const authorization = event.headers['Authorization'];
    const config_id = event['queryStringParameters'].config_id;
    const data = JSON.parse(event.body);
    const values = {
        old_type: data.old_type,
        old_date: data.old_date,
        old_maintenance: data.old_maintenance,
        old_cost: data.old_cost,
        new_type: data.new_type,
        new_date: data.new_date,
        new_maintenance: data.new_maintenance,
        new_cost: data.new_cost
    };

    return client.connect()
        .then(async () => {
            const token = authorization.split(" ")[1];
            const verified = jwt.verify(token, process.env.JWTSecret);
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({message: "Token invalid"})
                };
            }
            const decoded = jwt.decode(token, process.env.JWTSecret);

            const database = client.db("vehicleDB");
            const garage = database.collection("user_vehicle_info");
            const update = await garage.updateOne(
                {
                    email: decoded.email,
                    config_id: parseInt(config_id),
                    "completed_maintenance.type": values.old_type,
                    "completed_maintenance.date": values.old_date,
                    "completed_maintenance.maintenance": values.old_maintenance,
                    "completed_maintenance.cost": parseInt(values.old_cost)
                },
                {
                    $set: {
                        "completed_maintenance.$.type": values.new_type,
                        "completed_maintenance.$.date": values.new_date,
                        "completed_maintenance.$.maintenance": values.new_maintenance,
                        "completed_maintenance.$.cost": parseInt(values.new_cost)
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