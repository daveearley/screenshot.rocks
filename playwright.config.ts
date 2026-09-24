import {defineConfig, devices} from '@playwright/test';

const port = 5055;

export default defineConfig({
    testDir: './e2e',
    timeout: 30_000,
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        trace: 'retain-on-failure',
        viewport: {width: 1440, height: 900},
    },
    projects: [{name: 'chromium', use: {...devices['Desktop Chrome'], viewport: {width: 1440, height: 900}}}],
    webServer: {
        command: 'node e2e/server.js',
        url: `http://127.0.0.1:${port}`,
        reuseExistingServer: !process.env.CI,
        env: {PORT: String(port)},
    },
});
