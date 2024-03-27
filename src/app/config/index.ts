import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_secret: process.env.REFRESH_SECRET,
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
    reset_secret: process.env.RESET_SECRET,
    reset_pass_expires_in: process.env.RESET_PASS_EXPIRES_IN,
    reset_pass_link: process.env.RESET_PASS_LINK,
  },
  email: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  }
};
