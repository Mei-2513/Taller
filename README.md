Proyecto: Implementación de Traefik con Ruteadores, Servicios y Middlewares

Integrantes del Grupo:
-Silvia Juliana Rodriguez Rodriguez 
-Dianey Marcela Macias Vargas

Preguntas:
1. ¿Cómo detecta Traefik los servicios configurados en Docker Compose?
Traefik detecta los servicios configurados en Docker Compose a través de las etiquetas (labels) que se definen en cada servicio dentro del archivo docker-compose.yml. Al tener el proveedor docker habilitado en la configuración de Traefik, este escanea los contenedores en busca de etiquetas que lo configuran como routers, middlewares, o servicios, y automáticamente los expone a través de los puntos de entrada configurados.

2. ¿Qué rol juegan los middlewares en la seguridad y gestión del tráfico?
Los middlewares permiten modificar o filtrar el tráfico antes de que llegue al servicio de destino. En este caso, tenemos un middleware de autenticación básica que protege el acceso a la API. Otros ejemplos de middlewares incluyen redirecciones de HTTP a HTTPS, control de acceso basado en IP, entre otros.

3. ¿Cómo se define un router en Traefik y qué parámetros son esenciales?
Un router en Traefik se define utilizando las etiquetas (labels) de Docker Compose. Los parámetros esenciales incluyen:

-traefik.http.routers.<nombre_del_router>.rule: Define la regla de enrutamiento, como la URL o el host al que debe responder el router (por ejemplo, Host('api.localhost')).
-traefik.http.services.<nombre_del_servicio>.loadbalancer.server.port: Especifica el puerto en el que el servicio está escuchando.

4. ¿Cuál es la diferencia entre un router y un servicio en Traefik?
Un router es responsable de recibir y dirigir el tráfico hacia el servicio correspondiente, según las reglas configuradas (por ejemplo, basadas en el host). Un servicio, por otro lado, es el destino final donde se encuentra la aplicación que procesa la solicitud. Los servicios pueden estar balanceados o distribuidos entre múltiples instancias.

5. ¿Cómo se pueden agregar más reglas de enrutamiento para diferentes rutas?
Se pueden agregar más reglas de enrutamiento en los routers de Traefik. Por ejemplo, se puede configurar un router para que responda a una URL diferente o para que haga un redireccionamiento, añadiendo más etiquetas de traefik.http.routers.<nombre_del_router>.rule. Además, Traefik permite múltiples reglas como host y rutas de URL combinadas, lo que permite enrutamientos muy específicos.

Descripción del Flujo de Tráfico

1.Solicitud del Usuario: El usuario realiza una solicitud en el navegador a http://api.localhost.

2.Traefik: Recibe la solicitud a través del puerto 80. Traefik utiliza el router configurado con la regla Host('api.localhost').

3.Redirección a Servicio: Traefik redirige la solicitud al servicio correspondiente, en este caso, el servicio de API.

4.Middleware: Antes de llegar al servicio, Traefik aplica el middleware de autenticación básica para verificar las credenciales del usuario.

5.Respuesta: El servicio procesa la solicitud y devuelve la respuesta a Traefik, quien la reenvía al usuario.

