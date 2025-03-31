# 📌 Configuración y Flujo de Tráfico en el Proyecto con Traefik

## 📖 Introducción
Este proyecto implementa un **proxy inverso con Traefik** para gestionar el ruteo del tráfico hacia distintos servicios dentro de un entorno Docker. Los servicios principales incluyen:

- **Traefik** (proxy inverso y gestor de ruteo)
- **API (Node.js)** (servicio de backend con varias rutas protegidas)
- **Nginx** (servidor web para contenido estático)
- **Error Page** (servidor de páginas de error personalizado)

La configuración está diseñada para proporcionar **seguridad, control de acceso y balanceo de carga**. Además, se han implementado estrategias para manejar fallos de servicios y mejorar la disponibilidad del sistema.

---

## 🔄 Flujo de Tráfico
### 📡 Peticiones HTTP/HTTPS
1. Un usuario realiza una solicitud a `api.localhost`, `nginx.localhost` o `error.localhost`.
2. **Traefik** recibe la solicitud y la procesa según las reglas de ruteo definidas.
3. Si la solicitud coincide con una regla de ruteo, **Traefik reenvía la petición al servicio correspondiente**.
4. Dependiendo de la ruta accedida, se aplican diferentes **middlewares** antes de reenviar la petición al servicio final.
5. Si un servicio no está disponible, **Traefik redirige la solicitud a la página de error personalizada**.

### ⚖️ Balanceo de Carga
- Para el servicio **API**, se han configurado **tres réplicas**, lo que permite distribuir la carga entre ellas mediante **Traefik**.
- Si una instancia de la API falla, **las solicitudes se redirigen automáticamente a las instancias restantes**.

### 🛠️ Manejo de Fallos
- Si la **API** o **Nginx** dejan de estar disponibles, los clientes reciben una **respuesta clara en lugar de un error genérico**.

---

## ⚙️ Middlewares Implementados
### 🔑 Autenticación Básica (`auth`)
- Protege los servicios con **Basic Auth**, requiriendo credenciales para acceder- usuario:usuario y pasword:12345678.
- Utiliza un archivo **`.htpasswd`** para almacenar las credenciales de usuario.
- **Si la autenticación es correcta**, el usuario accede al servicio correspondiente.
- **Si la autenticación falla**, el usuario **no puede salir de la ventana de autenticación** hasta que ingrese credenciales válidas.

### ⏳ Límite de Ráfaga (`rate-limit`)
- Restringe el número de peticiones permitidas por segundo.
- Configurado para **permitir 1 solicitud por segundo** y permitir picos de hasta **2 solicitudes**.
- Si se supera el límite, **se devuelve el error `429 Too Many Requests`**.

### 🛡️ Lista Blanca de IPs (`whitelist-admin`)
- Restringe el acceso a la ruta **`/admin`** del servicio API.
- Solo permite solicitudes desde **IPs autorizadas** especificadas en la configuración.
- Si la IP no está permitida, **devuelve un error `403 Forbidden`**.

### 🚨 Gestor de Errores (`error-handler`)
- Si un servicio está caído, **devuelve automáticamente la página de error personalizada**.

---

## 📂 Archivos Incluidos

### 📄 `docker-compose.yml`
Este archivo gestiona los servicios dentro del entorno Docker y asegura la interacción con *Traefik*.

#### 🔹 **Servicios Principales:**
- **Traefik:** Proxy inverso que gestiona el tráfico y aplica reglas de enrutamiento.
- **API (Node.js):** Servicio backend con rutas protegidas y autenticación.
- **Nginx:** Servidor web para contenido estático.
- **Página de Error:** Servicio que despliega páginas de error personalizadas.

#### 🔹 **Configuraciones Clave:**
- **Montaje del socket de Docker:** Permite que *Traefik* detecte y administre dinámicamente los servicios en contenedores.
  ```yaml
  volumes:
    - "/var/run/docker.sock:/var/run/docker.sock:ro"
- **Definición de Ruteo:** Se usan etiquetas (`labels`) en cada servicio para que *Traefik* pueda descubrir y gestionar el tráfico correctamente.
  ```yaml
  labels:
    - "traefik.http.routers.api.rule=Host(`api.localhost`)"
    - "traefik.http.services.api.loadbalancer.server.port=3000"

- **Middlewares:**
  - `auth@file`: Autenticación básica para servicios protegidos.
  - `rate-limit@file`: Control de tasa de solicitudes para evitar sobrecargas.
  - `whitelist-admin@file`: Restringe el acceso a la ruta `/admin` solo a IPs autorizadas.
  - `error-handler@file`: Manejo de errores, redirigiendo tráfico a la página personalizada.

- **Balanceo de Carga:** Se configuran tres réplicas para la API, lo que asegura la distribución de tráfico y tolerancia a fallos.

- **Manejo de Fallos:** Si la API o Nginx fallan, el tráfico es redirigido automáticamente a la página de error personalizada, sin interrumpir la experiencia del usuario.

### ⚙ `traefik.yml`
Este archivo configura los puntos de entrada, proveedores y otras opciones relacionadas con *Traefik*.

#### 🔹 **Configuraciones Principales:**
- **Puntos de Entrada:**
  - `web`: Puerto 80 (HTTP)
  - `websecure`: Puerto 443 (HTTPS)

- **Proveedores:**
  - `docker`: Permite que *Traefik* descubra y gestione servicios automáticamente sin configuración manual.
  - `file`: Habilita la carga de configuraciones adicionales (como middlewares y reglas de ruteo).

- **Dashboard:**
  - Habilitado en el puerto 8080, accesible para visualizar y monitorear la configuración de *Traefik*.

- **Observación de Archivos:**
  - *Traefik* detecta cambios en los archivos de configuración y los aplica sin necesidad de reiniciar.

- **Middlewares Específicos:**
  - Se configuran globalmente en `traefik.yml` y se referencian en `docker-compose.yml` para aplicar restricciones de acceso y seguridad.


---

## ❓ Preguntas de Evaluación
### 1️⃣ ¿Cómo detecta Traefik los servicios configurados en Docker Compose?
Traefik detecta automáticamente los servicios definidos en el archivo `docker-compose.yml` gracias al **proveedor Docker**. Se conecta al **socket de Docker**, lo que le permite descubrir los contenedores en ejecución y aplicar las reglas de ruteo definidas en las etiquetas (**labels**) de los servicios.

### 2️⃣ ¿Qué rol juegan los middlewares en la seguridad y gestión del tráfico?
Los **middlewares** en Traefik son componentes que **permiten modificar las solicitudes y respuestas** antes de llegar al servicio o después de procesarse. En este proyecto, se implementó un **middleware de autenticación básica** para proteger el acceso a la API, lo que asegura que **solo los usuarios con las credenciales adecuadas puedan interactuar con el servicio**.

### 3️⃣ ¿Cómo se define un router en Traefik y qué parámetros son esenciales?
Un **router** en Traefik se define utilizando **etiquetas (`labels`)** en el archivo `docker-compose.yml`. Los parámetros esenciales son:
- `traefik.http.routers.<router-name>.rule`: **Define las reglas de enrutamiento** (por ejemplo, `Host("api.localhost")`).
- `traefik.http.services.<service-name>.loadbalancer.server.port`: **Define el puerto del servicio** al que debe redirigir el tráfico.
- `traefik.http.routers.<router-name>.middlewares`: Define middlewares aplicables, como autenticación o límite de tráfico.

### 4️⃣ ¿Cuál es la diferencia entre un router y un servicio en Traefik?
- Un **router** es responsable de **dirigir el tráfico** hacia un servicio específico según las reglas de enrutamiento definidas.
- Un **servicio** es la aplicación o el contenedor que **procesará la solicitud del usuario**.

### 5️⃣ ¿Cómo se pueden agregar más reglas de enrutamiento para diferentes rutas?
Para agregar más reglas de enrutamiento, se **añaden nuevas etiquetas (`labels`)** en los servicios definidos en `docker-compose.yml`. 
Ejemplo: Para crear un nuevo router para manejar el tráfico en `/admin`, se añade una regla específica para esa ruta.

---

## 👥 Integrantes del Equipo
- **Silvia Juliana Rodríguez Rodríguez**
- **Dianey Marcela Macías Vargas**
