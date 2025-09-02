//roleMiddleware → asegura que el usuario tiene permiso para esa acción según su rol.
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.tipo)) {
            return res.status(403).json({ error: "Acceso denegado" });
        }
        next();
    };
};

module.exports = roleMiddleware;