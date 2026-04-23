import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {pool} from './config/database';
import {redisClient} from './config/redis';


dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

//permitir peticiones en el frontend 
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) =>{
    res.json({status: 'API veterinaria viva'});
});

const startServer = async () => {
    try{

        await redisClient.connect();

        //probar conexion a postgrestSQL
        const client = await pool.connect();
        console.log('conectado a postgreSQL exitosamente');
        client.release();
      

        app.listen(port, () => {
            console.log (`servidor API corriedo en http://localhost:${port}`);
        });
    }catch (err){
        console.error('Error al iniciar el servidor:', err);
    }
}; 

import citaRoutes from './routes/citaRoutes';
import mascotaRoutes from './routes/mascotaRoutes';
import vacunasRoutes from './routes/vacunasRoutes';
import veterinarioRoutes from './routes/veterinarioRoutes';

app.use('/api/citas', citaRoutes);
app.use('/api', mascotaRoutes);
app.use('/api/vacunas', vacunasRoutes);
app.use('/api/veterinarios', veterinarioRoutes);
startServer();
