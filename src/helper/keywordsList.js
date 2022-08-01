import http from "./http.js";

const keywordsList = await http.get("/oauth/getKeywords");

export default keywordsList;
