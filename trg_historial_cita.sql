--funcion para registrar en el historial de citas cada vez que se agende una nueva cita

CREATE OR REPLACE FUNCTION fn_log_cita()
RETURNS TRIGGER AS $$
DECLARE
v_nombre_mascota VARCHAR(100);
v_nombre_vet VARCHAR(100);
v_descripcion TEXT;
BEGIN 
    --Usar el registro NEW, que contiene los datos de la cita
    SELECT nombre INTO v_nombre_mascota FROM mascota WHERE id = NEW.mascota_id;
    SELECT nombre INTO v_nombre_vet FROM veterinario WHERE id = NEW.veterinario_id;
 
   --esquema de descripcion cita  
  v_descripcion := format('Cita para %scon %s el %s',
                          v_nombre_mascota,
                          v_nombre_vet,
                          to_char(NEW.fecha_hora, 'DD/MM/YYYY'));

--Insertamos en la tabla de historial
INSERT INTO historial_movimientos (tipo, referencia_id, descripcion, fecha)
VALUES ('CITA_AGENDADA', NEW.id, v_descripcion, NOW());

RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER tr_insertar_cita
AFTER INSERT ON citas 
FOR EACH ROW 
EXECUTE FUNCTION fn_log_cita();
