import z from 'zod';

export const CitaSchema = z.object({
    mascota_id: z.number().int().positive(),
    veterinario_id: z.number().int().positive(),
    fecha_hora: z.string(),
    motivo: z.string().optional(),
});

export type CitaPayload = z.infer<typeof CitaSchema>;
