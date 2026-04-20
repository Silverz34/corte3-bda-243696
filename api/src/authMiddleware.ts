
import {Request, Response, NextFunction} from "express";

export const validarRol= (req: Request, res: Response, next: NextFunction) => {
    const rol = req.headers['x-rol'] as string;
    const vetId = req.headers['x-vet-id'] as string;

    const rolesPermitidos = ['admin', 'veterinario', 'recepcion'];
    if (!rol || !rolesPermitidos.includes(rol)) {
        res.status(403).json({ error: 'Acceso denegado: Rol inválido o no autorizado.' });
        return;
    }

    if (rol === 'veterinario' && !vetId) {
        res.status(400).json({ error: 'Acceso denegado, se requiere un ID de veterinario válido.' });
        return;
    }

    next();
};