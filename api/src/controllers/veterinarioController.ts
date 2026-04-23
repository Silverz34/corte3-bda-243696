import {Request, Response} from 'express';
import {pool} from '../config/database';

export const obtenerCatalogoVeterinarios = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
       const querySQL = `
            SELECT id, nombre 
            FROM veterinarios 
            WHERE activo = true 
            ORDER BY nombre ASC
        `;
        const result = await client.query(querySQL);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener veterinarios' });
    } finally {
        client.release();
    }
};