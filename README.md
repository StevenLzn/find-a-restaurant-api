# Prueba técnica tyba

Este proyecto se desarrolla para completar la prueba técnica de **tyba**. El lenguaje usado fue **Node.js** con el framework **NestJS** y se utilizó **PostgreSQL** mediante el ORM **TypeORM**.

## Requisitos

- Node.js
- npm
- Archivo `.env` con las variables de entorno copiadas de `.env.template`

## Decisiones técnicas

- Se usó **TypeORM** ya que brinda una implementación completa para PostgreSQL y tiene excelente practicidad de uso con diferentes bases de datos.
- La arquitectura está modularizada, presentando una navegación sencilla donde cada funcionalidad tiene su respectivo módulo; cada módulo cuenta con sus DTO, entities, services, controllers, etc.
- Se agregaron validaciones para las variables de entorno para asegurar que todas las necesarias sean provistas.
- La documentación del REST API fue realizada con **Swagger**, herramienta estándar en la industria que facilita la documentación de endpoints con su path, descripción, inputs y outputs. La documentación se encuentra en: `http://localhost:3000/api`
- La seguridad se implementó mediante **JWT**, verificando la validez del token en los endpoints que requieren autenticación.
- Se agregó un pipe global para las validaciones de los DTO, facilitando la conversión y validación de tipos de datos en los parámetros y cuerpos de las solicitudes.
- Se añadió un throttler global para limitar a 10 peticiones por minuto por usuario, ayudando a bloquear ataques de fuerza bruta contra el REST API.
- Se usó el patrón **strategy** para el manejo de búsqueda de restaurantes, permitiendo búsquedas por ciudad o coordenadas, cada una con lógica de consulta diferente. Este patrón permite flexibilidad para crear o modificar estrategias de consulta sin afectar otras.
- El proveedor elegido para la consulta de restaurantes fue **Google**, utilizando Google Places para consultar restaurantes y Google Geocoding para obtener coordenadas de la ciudad.
- La auditoría de acciones de los usuarios se implementó mediante un **builder**, construyendo el objeto de auditoría a medida que ocurren acciones dentro del código y persistiendo en la base de datos una vez completo.
- Se creó un script para crear la base de datos si no existe, y el ORM crea las tablas si estas no existen.

## Comando para levantar la aplicación

```bash
npm i
npm run start:dev
```

## Comando para ejecutar las pruebas

```bash
npm run test
```

## Consideraciones

- Aunque los archivos de Docker fueron creados, no se alcanzó a probar debido a problemas en la instalación de Docker Desktop  en el equipo donde se desarrolló la prueba.
- La **API key** de Google es provista en el correo de respuesta.