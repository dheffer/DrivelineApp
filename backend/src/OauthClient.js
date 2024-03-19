import { google } from 'googleapis';
// import { config as dotenvConfig } from 'dotenv';

// dotenvConfig();
console.log("PROCESS"+process.env)


export const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:8080/api/auth/google/callback',
);
export const getGoogleOauthURL = () => {
    return oauthClient.generateAuthUrl( {
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ]
    });
}