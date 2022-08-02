import axios from 'axios';
import { createClient } from 'redis';
import 'dotenv/config';

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();
let token = await client.get("token");

class http {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.SERVER_ENDPOINT,
    });
    this.axiosInstance.interceptors.request.use(
      async (req) => {
        if (token) {
          req.headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };
          return req;
        } else {
          const loginData = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
          };
          await this.getToken(loginData);
          token = await client.get("token");
          req.headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };
          return req;
        }
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
        console.log(err.message || err);
      },
    );
  }

  getToken = (loginData) =>
    new Promise(async (resolve, reject) => {
      resolve(
        await axios.post(
          `${process.env.SERVER_ENDPOINT}/oauth/authenticate`,
          loginData,
        ),
      );
    }).then(
      (res) => client.set("token", res.data.access_token),
      client.expire("token", 604800),
    );

  get = (url, params) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .get(url, params)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  };

  post = (url, params, options) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .post(url, params, options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  };

  put = (url, params, options) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .put(url, params, options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  };

  delete = (url, params, options) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .delete(url, params, options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  };
}

export default new http();
