import { google } from 'googleapis';
import 'dotenv/config'

export const oauthClient = new google.auth.OAuth2(
    '947922305847-o7gbgmm9ngk02lrlp45vtu3g6h70aiun.apps.googleusercontent.com',
    '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',
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