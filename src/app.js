import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import http from "http";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes(app);
const server = http.createServer(app);
server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})