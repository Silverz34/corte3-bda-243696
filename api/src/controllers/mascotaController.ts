import { Request, Response } from "express";
import {pool} from "../config/database";

export const buscarMascotas = async(req: Request, res: Response): Promise<void> => {
    const vetId = req.headers['x-vet-id'] as string;
    const rol = req.headers['x-rol'] as string; 

    const busqueda = req.query.busqueda as string || '';
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`SET ROLE ${rol}`);
        if(vetId){
            await client.query(`SELECT set_config('app.current_vet_id', $1, true)`, [vetId]);
        }
        const querySQL = `
            SELECT id, nombre, especie, fecha_nacimiento, dueno_id 
            FROM mascotas 
            WHERE nombre ILIKE $1
        `;
        const result = await client.query(querySQL, [`%${busqueda}%`]);

        await client.query('COMMIT');
        res.status(200).json(result.rows);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al buscar mascotas:', error);
        res.status(500).json({ error: 'Error al buscar mascotas.' });
    } finally {
        client.release();
    }
};