import {Request, Response} from 'express';
import {pool} from '../config/database';

export const obtenerCatalogoVeterinarios = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT id, nombre FROM veterinarios WHERE activo = true');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener veterinarios' });
    } finally {
        client.release();
    }
};