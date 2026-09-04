import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sports_talent_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'sports_talent_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: '7d'
};
