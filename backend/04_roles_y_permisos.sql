
-- CREACIÓN DE ROLES BASE
CREATE ROLE admin;
CREATE ROLE recepcion;
CREATE ROLE veterinario;

-- ==========================================================
--  PERMISOS: RECEPCIÓN
-- Rúbrica: Ve a todas las mascotas/dueños. Agenda citas. 
--          NO ve historial médico.
-- ==========================================================
GRANT SELECT ON mascotas, duenos, citas TO recepcion;
GRANT INSERT, UPDATE ON citas TO recepcion;

-- Asegurar que NO vea vacunas aplicadas (Información médica)
REVOKE ALL ON vacunas_aplicadas FROM recepcion;

-- Permisos extra para que el frontend y el Stored Procedure funcionen
GRANT SELECT ON veterinarios, inventario_vacunas TO recepcion;
GRANT UPDATE ON veterinarios TO recepcion; -- Para el bloqueo FOR UPDATE
GRANT USAGE, SELECT ON SEQUENCE citas_id_seq TO recepcion;

-- ==========================================================
-- PERMISOS: VETERINARIO
-- Rúbrica: Registra citas y aplica vacunas. 
--          (El filtro de "solo sus mascotas" se hace en RLS)
-- ==========================================================
GRANT SELECT ON mascotas, duenos, vet_atiende_mascota TO veterinario;
GRANT SELECT, INSERT ON citas, vacunas_aplicadas TO veterinario;

-- Permisos extra para que el frontend y el Stored Procedure funcionen
GRANT SELECT ON veterinarios, inventario_vacunas TO veterinario;
GRANT UPDATE ON veterinarios TO veterinario; -- Para el bloqueo FOR UPDATE
GRANT USAGE, SELECT ON SEQUENCE citas_id_seq, vacunas_aplicadas_id_seq TO veterinario;

-- ADMINISTRADOR
-- Rúbrica: Ve todo y gestiona todo.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
-- CORRECCIÓN VITAL: Se requiere dar privilegios sobre las secuencias para que pueda hacer INSERTs (Ej. crear un nuevo veterinario o mascota)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- ==========================================================
-- USUARIO PARA CONEXIÓN EXCLUSIVO DE LA API 
-- ==========================================================
CREATE ROLE api_backend WITH LOGIN PASSWORD 'Kalaha0918'; 
GRANT CONNECT ON DATABASE clinica_vet TO api_backend;
GRANT USAGE ON SCHEMA public TO api_backend;
GRANT veterinario, recepcion, admin TO api_backend;