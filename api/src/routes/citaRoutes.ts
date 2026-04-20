import Router from 'express';
import { agendarCita } from '../controllers/citasControler';
import {validarRol} from '../authMiddleware';

const router = Router();

router.post('/agendar', validarRol, agendarCita);

export default router;