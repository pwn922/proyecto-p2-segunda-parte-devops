import app from "./server.js";
import { inicializarBaseDeDatos } from "./db-init.js";

const PORT = process.env.PORT || 3000;

await inicializarBaseDeDatos();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
