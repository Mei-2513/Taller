
# Implementación de Traefik con Ruteadores, Servicios y Middlewares

Este proyecto tiene como objetivo demostrar la implementación de **Traefik** en un entorno Dockerizado, configurando ruteadores, servicios y middlewares para manejar el tráfico entre diferentes servicios.

## Descripción del Proyecto

Este taller permite practicar la configuración de **Traefik** con Docker Compose, creando un entorno de múltiples servicios, incluyendo una API y un servidor estático de Nginx, con la inclusión de middlewares para autenticación básica.

## Flujo de Tráfico

### 1. Solicitud del Usuario  
El proceso comienza cuando el usuario realiza una solicitud en su navegador hacia `http://api.localhost`.

### 2. Traefik Recibe la Solicitud  
La solicitud llega a Traefik a través del puerto 80, donde Traefik está configurado para escuchar. En este punto, Traefik evalúa la solicitud utilizando el *router* configurado con la regla `Host('api.localhost')`.

### 3. Redirección al Servicio  
Después de evaluar la solicitud, Traefik redirige el tráfico al servicio correspondiente. En este caso, el tráfico se dirige hacia el servicio de **API**.

### 4. Aplicación de Middleware  
Antes de llegar al servicio de la API, Traefik aplica alguno de los middleware configurados. Esto permite que se verifiquen las credenciales del usuario, asegurando que solo los usuarios autorizados puedan acceder al servicio.

### 5. Respuesta del Servicio  
Una vez que el servicio de la API procesa la solicitud, devuelve una respuesta a Traefik. Finalmente, Traefik reenvía esta respuesta al navegador del usuario, completando el ciclo de la solicitud.

---

## Archivos Incluidos

### `docker-compose.yml`

Este archivo define la configuración de los servicios y cómo Traefik debe interactuar con ellos. Incluye configuraciones de ruteadores y middlewares para gestionar el tráfico.

### `traefik.yml`

El archivo de configuración de Traefik que define los puntos de entrada, los proveedores y la habilitación del dashboard.

---

## Preguntas de Evaluación

### 1. ¿Cómo detecta Traefik los servicios configurados en Docker Compose?
Traefik detecta automáticamente los servicios definidos en el archivo `docker-compose.yml` gracias al proveedor `docker`. Traefik se conecta al socket de Docker, lo que le permite descubrir los contenedores en ejecución y aplicar las reglas de ruteo definidas en las etiquetas (labels) de los servicios.

### 2. ¿Qué rol juegan los middlewares en la seguridad y gestión del tráfico?
Los *middlewares* en Traefik son componentes que permiten modificar las solicitudes y respuestas antes de llegar al servicio o después de procesarse. En este proyecto, se implementó un middleware de **autenticación básica** para proteger el acceso a la API, lo que asegura que solo los usuarios con las credenciales adecuadas puedan interactuar con el servicio.

### 3. ¿Cómo se define un router en Traefik y qué parámetros son esenciales?
Un *router* en Traefik se define utilizando etiquetas (labels) en el archivo `docker-compose.yml`. Los parámetros esenciales son:
- `traefik.http.routers.<router-name>.rule`: Define las reglas de enrutamiento (por ejemplo, `Host('api.localhost')`).
- `traefik.http.services.<service-name>.loadbalancer.server.port`: Define el puerto del servicio al que debe redirigir el tráfico.

### 4. ¿Cuál es la diferencia entre un router y un servicio en Traefik?
Un *router* es responsable de dirigir el tráfico hacia un servicio específico según las reglas de enrutamiento definidas. Un *servicio*, por otro lado, es la aplicación o el contenedor que procesará la solicitud del usuario.

### 5. ¿Cómo se pueden agregar más reglas de enrutamiento para diferentes rutas?
Para agregar más reglas de enrutamiento, simplemente se añaden nuevas etiquetas (labels) en los servicios definidos en `docker-compose.yml`. Por ejemplo, se puede crear un nuevo router para manejar el tráfico en `/admin`, añadiendo una regla específica para esa ruta.

---

## Integrantes del Equipo

-Silvia Juliana Rodriguez Rodriguez 
-Dianey Marcela Macias Vargas

