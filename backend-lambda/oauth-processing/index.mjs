import { google} from 'googleapis';
import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
    const JWTSecret = 'test123'
    const authClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.OAUTH_CALLBACK_URL
    );
    const { code } = event.queryStringParameters;
    const { tokens } = await authClient.getToken(code);

    const url = getAccessAndBearerTokenUrl(tokens.access_token);
    const myHeaders = new Headers();
    const bearer = `Bearer ${tokens.id_token}`;
    myHeaders.append("Authorization", bearer);
    const reqOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(url, reqOptions)
        .then(res => res.json())
        .then(res => {
            updateOrCreateUserFromOauth(res)
        })
        .then(user => {
            jwt.sign( {"name":user.name, "email":user.email}, JWTSecret, {expiresIn: '2d'}, (err, token) => {
                if(err) {
                    return {
                        statusCode: 500,
                        body: JSON.stringify({message: "Internal Server Error"})
                    }
                }
                return {
                    statusCode: 302,
                    headers: {
                        "Location": `${process.env.APP_URL}/login?token=${token}`,
                    },
                }
            })
        })
        .catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({message: `Internal Server Error: ${err.message}`})
            }
        });

        /*
        const token = authorization.split(" ")[1];
        console.log(token+ ": TOKEN");
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }

            console.log("Decoded:   "+decoded);

            const DATABASE = client.db("vehicleDB");
            const users = DATABASE.collection("users");

            const user = await users.findOne({email: decoded.email});
            console.log("AUTHORIZ USER: "+user);

            if(!user) {
                res.status(404).json({message: "User not found"});
            }
            res.json(user);
        });
         */
};

const updateOrCreateUserFromOauth = async (oauthUserInfo) => {
    const {
        name,
        email,
    } = oauthUserInfo;

    console.log(name);
    console.log(email);

    const users = DATABASE.collection("users");

    const existingUser = await users.findOne({email})

    if( existingUser ) {
        const result = await users.findOneAndUpdate({email},
            { $set: {name, email}},
            { returnDocument: "after"}
        );
        return result;
    }
    else {
        const result = await users.insertOne( {email, name});
        return { email, name, _id: result.insertedId };
    }
}

const getAccessAndBearerTokenUrl = (access_token) => {
    return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
}