import { google } from 'googleapis'

export const handler = async (event, context) => {
  const url = getGoogleAuthUrl();

  return { url };
};

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
