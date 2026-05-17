

const production_url = process.env.EXPO_PUBLIC_PRODUCTION;
const local_url = process.env.EXPO_PUBLIC_LOCAL
export const BASE_URL = production_url


// toggle developer mode to use easy sign in
export const developerMode = false;

export const credentials = {
    admin_username : process.env.EXPO_PUBLIC_USERNAME,
    admin_password : process.env.EXPO_PUBLIC_PASSWORD
}
export const constants = {
}