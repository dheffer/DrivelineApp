import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config'
import jwt from 'jsonwebtoken';

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
    const authorization = event.headers['Authorization'];

    return client.connect()
        .then(async () => {
            const token = authorization.split(" ")[1];
            console.log("Token:", token);
            const verified = jwt.verify(token, process.env.JWTSecret);
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "No token provided" })
                };
            }
            const decoded = jwt.decode(token, process.env.JWTSecret);
            console.log("Decoded:", decoded);
            console.log("name & email: " + decoded.name + " " + decoded.email);

            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            const userVehicle = database.collection("user_vehicle_info");
            const userGarage = await garage.findOne({email: decoded.email});

            if(!userGarage){
                return res.status(404).json({message: "User not found"});
            }

            const vehicleConfigIds = userGarage.vehicle_config_ids;
            if(!vehicleConfigIds){
                return res.status(404).json({message: "User has no vehicles"});
            }

            const vehicle = await userVehicle.find(
                {email: decoded.email, config_id: {$in: vehicleConfigIds}}
            ).toArray();

            return{
                statusCode: 200,
                body: JSON.stringify(vehicle)
            }
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
}