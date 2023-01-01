const sqlite = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs/promises');

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
        this.imagesPath = process.env.IMAGES_PATH || path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'src',
            'backend',
            'images'
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
        await this._exec('DELETE FROM label;');

        const files = await fs.readdir(this.imagesPath);
        for (const file of files) {
            await fs.rm(path.resolve(this.imagesPath, file));
        }
    }

    async apply(profileName) {
        const profile = require(`./profiles/${profileName}.json`);
        const database = profile.database;
        const tables = Object.keys(database);

        for (const table of tables) {
            const entries = database[table];
            for (const entry of entries) {
                const fields = Object.keys(entry).join(', ');
                const values = Object.values(entry)
                    .map(JSON.stringify)
                    .join(', ');

                const query = `INSERT INTO ${table} (${fields}) VALUES (${values});`;
                await this._exec(query);
            }
        }

        const images = profile.images;
        if (images) {
            const targets = Object.keys(images);

            for (const target of targets) {
                const targetPath = path.resolve(
                    this.imagesPath,
                    target
                );
                await fs.copyFile(
                    path.resolve(
                        __dirname,
                        'profiles',
                        'images',
                        images[target].name
                    ),
                    targetPath
                );
            }
        }
    }

    close() {
        this.db.close();
    }
}

module.exports = ProfileHelper;
