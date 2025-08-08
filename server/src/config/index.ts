import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT,
  frontendUrl: process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET!,
  NODE_ENV: process.env.NODE_ENV,
  omniDimKey: process.env.OMNIDIM_API_KEY,
};

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

export default config;