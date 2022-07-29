import http from "./http.js";

const keywordsList = await http.get("/oauth/getUrlList");

export default keywordsList;
