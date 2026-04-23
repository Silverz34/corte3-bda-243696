import {Router} from 'express';
import {obtenerVacunasPen, aplicarVacuna, obtenerCatalogoVacunas } from '../controllers/vacunasController';
import {validarRol} from '../authMiddleware';

const router = Router();

router.get('/pendientes', validarRol, obtenerVacunasPen);

router.post('/aplicar', validarRol, aplicarVacuna);

router.get('/nombres',validarRol, obtenerCatalogoVacunas);

export default router;
