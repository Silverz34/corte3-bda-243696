import {Request, Response} from 'express';
import {pool} from '../config/database';

export const agendarCita = async (req: Request, res: Response): Promise<void> => {
    const { mascota_id, veterinario_id, fecha_cita, motivo } = req.body;
    const vetId = req.headers['x-vet-id'] as string;
    const rol = req.headers['x-rol'] as string; 

    const client = await pool.connect();
    try{
        await client.query('BEGIN');

        await client.query('SET ROLE $1', [rol]);
        if (vetId) {
            await client.query(`SELECT set_config('app.current_vet_id', $1, true)`, [vetId]);
        }

        //llamar la store procedure para agemdar una nueva cita 
        //aun no se como se llama


    }catch(error: any){
        await client.query('ROLLBACK');
        console.error('Error al agendar cita:', error.message);
        res.status(400).json({ error: error.message });
    }finally{
        await client.query('RESET ROLE');
        client.release();
    }
};