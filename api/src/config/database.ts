import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Si por alguna razón TypeScript no lee el .env a tiempo, usará esta cadena segura.
const connectionString = process.env.DATABASE_URL || 'postgresql://api_backend:Kalaha0918@localhost:5432/clinica_vet';

export const pool = new Pool({
    connectionString: connectionString
});

pool.on('error', (err) => {
    console.error('error inesperado en el pool de la bd', err);
    process.exit(-1);
});