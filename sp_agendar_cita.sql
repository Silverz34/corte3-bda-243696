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
    SELECT activo, dias_descanso INTO v_vet_activo, v_dias_descanso
    FROM veterinarios 
    WHERE id = p_veterinario_id FOR UPDATE;

    IF NOT FOUND THEN 
        RAISE EXCEPTION 'El veterinario con ID % no existe', p_veterinario_id;
    END IF;
    -- Verificar que el veterinario esté activo
    IF v_vet_activo IS NULL OR v_vet_activo = FALSE THEN 
        RAISE EXCEPTION 'El veterinario no se  encuentra activo';
    END IF;

    --validacion de dia de descanso
    v_dia_semana := trim(lower(to_char(p_fecha_hora, 'tmday')));
    IF  position(v_dia_semana in lower(v_dias_descanso)) > 0 THEN
        RAISE EXCEPTION 'El veterinario no atiende los días %', v_dia_semana;
    END IF;

    --COLISION DE CITAS 
    SELECT EXISTS(
        SELECT 1 FROM citas 
        WHERE veterinario_id = p_veterinario_id 
        AND fecha_hora = p_fecha_hora
        AND estado != 'CANCELADA'
    ) INTO v_colision_existe;

    IF v_colision_existe THEN
        RAISE EXCEPTION 'Ya existe una cita programada para el veterinario en esa fecha y hora';
    END IF;

    -- Insertar la cita en la tabla de citas
    INSERT INTO citas (mascota_id, veterinario_id, fecha_hora, motivo, estado )
    VALUES (p_mascota_id, p_veterinario_id, p_fecha_hora, p_motivo, 'AGENDADA')
    RETURNING id INTO p_cita_id;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al agendar la cita: %', SQLERRM;
END;
