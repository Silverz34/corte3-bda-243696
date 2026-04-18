
--View para mostrar las vacunaciones pendientes de cada mascota

CREATE OR REPLACE VIEWv_ascotas_vacunacion_pendiente AS
SELECT
    m.id AS mascota_id,
    m.nombre AS mascota_nombre,
    m.especie, 
    d.nombre AS nombre_dueno,
    d.telefono AS telefono_dueno,
    MAX(v.fecha_aplicacion) AS ultima_vacuna,
    CURRENT_DATE - MAX(v.fecha_aplicacion) AS dias_desde_ultima_vacuna
FROM mascotas m
JOIN duenos d ON m.dueno_id = d.id
GROUP BY m.id, m.nombre, m.especie, d.nombre , d.telefono
HAVING MAX(v.fecha_aplicacion) IS NULL 
OR (CURRENT_DATE - MAX(va.fecha_aplicacion)) > 365;