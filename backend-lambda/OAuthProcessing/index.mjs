import { google } from 'googleapis';
import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {

    const JWTSecret = process.env.JWTSecret;
    const oauthClient = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.OAUTH_CALLBACK_URL
    );
    const { code } = event['queryStringParameters'];

    const { tokens } = await oauthClient.getToken(code);

    const url = getAccessAndBearerTokenUrl(tokens.access_token);

    const myHeaders = new Headers();

    const bearerToken = "Bearer "+tokens.id_token;

    myHeaders.append("Authorization", bearerToken);

    const reqOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return await fetch(url, reqOptions)
        .then(response => response.json())
        .then(res => {
            let user = updateOrCreateUserFromOAuth(res);
            console.log("User: ", user.name + " " + user.email)
            const token = jwt.sign( {"name":user.name, "email":user.email}, JWTSecret, {expiresIn: '2d'} );
            return {
                statusCode: 302,
                headers: {
                    "Location": `${process.env.APP_URL}/login?token=${token}`
                }
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        });
};

const updateOrCreateUserFromOAuth = async (user) => {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );
    const { name, email } = user;

    console.log("User in function: ", name + " " + email)

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const users = database.collection("users");
            const existingUser = await users.findOne({email})
            if( existingUser ) {
                console.log("User exists")
                const result = await users.findOneAndUpdate({email},
                    { $set: {name, email}},
                    { returnDocument: "after"}
                );
                console.log("Result: ", result.value.name + " " + result.value.email)
                return {
                    statusCode: 200,
                    body: JSON.stringify(result.value)
                };
            }
            else {
                console.log("User does not exist")
                const result = await users.insertOne( {email, name});
                console.log("Result: ", result.value.name + " " + result.value.email)
                return {
                    statusCode: 200,
                    body: JSON.stringify(result.value)
                };
            }
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};



const getAccessAndBearerTokenUrl = (access_token) => {
  return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
};