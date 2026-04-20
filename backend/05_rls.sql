-- Habilitar RLS en la tabla de mascotas 
ALTER TABLE mascotas ENABLE ROW LEVEL SECURITY;

-- Politicas para admin y recepcion (Corregido: Solo una vez)
CREATE POLICY p_mascotas_admin_recepcion ON mascotas 
FOR ALL 
TO admin, recepcion 
USING (true); 

-- Politicas para veterinarios (filtro por ID)
CREATE POLICY p_mascotas_veterinario ON mascotas 
FOR SELECT 
TO veterinario 
USING (
    id IN (
        SELECT mascota_id
        FROM vet_atiende_mascota
        WHERE vet_id = current_setting('app.current_vet_id', true)::INT
    )
); 


-- IMPLEMENTAR RLS EN TABLA DE CITAS 
ALTER TABLE citas ENABLE ROW LEVEL SECURITY; -- Corregido: Faltaba prender la seguridad de esta tabla

-- admin y recepcion ven todas las citas 
CREATE POLICY p_citas_admin_recepcion ON citas 
FOR ALL 
TO admin, recepcion
USING(true);

-- veterinarios solo ven sus citas 
CREATE POLICY p_citas_veterinario ON citas
FOR SELECT 
TO veterinario 
USING (
    veterinario_id = current_setting('app.current_vet_id', true)::INT
); 


-- IMPLEMENTAR RLS EN TABLA DE VACUNAS APLICADAS
ALTER TABLE vacunas_aplicadas ENABLE ROW LEVEL SECURITY;

-- admin ve el historial de todos 
CREATE POLICY p_vacunas_admin ON vacunas_aplicadas -- Corregido: Tenia guion medio en lugar de guion bajo
FOR ALL
TO admin 
USING (true);

-- Veterinario solo ve las vacunas de las mascotas que atiende
CREATE POLICY p_vacunas_veterinario ON vacunas_aplicadas
FOR SELECT 
TO veterinario 
USING(
    mascota_id IN(
        SELECT mascota_id
        FROM vet_atiende_mascota
      WHERE vet_id = current_setting('app.current_vet_id', true)::INT
    )
);