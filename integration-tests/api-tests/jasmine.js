const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: ['**/*[sS]pec.?(m)js'],
    helpers: ['helpers/**/*.?(m)js'],
    env: {
        stopSpecOnExpectationFailure: false,
        random: true
    }
});

if (!process.env.CI) {
    const reporter = new JasmineConsoleReporter({
        colors: 1,
        cleanStack: 1,
        verbosity: 4,
        listStyle: 'indent',
        timeUnit: 'ms',
        timeThreshold: { ok: 500, warn: 1000, ouch: 3000 },
        activity: true,
        emoji: true,
        beep: true
    });
    jasmine.env.clearReporters();
    jasmine.addReporter(reporter);
}

jasmine.execute();
