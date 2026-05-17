const PRODUCTION = 'https://green-basket-backend-f9xm.onrender.com'


export const BASE_URL = PRODUCTION;


// toggle developer mode to use easy sign in
export const developerMode = false;

export const credentials = {
    admin_username : process.env.EXPO_PUBLIC_USERNAME,
    admin_password : process.env.EXPO_PUBLIC_PASSWORD
}
export const constants = {
}