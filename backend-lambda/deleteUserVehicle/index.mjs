/**
 * @fileoverview This file contains a single AWS Lambda function handler for deleting a user's vehicle.
 * It uses MongoDB as a database and JWT for authentication.
 *
 * @author dheffer
 * @version 1.0.0
 */

// Importing required modules
import {MongoClient, ServerApiVersion} from "mongodb"; // MongoDB driver
import 'dotenv/config'; // Module to load environment variables
import jwt from 'jsonwebtoken'; // Library to work with JSON Web Tokens

/**
 * AWS Lambda function handler for deleting a user's vehicle.
 *
 * @param {Object} event - The incoming event.
 * @param {Object} context - The context of the function.
 * @returns {Promise<Object>} The response object with a status code and a body.
 */
export const handler = async (event, context) => {

    // MongoDB connection string
    const uri = process.env.MONGO_URI;

    // Creating a new MongoDB client
    const client = new MongoClient(uri,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );

    // Extracting the 'Authorization' header and 'config_id' from the incoming event
    const authorization = event.headers['Authorization'];
    const data = JSON.parse(event.body);
    const config_id = data.config_id;

    // Connecting to the MongoDB database
    return client.connect()
        .then(async () => {
            // Extracting the JWT from the 'Authorization' header
            const token = authorization.split(" ")[1];

            // Verifying the JWT
            const verified = jwt.verify(token, process.env.JWTSecret);

            // If the JWT is invalid, return a 401 status code with a message
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({message: "Token invalid"})
                };
            }

            // Decoding the JWT
            const decoded = jwt.decode(token, process.env.JWTSecret);

            // Accessing the 'vehicleDB' database and 'user_garage' collection
            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");

            // Updating a document in the 'user_garage' collection
            return await garage.updateOne(
                {email: decoded.email},
                {$pull: {vehicle_config_ids: config_id}}
            );
        }).then(res => {
            // Logging the result of the update operation and returning it as a JSON string with a 200 status code
            console.log(res);
            return {
                statusCode: 200,
                body: JSON.stringify({message: res})
            };
        }).then(async () => {
            // Extracting the JWT from the 'Authorization' header
            const token = authorization.split(" ")[1];

            // Verifying the JWT
            const verified = jwt.verify(token, process.env.JWTSecret);

            // If the JWT is invalid, return a 401 status code with a message
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({message: "Token invalid"})
                };
            }

            // Decoding the JWT
            const decoded = jwt.decode(token, process.env.JWTSecret);

            // Accessing the 'vehicleDB' database and 'user_vehicle_info' collection
            const database = client.db("vehicleDB");
            const vehicInfo = database.collection("user_vehicle_info");

            // Deleting a document in the 'user_vehicle_info' collection
            return await vehicInfo.deleteOne(
                {email: decoded.email, config_id: config_id}
            );
        }).then(res => {
            // Logging the result of the delete operation and returning it as a JSON string with a 200 status code
            console.log(res);
            return {
                statusCode: 200,
                body: JSON.stringify({message: res})
            };
        }).catch(err => {
            // If any error occurs during the process, return a 500 status code with an error message
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => {
            // Closing the database connection
            client.close();
        });
};