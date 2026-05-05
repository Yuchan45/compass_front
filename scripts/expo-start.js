const path = require('node:path');
const { spawn } = require('node:child_process');

const { loadDotEnv } = require('./load-env');

const projectRoot = path.resolve(__dirname, '..');
loadDotEnv(projectRoot);

const port = process.env.PORT?.trim() || '8081';

if (!/^\d+$/.test(port)) {
  throw new Error(`PORT must be a number, received "${port}".`);
}

const expoCli = path.join(projectRoot, 'node_modules', 'expo', 'bin', 'cli');
const child = spawn(process.execPath, [expoCli, 'start', ...process.argv.slice(2), '--port', port], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
