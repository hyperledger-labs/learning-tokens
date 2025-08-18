import axios from "axios";

export const client = axios.create({
  baseURL: "http://local.overhang.io",
  headers: {
    "Accept": "application/json",
  },
  withCredentials: true, // Important for session cookie
});
