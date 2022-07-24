import TestCrawler from '../crawler/main.js';
import { createClient } from 'redis'

const redis = createClient()
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect()

class requestController {
    constructor(){
        this.createRequest = this.createRequest.bind(this);
    }

    async createRequest(req,res){
        /* TestCrawler(req.body.url); */
        await redis.set('url',req.body.url);
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const current = new Date();
        console.log(weekday[current.getDay()])
        return(
            res.status(200).json({data:weekday[current.getDay()]}
        ))
    }
}

export default new requestController();
