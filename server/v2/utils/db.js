import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

let { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

console.log(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
const redisClient = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
});

export const getClient = () => redisClient;
