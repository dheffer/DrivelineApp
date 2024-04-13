import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config'

export const handler = async (event) => {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );
    const email = event['email'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            return await garage.aggregate([
                {
                    $match: {
                        email: email
                    }
                },
                {
                    $lookup: {
                        from: 'configurations',
                        localField: 'vehicle_config_ids',
                        foreignField: 'config_id',
                        as: 'configurations'
                    }
                },
                {
                    $unwind: '$configurations'
                },
                {
                    $project: {
                        _id: 0,
                        configurations: 1
                    }
                }
            ]).toArray();
        }).then(vehicles => {
            return {
                statusCode: 200,
                body: JSON.stringify(vehicles)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
}