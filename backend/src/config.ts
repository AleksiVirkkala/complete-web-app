import 'tsconfig-paths/register'; // Fixes tsconfig 'path' attribute for nodemon
import { config as configDotenv } from 'dotenv';

const result = configDotenv(); // adds env variables to process
if (result.error) throw result.error;
