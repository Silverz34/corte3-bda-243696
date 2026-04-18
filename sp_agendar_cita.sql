CREATE OR REPLACE PROCEDURE sp_agendar_cita(
    p_mascota_id INT,
    p_veterinario_id INT,
    p_fecha_hora TIMESTAMP,
    p_motivo TEXT,
    OUT p_cita_id INT
)AS $$ DECLARE
    v_mascota_existe BOOLEAN;
    v_vet_activo BOOLEAN;
    v_dias_descanso VARCHAR(50);
    v_dia_semana TEXT;
    v_colision_existe BOOLEAN; 
BEGIN
    -- Verificar que la mascota exista
    SELECT EXISTS (SELECT 1 FROM mascotas WHERE id = p_mascota_id) INTO v_mascota_existe;
    IF NOT v_mascota_existe OR v_mascota_existe IS NULL THEN
        RAISE EXCEPTION 'La mascota con ID % no existe', p_mascota_id;
    END IF;

    -- Verificar que el veterinario (exista, estado y bloqueo de ocurrencias)
    SELECT activo, dias_descanso INTO v_vet_


    IF NOT v_vet_activo OR v_vet_activo IS NULL THEN
        RAISE EXCEPTION 'El veterinario con ID % no existe', p_veterinario_id;
    END IF;

    -- Insertar la cita en la tabla de citas
    INSERT INTO citas (mascota_id, veterinario_id, fecha_hora, motivo)
    VALUES (p_mascota_id, p_veterinario_id, p_fecha_hora, p_motivo)
    RETURNING id INTO p_cita_id;
END;