const ProfileHelper = require('../integration-tests/shared/profile-helper');

(async () => {
    const profile = process.argv[2] || 'simple-recipe';
    const profileHelper = new ProfileHelper();
    await profileHelper.cleanSetup();
    await profileHelper.apply(profile);
})();
