
Configuración y Flujo de Tráfico en el Proyecto con Traefik

1. Introducción

Este proyecto implementa un proxy inverso con Traefik para gestionar el ruteo del tráfico hacia distintos servicios dentro de un entorno Docker. Los servicios principales incluyen:

Traefik (proxy inverso y gestor de ruteo)

API (Node.js) (servicio de backend con varias rutas protegidas)

Nginx (servidor web para contenido estático)

Error Page (servidor de páginas de error personalizado)

La configuración está diseñada para proporcionar seguridad, control de acceso y balanceo de carga. Además, se han implementado estrategias para manejar fallos de servicios y mejorar la disponibilidad del sistema.

2. Flujo de Tráfico

Peticiones HTTP/HTTPS

Un cliente realiza una solicitud a api.localhost, nginx.localhost o error.localhost.

Traefik recibe la solicitud y la procesa según las reglas de ruteo definidas.

Si la solicitud coincide con una regla de ruteo, Traefik reenvía la petición al servicio correspondiente.

Dependiendo de la ruta accedida, se aplican diferentes middlewares antes de reenviar la petición al servicio final.

Si un servicio no está disponible, Traefik puede redirigir la solicitud a la página de error personalizada.

Balanceo de Carga

Para el servicio API, se han configurado tres réplicas, lo que permite distribuir la carga entre ellas mediante Traefik.

Si una instancia de la API falla, las solicitudes se redirigen automáticamente a las instancias restantes.

Manejo de Fallos

Si la API o Nginx dejan de estar disponibles, los clientes reciben una respuesta clara en lugar de un error genérico.


3. Middlewares Implementados

Autenticación Básica (auth)

Protege los servicios con Basic Auth, requiriendo credenciales para acceder.

Utiliza un archivo .htpasswd para almacenar las credenciales de usuario.

Si la autenticación es correcta, el usuario accede al servicio correspondiente.

Si la autenticación falla, el usuario no puede salir de la ventana de autenticación hasta que ingrese credenciales válidas.

Límite de Ráfaga (rate-limit)

Restringe el número de peticiones permitidas por segundo.

Configurado para permitir 1 solicitud por segundo y permitir picos de hasta 2 solicitudes.

Si se supera el límite, se devuelve el error 429 Too Many Requests.

Lista Blanca de IPs (whitelist-admin)

Restringe el acceso a la ruta /admin del servicio API.

Solo permite solicitudes desde IPs autorizadas especificadas en la configuración.

Si la IP no está permitida, devuelve un error 403 Forbidden.

Gestor de Errores 

Si un servicio está caído, devuelve automáticamente la página de error en lugar de un fallo sin formato.

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

