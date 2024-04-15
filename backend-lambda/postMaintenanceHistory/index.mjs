/**
 * @fileoverview This file contains a single AWS Lambda function handler for posting vehicle maintenance history.
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
 * AWS Lambda function handler for posting vehicle maintenance history.
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
    const config_id = event['queryStringParameters'].config_id;

    // Parsing the body of the incoming event
    const data = JSON.parse(event.body);

    // Creating a maintenance object from the parsed data
    const maintenance = {
        type: data.type,
        date: data.date,
        maintenance: data.maintenance,
        cost: parseInt(data.cost)
    }

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

            // Accessing the 'vehicleDB' database and 'user_vehicle_info' collection
            const database = client.db("vehicleDB");
            const garage = database.collection("user_vehicle_info");

            // Updating a document in the 'user_vehicle_info' collection
            return await garage.updateOne(
                {email: decoded.email, config_id: parseInt(config_id)},
                {$push: {completed_maintenance: maintenance}}
            );
        }).then(res => {
            // Logging the result of the update operation and returning it as a JSON string with a 200 status code
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