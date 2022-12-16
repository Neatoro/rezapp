const sqlite = require('sqlite3').verbose();
const path = require('path');

class ProfileHelper {
    constructor() {
        const dbPath =
            process.env.DATABASE_PATH ||
            path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                'src',
                'backend',
                'recipes.db'
            );
        this.db = new sqlite.Database(dbPath);
    }

    _exec(query) {
        return new Promise((resolve, reject) => {
            this.db.exec(query, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async cleanSetup() {
        await this._exec('DELETE FROM ingredient;');
        await this._exec('DELETE FROM recipe;');
        await this._exec('DELETE FROM recipe_ingredient;');
        await this._exec('DELETE FROM recipe_step;');
    }

    async apply(profileName) {
        const profile = require(`./profiles/${profileName}.json`);
        const tables = Object.keys(profile);

        for (const table of tables) {
            const entries = profile[table];
            for (const entry of entries) {
                const fields = Object.keys(entry).join(', ');
                const values = Object.values(entry)
                    .map(JSON.stringify)
                    .join(', ');

                const query = `INSERT INTO ${table} (${fields}) VALUES (${values});`;
                await this._exec(query);
            }
        }
    }

    close() {
        this.db.close();
    }
}

module.exports = ProfileHelper;
