const express = require("express");
const app = express();
const port = 3000;

// ✅ Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Hola desde un contenedor Docker con Node.js!");
});

// ✅ Ruta `/time`
app.get('/time', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const options = { timeZone: 'America/Bogota', hour12: false };
  const currentTime = new Date().toLocaleString('es-ES', options);
  res.send(`IP desde donde se hace la petición: ${ip}\nHora petición: ${currentTime}\n`);
});

// ✅ Ruta `/api` que responde con un JSON
app.get("/api", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

