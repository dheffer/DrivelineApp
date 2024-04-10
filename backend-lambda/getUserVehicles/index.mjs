import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config'

export const handler = async (event) => {

    const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );

    try {
        const database = client.db("vehicleDB");
        const garage = database.collection("user_garage");

        return await garage.aggregate([
            {
                $match: {
                    user_id: 'dheffer'
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

    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}