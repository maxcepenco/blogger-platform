import  {config} from "dotenv";
config();



export const SETTINGS = {
    PORT: process.env.PORT || 5003,
    MONGO_URL: process.env.MONGO_URL || "mongodb+srv://cep211993:cepencomax@cluster0.j4naknt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    DB_NAME: process.env.DB_NAME || 'blogger-platform',
    AC_SECRET: process.env.AC_SECRET  as string,
    AC_TIME: process.env.AC_TIME,
    RT_SECRET: process.env.RT_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS,
}

