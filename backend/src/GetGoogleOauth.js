import { getGoogleOauthURL } from "./getGoogleOauthURL";
export const getGoogleOauthRoute = {
    path: "/auth/google/url",
    method: "get",
    handler: (req, res) => {
        const url = getGoogleOauthURL();
        res.status(200).json({url});
        }
};