//authMiddleware → asegura que el usuario está autenticado (tiene sesión/token válido).

//Importa la librería jsonwebtoken, que se usa para trabajar con tokens JWT (crear/verificar).
const jwt = require("jsonwebtoken");

//Define una función middleware que recibe:
//res: la petición del cliente.
//res: la respuesta del servidor.
//next: función que pasa el control al siguiente middleware o al controlador final
const authMiddleware = (req, res, next) => {
    //Busca el token JWT en el encabezado Authorization.
    const token = req.headers["authorization"]?.split(" ")[1];
    //split(" ")[1] → separa "Bearer" y se queda solo con el <token>.
    //El ?. (optional chaining) evita error si no existe el header
    if (!token) return res.status(403).json({ error: "Token requerido" });

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto123");
        //Intenta verificar el token con la clave secreta (JWT_SECRET del .env o "secreto123" si no existe)
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Token invalido o expirado" });
    }
};

module.exports = authMiddleware;