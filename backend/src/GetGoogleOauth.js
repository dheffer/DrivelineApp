import { getGoogleOauthURL } from "./getGoogleOauthURL";
export const getGoogleOauthRoute = {
    path: "api/auth/google/url",
    method: "get",
    handler: (req, res) => {
        const url = getGoogleOauthURL();
        res.status(200).json({url});
        }
};