
# HR Flow: Portal de Gestión de Ausencias

## Integrantes: Bryan Arias Rios - Farly Andres Rivera David
- Correos institucionales: barias@unilasallista.edu.co - frivera@unilasallista.edu.co
- Empresa para la cual se desarrolla el proyecto: Comfachochó Quibdó


HR Flow es una aplicación web moderna y reactiva, desarrollada con Angular, diseñada para simplificar y automatizar la gestión de vacaciones, permisos y licencias en una empresa. Esta solución innovadora permite a los empleados gestionar sus ausencias de manera transparente, mientras que ofrece a los supervisores las herramientas necesarias para aprobar solicitudes y visualizar la disponibilidad del equipo en tiempo real.

## ✨ Características Principales

- **Panel de Control Intuitivo:** Una interfaz limpia y moderna que centraliza toda la información relevante.
- **Gestión Basada en Roles:** Vistas y permisos diferenciados para **Empleados** y **Supervisores**.
  - **Empleados:** Pueden solicitar ausencias, ver su saldo de días disponibles y consultar su historial personal.
  - **Supervisores:** Pueden revisar las solicitudes de todo su equipo, aprobarlas o rechazarlas con un solo clic, y tener una visión global de las ausencias.
- **Saldo de Ausencias en Tiempo Real:** Los balances de días de vacaciones, enfermedad y asuntos personales se actualizan automáticamente tras cada aprobación.
- **Calendario de Equipo Compartido:** Un calendario visual que muestra todas las ausencias aprobadas del equipo, facilitando la planificación y evitando conflictos de agenda.
- **Flujo de Aprobación Eficiente:** Los supervisores pueden ver los detalles de cada solicitud y tomar decisiones informadas al instante.
- **Registro de Actividad y Notificaciones:** Un feed en tiempo real informa a los usuarios sobre acciones importantes, como la creación o actualización de una solicitud.
- **Integración con Google Calendar:** Permite a los usuarios conectar su cuenta de Google y sincronizar sus ausencias aprobadas directamente en su calendario personal.

## 🚀 Stack Tecnológico

- **Framework:** [Angular](https://angular.dev/) v20+
  - **Componentes Standalone:** Para una arquitectura modular y sin `NgModules`.
  - **Señales (Signals):** Para una gestión de estado reactiva, granular y de alto rendimiento.
  - **Detección de Cambios Zoneless:** Para optimizar el rendimiento de la aplicación.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño rápido y responsivo.
- **Formularios:** Formularios Reactivos de Angular para una gestión robusta de las entradas del usuario.
- **APIs Externas:** Integración con la **API de Google Calendar** para la sincronización de eventos.

## 🏛️ Arquitectura

La aplicación sigue una arquitectura moderna basada en componentes y orientada a servicios, lo que garantiza la separación de responsabilidades y la escalabilidad.

- **`src/components`**: Contiene todos los componentes de la interfaz de usuario. Cada componente es autónomo y se encarga de una parte específica de la vista (ej. `request-history`, `team-calendar`).
- **`src/services`**: Centraliza la lógica de negocio y la gestión del estado.
  - `leave.service.ts`: Actúa como el "cerebro" de la aplicación, manejando los datos de empleados, solicitudes y balances. Utiliza señales para que la UI reaccione automáticamente a los cambios.
  - `notification.service.ts`: Gestiona un registro de notificaciones para el feed de actividad.
  - `google-calendar.service.ts`: Encapsula toda la lógica para la autenticación y comunicación con la API de Google Calendar.
- **`src/models`**: Define las estructuras de datos y tipos (`LeaveRequest`, `Employee`, etc.) utilizando interfaces de TypeScript para garantizar la consistencia en toda la aplicación.
- **`src/pipes`**: Incluye pipes personalizados para la transformación de datos en las plantillas.

## 🏁 Cómo Funciona

La aplicación se inicia desde el archivo `index.tsx`, que arranca el componente raíz `AppComponent`. Este componente principal organiza el diseño y la interacción entre los diferentes componentes.

El estado de la aplicación es gestionado de forma centralizada por los servicios inyectables. Cuando un usuario realiza una acción (por ejemplo, un supervisor aprueba una solicitud), el servicio correspondiente actualiza su estado (una señal). Gracias a la reactividad de las señales, todos los componentes que dependen de ese estado se actualizan automáticamente, sin necesidad de gestión manual.
