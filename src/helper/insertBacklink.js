import http from "./http.js";

export default async function insertBacklink(reqBody) {
  const res = await http.post("/oauth/insertBacklink", reqBody);
  return res.data;
}
