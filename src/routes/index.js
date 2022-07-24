import requestRoute from './requestRoute.js'

export default (app) => {
    const basePath = '/api/v1';

    app.use(`${basePath}/requests`, requestRoute);
}