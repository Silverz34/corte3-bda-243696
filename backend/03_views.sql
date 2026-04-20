
--View para mostrar las vacunaciones pendientes de cada mascota

CREATE OR REPLACE VIEW v_ascotas_vacunacion_pendiente AS
--olvide el CTE 
WITH Ultima_vacuna AS (
    SELECT
        m.id AS mascota_id,
        MAX(v.fecha_aplicacion) AS ultima_vacuna
    FROM vacunas_aplicadas
    GROUP BY mascota_id
)
SELECT
    m.nombre AS nombre_mascota,
    m.especie, 
    d.nombre AS nombre_dueno,
    d.telefono AS telefono_dueno,
    v.ultima_vacuna,
    CURRENT_DATE - v.ultima_vacuna AS dias_desde_ultima_vacuna
CASE 
    WHEN uv.fecha_ultima_vacuna IS NULL THEN 'NUNCA_VACUNADA'
    ELSE 'VENCIDA'
END AS prioridad 
FROM mascotas m
JOIN duenos d ON m.dueno_id = d.id
LEFT JOIN 
    Ultima_vacuna uv ON m.id = uv.mascota_id
WHERE v.ultima_vacuna IS NULL 
OR (CURRENT_DATE - v.ultima_vacuna) > 365; -- Consideramos que la vacuna es válida por un año (365 días)