


-- roles 
CREATE ROLE admin;
CREATE ROLE recepcion;
CREATE ROLE veterinario;

-- ASIGNACION DE PERMISOS   
--permisos de recepcionista 
GRANT SELECT ON mascotas, duenos, citas TO recepcion;
GRANT INSERT, UPDATE ON citas TO recepcion;
REVOKE ALL ON vacunas_aplicadas FROM recepcion;

--permisos de veterinarios 
GRANT SELECT ON mascotas, duenos, vet_atiende_mascota TO veterinario;
GRANT SELECT, INSERT ON citas, vacunas_aplicadas TO veterinario;

--permisos de admin 
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin  

