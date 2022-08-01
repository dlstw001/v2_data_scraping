import http from "./http.js";

export default async function insertKeyword(reqBody) {
  const res = await http.post("/oauth/insertKeyword", reqBody);
  return res.data;
}
