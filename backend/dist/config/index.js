import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
export const config = {
    port: Number(process.env.PORT) || 4000,
    dataDir: process.env.DATA_DIR || join(__dirname, "../../data"),
};
