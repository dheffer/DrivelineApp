import { MongoClient, ServerApiVersion } from 'mongodb';
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
    const email = event.headers['email'];
    const config_id = event.body['config_id'];
    const odometer = event.body['odometer'];
    const picture_url = event.body['picture_url'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const userVehicle = database.collection("user_vehicle_info");
            const updateData = {};
            let type = '';
            if (odometer) {
                type = 'Odometer';
                await userVehicle.updateOne(
                    { email: email, config_id: config_id },
                    { $set: { odometer: parseInt(odometer) } }
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify(`${type} updated to ${odometer}`)
                };
            }
            else if (picture_url) {
                updateData.picture_url = picture_url;
                type = 'Picture URL'
                await userVehicle.updateOne(
                    { email: email, config_id: config_id },
                    { $set: { picture_url: picture_url } }
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify(`${type} updated to ${picture_url}`)
                };
            }
            else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Bad Request: Please provide odometer or picture_url" })
                };
            }
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};