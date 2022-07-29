import axios from "axios";
import { createClient } from "redis";
import "dotenv/config";

const resParser = (res) => res.data;
const errParse = (err) => err.response;

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

class http {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.SERVER_ENDPOINT,
      timeout: 5000,
    });
    this.axiosInstance.interceptors.request.use(
      async (req) => {
        let token = await client.get("token");
        if (token !== null) {
          req.headers.Authorization = `Bearer ${token}`;
          return req;
        }
        const loginData = {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        };
        await this.getToken(loginData);
        token = await client.get("token");
        req.headers.Authorization = `Bearer ${token}`;
        return req;
      },
      (err) => {
        return Promise.reject(err);
      },
    );
    this.axiosInstance.interceptors.response.use(
      async (res) => {
        return res;
      },
      async (err) => {
        console.log(err);
      },
    );
  }

  getToken = (loginData) =>
    new Promise((resolve, reject) => {
      resolve(
        axios.post(
          `${process.env.SERVER_ENDPOINT}/oauth/authenticate`,
          loginData,
        ),
      );
      reject(console.log("get token error"));
    }).then(
      (res) => client.set("token", res.data.access_token),
      client.expire("token", 604800),
    );

  get = (url, params) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .get(url, params)
        .then((res) => resolve(resParser(res)))
        .catch((err) => reject(errParse(err)));
    });
  };

  post = (url, params, options) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .post(url, params, options)
        .then((res) => resolve(resParser(res)))
        .catch((err) => reject(errParse(err)));
    });
  };

  put = (url, params, options) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .put(url, params, options)
        .then((res) => resolve(resParser(res)))
        .catch((err) => reject(errParse(err)));
    });
  };

  delete = (url, params, options) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .delete(url, params, options)
        .then((res) => resolve(resParser(res)))
        .catch((err) => reject(errParse(err)));
    });
  };
}

export default new http();
