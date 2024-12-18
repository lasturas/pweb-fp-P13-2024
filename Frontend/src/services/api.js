import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NWU4ZDhiOWQ2OTJiMzM3MzY2ZThiYSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MzQ0MzI3OTgsImV4cCI6MTczNDQzNjM5OH0.DMBP_YIzLXOtTkLZfbpHPW7T11DyetLBsmQhAZKp6gM";

const api = axios.create({
  baseURL: "http://localhost:5050",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default api;
