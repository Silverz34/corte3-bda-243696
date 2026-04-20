import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Error en Redis Client:', err));
redisClient.on('connect', () => console.log('Conectado a Redis exitosamente'));