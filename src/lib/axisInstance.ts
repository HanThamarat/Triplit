import axios from "axios";

// NOTE: this module is pulled into the client bundle via the Redux store
// (reduxProvider → store → authSlice → here), so it must stay browser-safe.
// `NEXT_PUBLIC_*` vars are statically inlined by Next at build time — no dotenv
// (a Node-only package that crashes in the browser) needed here.
export const AxiosInstanceWithoutAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_V1,
    timeout: 5000,
});