import express from 'express';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { authenticated as customerRoutes } from './router/auth_users.js';
import { general as generalRoutes } from './router/general.js';

const app = express();
const PORT = 5000;
app
    .use(express.json())
    .use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'Token is required!' });
    }

    jwt.verify(token.split(' ')[1], 'fingerprint_customer', (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Invalid token!' });
        }

        req.user = decoded;
        next();
    })
})

app
    .use("/customer", customerRoutes)
    .use("/", generalRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})