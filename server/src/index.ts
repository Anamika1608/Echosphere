import express from "express";
import db from "./config/dbConnection";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config"

import { errorHandler } from "./middleware/error.middleware";

import { authRouter } from "./modules/auth/auth.routes";
import { voiceChatRouter } from "./modules/voiceChat/voiceChat.routes";
import { pgCommunityRouter } from "./modules/pgCommunity/pgCommunity.routes"
import { pgAnalyticsRouter } from "./modules/pgAnalytics/pgAnalytics.routes";
import { technicianRouter } from './modules/technician/technician.routes'
import { eventSuggestionRouter } from './modules/eventSuggestion/eventSuggestion.routes'
import { whatsappWebRouter } from "./modules/whatsappWeb/whatsapp.route";

const app = express()
const port = config.port

app.use(cors(
    {
        credentials: true,
        origin: config.frontendUrl,
        exposedHeaders: ["Set-Cookie"]
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
app.use("/api/pg-community", pgCommunityRouter)
app.use("/api/pg-analytics", pgAnalyticsRouter)
app.use("/api/technician", technicianRouter)
app.use("/api/voice-chat", voiceChatRouter)
app.use("/api/event-suggestions", eventSuggestionRouter)
app.use("/api/whatsapp", whatsappWebRouter)

app.use(errorHandler);
