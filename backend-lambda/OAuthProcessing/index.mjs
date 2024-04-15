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
    const {code} = event['queryStringParameters'];
    const {tokens} = await oauthClient.getToken(code);
    const url = getAccessAndBearerTokenUrl(tokens.access_token);

    const myHeaders = new Headers();
    const bearerToken = "Bearer " + tokens.id_token;
    myHeaders.append("Authorization", bearerToken);

    const reqOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        let response = await fetch(url, reqOptions);
        console.log(response)
        let res = await response.json();
        console.log(res)
        await updateOrCreateUserFromOAuth(res);
        const payload = {
            name: res.name,
            email: res.email
        }
        console.log("PAYLOAD  " + JSON.stringify(payload));
        const token = jwt.sign( payload, JWTSecret, {expiresIn: '2d'} );
        console.log("TOKEN  " + token);
        console.log("VERIFY " + jwt.verify(token, JWTSecret));
        console.log("DECODE " + jwt.decode(token, JWTSecret).name + " " + jwt.decode(token, JWTSecret).email);

        return {
            statusCode: 302,
            headers: {
                "Location": `${process.env.APP_URL}/login?token=${token}`
            }
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.message
        };

    }
}

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
    console.log("UPDATE OR CREATE FROM OAUTH -- NAME & EMAIL " + name + " " + email)

    try {
        await client.connect();
        const database = client.db("vehicleDB");
        const users = database.collection("users");
        const existingUser = await users.findOne({email});

        if (existingUser) {
            console.log("User exists")
            await users.findOneAndUpdate({email},
                {$set: {name, email}},
                {returnDocument: "after"}
            );
            console.log("UPDATED USER")

        } else {
            console.log("User does not exist")
            await users.insertOne({email, name});
            console.log("NEW USER ADDED")


        }
    }
    catch (e) {
        console.log(e.message);
    }
    finally{
        console.log("FINISHED")
        await client.close();
    }
}
const getAccessAndBearerTokenUrl = (access_token) => {
  return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
};