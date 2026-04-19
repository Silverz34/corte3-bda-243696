

--funcion para calcular las facturas de las mascotas 
CREATE OR REPLACE FUNCTION fn_total_facturado(
    p_mascota_id INT,
    p_anio INT
) RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_citas NUMERIC;
    v_total_vacunas NUMERIC;
    v_total_general NUMERIC;
BEGIN
    -- Sumar el costo de las CITAS 
    -- Usar EXTRACT(YEAR FROM fecha) para sacar solo el año de la fecha_hora
    SELECT COALESCE(SUM(costo), 0) INTO v_total_citas
    FROM citas
    WHERE mascota_id = p_mascota_id
      AND estado = 'COMPLETADA'
      AND EXTRACT(YEAR FROM fecha_hora) = p_anio;

    -- Sumar el costo de las VACUNAS aplicadas en ese año
    SELECT COALESCE(SUM(costo_cobrado), 0) INTO v_total_vacunas
    FROM vacunas_aplicadas
    WHERE mascota_id = p_mascota_id
      AND EXTRACT(YEAR FROM fecha_aplicacion) = p_anio;

    -- Sumar ambos conceptos
    v_total_general := v_total_citas + v_total_vacunas;

    -- Devolver el resultado final garantizado como NUMERIC
    RETURN v_total_general; 
END;
$$;