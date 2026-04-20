
import {Request, Response} from 'express';
import {pool} from '../config/database';
import {redisClient} from '../config/redis';
import { VacunasSchema } from '../zodSchema/vacunasSchema';


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

//aplicar vacunas y borrar cache (ayudita con gemini)
export const aplicarVacuna = async (req: Request, res: Response) => {
    const validacion = VacunasSchema.safeParse(req.body);

    if(!validacion.success){
        res.status(400).json({
            error: 'Datos de entrada invalidos',
            detalles: validacion.error.format()
        });
        return;
    }

    const { mascota_id, vacuna_id, costo_cobrado } = req.body;
    const veterinario_id = req.headers['x-vet-id'];

    const client = await pool.connect();
    try{
        await client.query('BEGIN');

        // Insertar el registro de vacunación
        const queryInsert = `
            INSERT INTO vacunas_aplicadas (mascota_id, vacuna_id, veterinario_id, costo_cobrado, fecha_aplicacion)
            VALUES ($1, $2, $3, $4, CURRENT_DATE)
            RETURNING id;
        `;
        const valores = [mascota_id, vacuna_id, veterinario_id, costo_cobrado];
       
        await client.query(queryInsert, valores);
        await client.query('COMMIT');
 
        // Como alguien vacunó a una mascota, la lista de "pendientes" ya cambió.
        // Borramos la llave de Redis para forzar un CACHE MISS la próxima vez.
        await redisClient.del('vacunas_pendientes');
        console.log('[REDIS] cache invalido para vacunas_pendientes');
        res.status(200).json({ message: 'Vacuna aplicada exitosamente' });
    }catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al aplicar vacuna:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        client.release();
    }
};
