# Proyecto de Gestión de Horarios para CIFP Majada Marcial

## Descripción del Proyecto
Este proyecto consiste en el diseño e implementación de una aplicación web full stack para la gestión de la elección de horarios del profesorado del CIFP Majada Marcial. Se utilizará el stack Javascript + Laravel con MariaDB como SGBD.

## Funcionalidades
### Inicio de Sesión
- Los usuarios pueden iniciar sesión, mientras que el registro lo realizará el administrador de la plataforma.   :white_check_mark:

### Carga automática de datos en el formulario.  :white_check_mark:

### Restricciones de Horario
- Se prohíbe tener más de 30 horas semanales en un aula.  :white_check_mark:
- Se establecen restricciones específicas como la participación del profesorado tutor, límites de horas semanales, elección de aula/taller, etc. :white_check_mark:

### Automatización de Campos
- El sistema debe autocompletar ciertos campos según la selección del usuario.  :white_check_mark:

### Generación y Validación del Horario
- Se deben generar horarios de acuerdo con las horas semanales de los módulos, limitando 3 horas seguidas.  :white_check_mark:
- Se debe validar que el total de horas sume entre 17 y 20 horas, indicando errores mediante colores. :white_check_mark:

### Informes y Vistas para el Jefe de Departamento y Jefe de Estudios
- El jefe de departamento puede ver los horarios de los docentes de su departamento. :white_check_mark:
- El jefe de estudios puede obtener informes sobre la asignación de horas por aula, ver horarios de docentes, y más. :white_check_mark:

## Modelo de Datos
Se parte de un modelo de datos base y se agregan tablas y relaciones necesarias para cumplir con los requerimientos funcionales.
--
![Descripción de la imagen](ModeloRelacional.png)
--

## Requerimientos Técnicos
### Despliegue
El proyecto debe ser desplegado para su acceso público utilizando una de las siguientes opciones: IaaS, IaaC o PaaS. :white_check_mark:

### Funcionalidades Técnicas
- Uso de seeders y factories. :white_check_mark:
- Agrupamiento de rutas y middleware auth. :white_check_mark:

- Autenticación en API mediante Passport o Sanctum. :white_check_mark:
- Validación de datos con FormRequest. :white_check_mark: 
- Recursos JS y CSS accesibles mediante Vite. :white_check_mark:
- Gestión de autorizaciones por roles. :white_check_mark:
- Uso de Eloquent Resources, códigos HTTP específicos, comentarios, etc. :white_check_mark: 
- Código fuente disponible en BitBucket/GitHub. :white_check_mark: 

## Memoria Técnica 
La memoria técnica debe incluir:
- Portada :white_check_mark:
- Introducción :white_check_mark:
- Diseño e implementación :white_check_mark:
- Problemas encontrados :white_check_mark:
- Trabajo futuro y conclusiones :white_check_mark:
- Documentación de acceso al proyecto y enlaces al repositorio. :white_check_mark:

## Autoevaluación :white_check_mark:
Se debe subir una autoevaluación explicando la nota a la que optas y las razones para ello.

## Notas Finales por Asignatura
- DSW: Implementación, funcionalidades y defensa.
- DPL: Despliegue, memoria y defensa.
- DEW: Desarrollo de vistas y funcionalidades, funcionalidades adicionales, memoria y defensa.

