import { google } from 'googleapis';

export const oauthClient = new google.auth.OAuth2(
    '947922305847-b5mk57aj60latf8clk5te523k6uluaa1.apps.googleusercontent.com',
    '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',
    'http://localhost:8080/api/auth/google/callback',
);