import { google } from 'googleapis';

export const oauthClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:3000/auth/google/callback',
);