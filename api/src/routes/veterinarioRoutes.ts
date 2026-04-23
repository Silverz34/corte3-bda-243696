import {Router} from 'express';
import {validarRol} from '../authMiddleware';
import { obtenerCatalogoVeterinarios } from '../controllers/veterinarioController';

const router = Router();

router.get('/nombres', validarRol, obtenerCatalogoVeterinarios);

export default router;
