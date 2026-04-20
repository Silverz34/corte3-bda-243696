# Sistema Full-stack Clinica Veterinaria 

**Auto:** Mishell Prado Gordillo - 2436956
**Materia:** Base de Datos Avanzadas - Universidad Politécnica de Chiapas 

## Descripción del Proyecto
Este proyecto es un sistema de gestión clínica veterinaria multi-usuario centrado en la **seguridad profunda de base de datos** Implementando el uso de roles y permisos, de acuerdo al principio del minimo privilegio. 


**Stack Tecnológico:**
* **Base de Datos:** PostgreSQL 16 (Hardening, Roles, RLS, Procedures)
* **Backend/API:** Node.js + Express + TypeScript + Zod (Validación de esquemas).
* **Caché:** Redis (Minimización de carga en BD)
* **Frontend:** Next.js + Taiwild + Typescript  

## Documento de Decisiones de Diseño 




## Preguntas planteadasen el sistema 

### 1. ¿Qué política RLS aplicaste a la tabla mascotas? Pega la cláusula exacta y explica con tus palabras qué hace.
```sql
CREATE POLICY p_mascotas_veterinario ON mascotas FOR SELECT TO veterinario
USING (id IN (SELECT mascota_id FROM vet_atiende_mascota WHERE vet_id = current_setting('app.current_vet_id', true)::INT));
```

Esta politica restringe la vista del veterinario para que solo pueda consuktar las filas de mascotas cuyo ID existe en la tablapuente **vet_ateinde_mascota** comparandol dinamicamente con la variable de sesion temporal (app.current_vet_id) que la API inyecta al momento de conectarse.

### 2. Cualquiera que sea la estrategia que elegiste para identificar al veterinario actual en RLS, tiene un vector de ataque posible. ¿Cuál es? ¿Tu sistema lo previene? ¿Cómo?

El vector de ataque es la falsificación de identidad (Spoofing), donde un usuario malicioso intenta enviar un ID distinto en la petición HTTP para engañar al current_setting.
El sistema lo previene centralizando la conexión en la API: el usuario de BD (api_backend) abre una transacción aislada, un Middleware valida los permisos y la estructura de la petición, e inyecta la variable de forma temporal local (true). Al hacer COMMIT, la variable se destruye, impidiendo fugas entre sesiones.


### 3. Si usas SECURITY DEFINER en algún procedure, ¿qué medida específica tomaste para prevenir la escalada de privilegios que ese modo habilita? Si no lo usas, justifica por qué no era necesario.
**No utilicé SECURITY DEFINER** en los procedures. No fue necesario porque la arquitectura aplicada usa el principio de mínimo privilegio a través de SET ROLE dinámico desde la API Node.js. Si hubiera usado SECURITY DEFINER, el procedure se ejecutaría con los privilegios del creador (owner), haciendo un **"bypass"** (ignorando) nuestras estrictas políticas RLS y los permisos del rol actual.


### 4. ¿Qué TTL le pusiste al caché Redis y por qué ese valor específico? ¿Qué pasaría si fuera demasiado bajo? ¿Demasiado alto?
aun no se si dejarla en 5 min o mejor 1 hr 



### 5. Tu frontend manda input del usuario al backend. Elige un endpoint crítico y pega la línea exacta donde el backend maneja ese input antes de enviarlo a la base de datos. Explica qué protege esa línea y de qué. Indica archivo y número de línea.




### 6. Si revocas todos los permisos del rol de veterinario excepto SELECT en mascotas, ¿qué deja de funcionar en tu sistema? Lista tres operaciones que se romperían.
Se romperian todas las reglas de negocio, dejarian de funcionar en su mayoria. 

* La visualización de mascotas (RLS fallaría): El veterinario perdería el acceso a la tabla vet_atiende_mascota, por lo que la subconsulta de la política RLS fallaría y no vería ningún animal.

* Agendar citas: Perdería el privilegio INSERT en la tabla citas, rompiendo el procedure sp_agendar_cita.

* Aplicar vacunas: Perdería el privilegio INSERT en vacunas_aplicadas, impidiendo registrar tratamientos.