import express from "express";
import db from "./config/dbConnection";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config"

import { authRouter } from "./modules/auth/auth.routes";

const app = express()
const port = config.port

app.use(cors(
    {
        credentials: true,
        origin: config.frontendUrl
    }
));

db.connect()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection error:", err));

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});

app.get("/", (req, res) => {
    res.send("Hello there!");
});

app.use("/api/auth", authRouter)