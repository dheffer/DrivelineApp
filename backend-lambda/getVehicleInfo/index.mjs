/**
 * @fileoverview This file contains a single AWS Lambda function handler for getting vehicle information.
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
 * AWS Lambda function handler for getting vehicle information.
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
                    body: JSON.stringify({ message: "Token invalid" })
                };
            }

            // Accessing the 'vehicleDB' database and 'configurations' collection
            const database = client.db("vehicleDB");
            const vehicle = database.collection("configurations");

            // Finding a vehicle in the 'configurations' collection
            return await vehicle.findOne({config_id: parseInt(config_id)});
        }).then(config => {
            // Returning the found vehicle as a JSON string with a 200 status code
            return {
                statusCode: 200,
                body: JSON.stringify({message: config})
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