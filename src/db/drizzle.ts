import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from './schema'
import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local' }); 

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle({ client , schema });
