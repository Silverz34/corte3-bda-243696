
import {Router} from 'express';
import {buscarMascotas} from '../controllers/mascotaController';
import {validarRol} from '../authMiddleware';

const router = Router();
router.get('/api/mascotas', validarRol, buscarMascotas);

export default router;