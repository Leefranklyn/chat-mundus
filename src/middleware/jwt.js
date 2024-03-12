import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(400).json({
            message: "Please provide Authorization header and token"
        });
    };

    const token = req.headers.authorization.split(" ")[1];
    if(!token) {
        return res.status(403).json({
            message: "You are not Authorized"
        });
    };

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err) {
            return res.status(403).json({
                message: "Invalid Token"
            });
        }

        req.user = payload;
        next();
    })
}