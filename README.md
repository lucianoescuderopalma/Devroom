# DevRoom

**DevRoom** es una plataforma orientada a desarrolladores que conecta identidad técnica, visibilidad profesional y oportunidades laborales en un solo ecosistema.

La aplicación permite autenticación con GitHub, análisis automático de repositorios y tecnologías utilizadas, generación de perfil público, exportación de currículum en PDF, red social entre desarrolladores y un módulo de empleos con lógica de matching.

## Problema que resuelve

Los desarrolladores suelen tener su información profesional fragmentada entre múltiples plataformas: GitHub para código, LinkedIn para perfil laboral, portafolios para presentación y bolsas de trabajo para postulación. DevRoom busca unificar esas capas en una sola experiencia, usando evidencia técnica real como base del perfil.

## Funcionalidades principales

- Autenticación con GitHub.
- Análisis de repositorios y detección de stack tecnológico.
- Perfil público del desarrollador.
- Exportación de currículum en PDF.
- Red social entre usuarios.
- Publicación y postulación a empleos.
- Matching entre perfil técnico y vacantes.

## Arquitectura general

El proyecto está organizado en dos aplicaciones desacopladas:

- **Frontend**: desarrollado con React y Vite.
- **Backend**: desarrollado con Spring Boot.
- **Base de datos**: PostgreSQL.
- **Contenerización**: Docker y Docker Compose.

```text
Producto/
├── frontend/
├── backend/
└── docker-compose.yml
```

## Frontend

El frontend está construido con React y Vite, y organiza la interfaz en páginas, componentes reutilizables, store de autenticación y cliente HTTP.

### Estructura principal

```text
frontend/src/
├── api/
│   └── axios.js
├── components/
│   ├── ProtectedRoute.jsx
│   └── layout/
│       └── Navbar.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── AuthCallbackPage.jsx
│   ├── Dashboard.jsx
│   ├── ReposPage.jsx
│   ├── PublicProfilePage.jsx
│   ├── CvPage.jsx
│   ├── NetworkPage.jsx
│   └── JobsPage.jsx
├── store/
│   └── authStore.js
└── main.jsx
```

### Responsabilidades destacadas

- `LandingPage.jsx`: página pública de entrada.
- `LoginPage.jsx`: inicio del flujo OAuth con GitHub.
- `AuthCallbackPage.jsx`: recepción del callback de autenticación.
- `Dashboard.jsx`: panel principal del usuario autenticado.
- `ReposPage.jsx`: visualización de repositorios y tecnologías detectadas.
- `PublicProfilePage.jsx`: perfil público del desarrollador.
- `CvPage.jsx`: exportación del CV en PDF.
- `NetworkPage.jsx`: módulo social.
- `JobsPage.jsx`: módulo de empleos y matching.
- `ProtectedRoute.jsx`: protección de rutas privadas.
- `authStore.js`: estado global de autenticación.
- `axios.js`: cliente HTTP configurado para consumir el backend.

## Backend

El backend está construido con Spring Boot y sigue una arquitectura en capas basada en controllers, services, repositories, entities, DTOs y seguridad.

### Estructura principal

```text
backend/src/main/java/com/devroom/backend/
├── config/
├── controller/
├── dto/
├── entity/
├── repository/
├── security/
├── service/
└── BackendApplication.java
```

### Controllers

- `AuthController.java`
- `CvController.java`
- `FeedController.java`
- `FrontendController.java`
- `JobController.java`
- `ProfileStatsController.java`
- `RepositoryController.java`
- `UserController.java`

### Services

- `AuthService.java`
- `CvService.java`
- `FeedService.java`
- `GitHubService.java`
- `JobService.java`
- `ProfileStatsService.java`
- `RepositoryService.java`
- `UserService.java`

### Entities

- `User.java`
- `RepositoryEntity.java`
- `Skill.java`
- `Cv.java`
- `Job.java`
- `JobApplication.java`
- `JobSkillRequirement.java`
- `Follow.java`
- `FeedActivity.java`

### DTOs

- `AuthResponse.java`
- `CreateJobDTO.java`
- `CvDTO.java`
- `CvProjectDTO.java`
- `CvSkillDTO.java`
- `FeedActivityDTO.java`
- `GitHubRepoDTO.java`
- `GitHubUserDTO.java`
- `JobApplicationDTO.java`
- `JobDTO.java`
- `ProfileStatsDTO.java`
- `RepoDTO.java`
- `SkillStatDTO.java`
- `UpdateUserDTO.java`
- `UserProfileDTO.java`

### Seguridad

- `SecurityConfig.java`: configuración de seguridad del backend.
- `CorsConfig`: configuración de acceso entre dominios.
- `JwtAuthFilter.java`: validación de solicitudes autenticadas.
- `JwtUtil.java`: generación y validación de tokens JWT.

## Base de datos

DevRoom utiliza PostgreSQL como sistema de persistencia principal.

El modelo de datos se centra en la entidad `User` y se expande hacia repositorios, tecnologías, empleos, postulaciones, conexiones sociales y currículum.

Relaciones importantes :

- Un usuario puede tener múltiples repositorios.
- Un repositorio puede asociarse a múltiples tecnologías.
- Un usuario puede postular a múltiples empleos.
- Un empleo puede tener múltiples requisitos técnicos.
- Un usuario puede seguir a otros usuarios.

## Tecnologías utilizadas

### Frontend

Dependencias identificadas en `package.json`:

```json
{'name': 'devroom-frontend', 'private': True, 'version': '0.0.0', 'type': 'module', 'scripts': {'dev': 'vite', 'build': 'vite build', 'lint': 'eslint .', 'preview': 'vite preview', 'test': 'vitest run', 'test:watch': 'vitest', 'test:ui': 'vitest --ui'}, 'dependencies': {'axios': '^1.16.1', 'react': '^19.2.5', 'react-dom': '^19.2.5', 'react-router-dom': '^7.15.1', 'zustand': '^5.0.13'}, 'devDependencies': {'@eslint/js': '^9.39.4', '@testing-library/jest-dom': '^6.9.1', '@testing-library/react': '^16.3.2', '@testing-library/user-event': '^14.6.1', '@types/react': '^19.2.14', '@types/react-dom': '^19.2.3', '@vitejs/plugin-react': '^6.0.2', 'eslint': '^9.39.4', 'eslint-plugin-react-hooks': '^7.1.1', 'eslint-plugin-react-refresh': '^0.5.2', 'globals': '^17.5.0', 'jsdom': '^29.1.1', 'vite': '^8.0.9', 'vitest': '^4.1.8'}}
```

### Backend

Tecnologías principales observables en `pom.xml`:

- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL Driver
- JWT
- Maven

## Despliegue

Entorno previsto y/o utilizado en el proyecto:

- **Frontend**: Vercel.
- **Backend**: Render.
- **Base de datos**: PostgreSQL.

## Ejecución local

### Requisitos

- Node.js
- npm
- Java 17 o superior
- Maven
- PostgreSQL
- Docker y Docker Compose (opcional pero recomendado)

### Opción 1: con Docker Compose

Desde la carpeta `Producto/`:

```bash
docker-compose up --build
```

### Opción 2: ejecución manual

#### Frontend

```bash
cd Producto/frontend
npm install
npm run dev
```

#### Backend

```bash
cd Producto/backend
./mvnw spring-boot:run
```

> Antes de ejecutar el backend, asegúrate de configurar correctamente la base de datos y las variables necesarias en `application.properties` o variables de entorno.

## Pruebas

### Frontend

Se identifican pruebas en:

```text
src/__tests__/
├── AuthStore.test.js
├── Dashboard.test.jsx
├── Helpers.test.js
├── LandingPage.test.jsx
├── Navbar.test.jsx
├── mocks.js
└── setup.js
```

### Backend

Se identifican pruebas en:

```text
src/test/java/com/devroom/backend/
├── BackendApplicationTests.java
├── security/
└── service/
```

## Mejoras aplicadas durante el desarrollo

- Corrección del despliegue del backend en Render.
- Ajustes para autenticación GitHub multiusuario.
- Depuración del filtro JWT para diagnóstico de errores de sesión.
- Migración y configuración de base de datos PostgreSQL.
- Corrección de CORS para comunicación entre frontend y backend desplegados en dominios distintos.

## Mejoras futuras

- Mejorar el diseño visual del CV exportado.
- Hacer más preciso el motor de matching laboral.
- Incorporar métricas más profundas del perfil técnico.
- Aumentar la cobertura de pruebas automatizadas.
- Fortalecer el manejo de errores y el consumo de la API de GitHub.

## Valor del proyecto

DevRoom no se plantea como un simple portal de empleos ni como una red social genérica. Su propuesta de valor está en convertir actividad técnica real en una identidad profesional utilizable, visible y comparable frente a oportunidades laborales.

## Autores
Luciano Andres Escudero Palma
Mauricio Gabriel Moreno Molina
Cristian Ignacio Rivera Áñez
