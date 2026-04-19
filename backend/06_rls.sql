
--habilitar RLS en ta tabla de mascotas 
ALTER TABLE  mascotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_mascotas_admin_recepcion ON mascotas 
FOR ALL TO admin, recepcion 
USING (true);

-- politicas para admin y recepcion 
CREATE POLICY p_mascotas_admin_recepcion ON mascotas 
FOR ALL 
TO admin, reccepcion 
USING (true); -- significa que no hay restricciones 

--politicas para veterinarios (filtro por ID)
CREATE POLICY p_mascotas_veterinario ON mascotas 
FOR SELECT 
TO veterinario 
USING (

    -- Verificamos si el ID de la mascota está en la lista de mascotas asignadas al veterinario actual
    id IN (
        SELECT mascota_id
        FROM vet_atiende_mascota
        WHERE vet_id = current_setting('app.current_vet_id', true)::INT
    )
)

--IMPLEMENTAR RLS EN TABLA DE CITAS 
--admin y recepcion ven todas las citas 
CREATE POLICY p_citas_admin_recepcion ON citas 
FOR ALL 
TO admin, recepcion
USING(true);

--veterinarios solo ven sus citas 
CREATE POLICY p_citas_veterinario ON citas
FOR  SELECT 
TO veterinario 
USING (
    veterinario_id = current_setting('app.current_vet_id', true)::INT
)


--IMPLEMENTAR RLS EN TABLA DE VACUNAS APLICADAS
ALTER TABLE vacunas_aplicadas ENABLE ROW LEVEL SECURITY;

--admin ve el historial de todos 
CREATE POLICY p_vacunas_admin ON vacunas-aplicadas 
FOR ALL
TO admin 
USING (true);

-- Veterinario solo ve las vacunas de las mascotas que atiende
CREATE POLICY p_vacunas_veterinarioON vacunas_aplicadas
FOR SELECT 
TO veterinario 
USING(
    mascota_id IN(
        SELECT mascota_id
        FROM vet_atiende_mascota
      WHERE vet_id = current_setting('app.current_vet_id', true)::INT
    )
);