
import {Request, Response} from 'express';
import {pool} from '../config/database';
import {redisClient} from '../config/redis';


export const obtenerVacunasPen = async (req: Request, res: Response) => {
    const CACHE_KEY = 'vacunas_pendientes';
    try{
        //tratar de leer los redis primero 
        const cachedData = await redisClient.get(CACHE_KEY);

        if (cachedData) {
            console.log(`[CACHE HIT] ${CACHE_KEY}`);
            res.status(200).json(JSON.parse(cachedData));
            return;
        }

        console.log(`[CACHE MISS] ${CACHE_KEY}`);
        const client = await pool.connect();
        let result;
        try {
            // Consultamos la vista en la base de datos para obtener las mascotas con vacunación pendiente
            result = await client.query('SELECT * FROM v_mascotas_vacunacion_pendiente');
        } finally {
            client.release();
        }

        //guardado de redis con Time To Live (TTL) de 5 min 
        await redisClient.setEx(CACHE_KEY, 300, JSON.stringify(result.rows));
        res.status(200).json(result.rows);

    }catch (error) {
        console.error('Error al obtener vacunas pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};