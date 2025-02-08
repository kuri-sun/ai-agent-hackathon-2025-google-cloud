import { BE_URL, GOOGLE_OAUTH_CLIENT_ID } from "../utils/constants";
import axios from "axios";

export const Axios = axios.create({
  baseURL: BE_URL,
  headers: {
    Accept: "*/*",
    Authorization: "Bearer " + localStorage.getItem("token"),
    "x-client-id": GOOGLE_OAUTH_CLIENT_ID,
    "x-refresh-token": localStorage.getItem("refreshToken"),
  },
});
