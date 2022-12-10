import { resolve } from 'path';
import { stat, readFile } from 'fs/promises';

export async function loadDatabaseConfiguration() {
    const filePath = resolve(process.cwd(), 'ormconfig.json');

    const statResult = await stat(filePath);
    if (statResult) {
        const content = await readFile(filePath, { encoding: 'utf-8' });
        return JSON.parse(content);
    }
}
