/**
 * @fileoverview This file contains a single AWS Lambda function handler for generating a Google OAuth URL.
 * It uses the 'googleapis' library to interact with Google's OAuth2 API.
 *
 * @author dheffer
 * @version 1.0.0
 */

// Importing required modules
import { google } from 'googleapis' // Google APIs library

/**
 * AWS Lambda function handler for generating a Google OAuth URL.
 *
 * @param {Object} event - The incoming event.
 * @param {Object} context - The context of the function.
 * @returns {Object} The response object containing the generated URL.
 */
export const handler = async (event, context) => {
  const url = getGoogleAuthUrl();

  return { url };
};

/**
 * Function to generate a Google OAuth URL.
 *
 * @returns {string} The generated Google OAuth URL.
 */
const getGoogleAuthUrl = () => {
  const oauth = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.OAUTH_CALLBACK_URL
  );
  return oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};