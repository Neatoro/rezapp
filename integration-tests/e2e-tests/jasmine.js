const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: ['**/*.flow.?(m)js'],
    env: {
        stopSpecOnExpectationFailure: false,
        random: true
    }
});

const reporter = new JasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    timeUnit: 'ms',
    timeThreshold: { ok: 3000, warn: 25000, ouch: 28000 },
    activity: true,
    emoji: true,
    beep: true
});
jasmine.env.clearReporters();
jasmine.addReporter(reporter);

(async () => {
    console.log('Doing warmup request');
    await fetch(process.env.FRONTEND_BASE_URL || 'http://localhost:5173');
    console.log('Starting tests');
    jasmine.execute();
})();
