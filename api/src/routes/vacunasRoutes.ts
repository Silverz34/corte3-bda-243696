import {Router} from 'express';
import {obtenerVacunasPen, aplicarVacuna} from '../controllers/vacunasController';
import {validarRol} from '../authMiddleware';

const router = Router();

router.get('/pendientes', validarRol, obtenerVacunasPen);

router.post('/aplicar', validarRol, aplicarVacuna);

export default router;
