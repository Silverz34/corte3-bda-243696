import z from 'zod';

export const VacunasSchema = z.object({
    mascota_id: z.number().int().positive(),
    vacuna_id: z.number().int().positive(),
    costo_cobrado: z.number().nonnegative()
});


export type VacunaPayload = z.infer<typeof VacunasSchema>;
