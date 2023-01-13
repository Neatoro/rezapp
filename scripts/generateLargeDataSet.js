const { v4: uuid } = require('uuid');
const fs = require('fs/promises');
const path = require('path');

function getIngredient(index) {
    return {
        id: uuid(),
        name: `Ingredient ${index}`,
        user: '0123456789'
    };
}

function getRecipe(index) {
    return {
        id: uuid(),
        name: `Recipe ${index}`,
        description: 'Recipe',
        portions: Math.floor(Math.random() * 10),
        image: false,
        user: '0123456789'
    };
}

(async () => {
    const count = Number(process.argv[2]) || 100;
    const database = {
        ingredient: [...Array(count).keys()].map((index) =>
            getIngredient(index)
        ),
        recipe: [...Array(count).keys()].map((index) => getRecipe(index))
    };

    const profileName = process.argv[3] || 'large-dataset';
    const filePath = path.resolve(
        __dirname,
        '..',
        'integration-tests',
        'shared',
        'profile-helper',
        'profiles',
        `${profileName}.json`
    );
    const content = JSON.stringify({ database }, null, 4);
    await fs.writeFile(filePath, content);
})();
