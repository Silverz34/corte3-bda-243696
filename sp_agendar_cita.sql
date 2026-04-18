CREATE OR REPLACE PROCEDURE sp_agendar_cita(
    p_mascota_id INT,
    p_veterinario_id INT,
    p_fecha_hora TIMESTAMP,
    p_motivo TEXT,
    OUT p_cita_id INT
)AS BEGIN
    -- Verificar que la mascota exista
    IF NOT EXISTS (SELECT 1 FROM mascotas WHERE id = p_mascota_id) THEN
        RAISE EXCEPTION 'La mascota con ID % no existe', p_mascota_id;
    END IF;

    -- Verificar que el veterinario exista
    IF NOT EXISTS (SELECT 1 FROM veterinarios WHERE id = p_veterinario_id) THEN
        RAISE EXCEPTION 'El veterinario con ID % no existe', p_veterinario_id;
    END IF;

    -- Insertar la cita en la tabla de citas
    INSERT INTO citas (mascota_id, veterinario_id, fecha_hora, motivo)
    VALUES (p_mascota_id, p_veterinario_id, p_fecha_hora, p_motivo)
    RETURNING id INTO p_cita_id;
END;