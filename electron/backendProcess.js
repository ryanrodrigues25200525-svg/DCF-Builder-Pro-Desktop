const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let backendProcess = null;
let frontendProcess = null;

function getAppRoot() {
  return path.join(__dirname, '..');
}

function getResourcesRoot() {
  return process.resourcesPath || getAppRoot();
}

function firstExistingPath(paths) {
  return paths.find((candidate) => candidate && fs.existsSync(candidate)) || null;
}

function findStandaloneServer(startDir) {
  const candidates = [
    path.join(startDir, 'server.js'),
    path.join(startDir, 'frontend', 'server.js'),
  ];
  const direct = firstExistingPath(candidates);
  if (direct) return direct;

  if (!fs.existsSync(startDir)) return null;
  const stack = [startDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile() && entry.name === 'server.js') return fullPath;
      if (entry.isDirectory() && entry.name !== 'node_modules') stack.push(fullPath);
    }
  }
  return null;
}

function killProcessOnPort(port, log) {
  try {
    const isWindows = process.platform === 'win32';
    if (isWindows) {
      // Find PID on port and kill it
      const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') {
            log(`Killing process ${pid} on port ${port}`);
            execSync(`taskkill /F /PID ${pid}`);
          }
        }
      }
    } else {
      // Unix: lsof -ti:port | xargs kill -9
      try {
        const pids = execSync(`lsof -ti:${port}`).toString().trim();
        if (pids) {
          const pidList = pids.split(/\s+/).join(' ');
          log(`Killing process(es) ${pidList} on port ${port}`);
          execSync(`kill -9 ${pidList}`);
          // Give OS a moment to free the socket
          execSync('sleep 0.5');
        }
      } catch (e) {
        // lsof returns exit code 1 if no process found, which is fine
      }
    }
  } catch (err) {
    log(`Error killing process on port ${port}: ${err.message}`);
  }
}

async function startBackend(identity, log, isDev) {
  return new Promise((resolve, reject) => {
    if (backendProcess) {
      resolve();
      return;
    }

    const backendPort = process.env.DCF_BACKEND_PORT || '8000';
    killProcessOnPort(backendPort, log);

    log('Starting backend...');
    
    // Inject EDGAR_IDENTITY into env if available
    const env = { ...process.env, CORS_ORIGINS: 'http://localhost:3000,http://127.0.0.1:3000,app://.,file://', ALLOWED_HOSTS: 'localhost,127.0.0.1' };
    if (identity && identity.fullName && identity.email) {
      env.EDGAR_IDENTITY = `${identity.fullName} <${identity.email}>`;
    }
    
    env.DCF_BACKEND_PORT = env.DCF_BACKEND_PORT || '8000';

    const rootDir = getAppRoot();
    
    // Simple fallback using npm scripts or python
    // If PyInstaller is used later, we would check for the executable here.
    const isWindows = process.platform === 'win32';
    let command;
    let args;
    let cwd;
    
    if (isDev) {
      command = 'npm';
      args = ['run', 'dev:backend'];
      cwd = rootDir;
    } else {
      const resourcesRoot = getResourcesRoot();
      const binaryName = isWindows ? 'dcf-backend.exe' : 'dcf-backend';
      const bundledBackend = firstExistingPath([
        path.join(resourcesRoot, 'backend', binaryName),
        path.join(resourcesRoot, 'backend', 'dist', binaryName),
        path.join(resourcesRoot, 'backend', 'dcf-backend', binaryName),
        path.join(rootDir, 'backend', 'dist', binaryName),
        path.join(rootDir, 'backend', 'dist', 'dcf-backend', binaryName),
      ]);

      if (bundledBackend) {
        cwd = path.dirname(bundledBackend);
        command = bundledBackend;
        args = [];
      } else {
        cwd = path.join(rootDir, 'backend');
        command = isWindows ? 'python' : 'python3';
        args = ['desktop_server.py'];
        const venvPython = isWindows ? path.join(cwd, '.venv', 'Scripts', 'python.exe') : path.join(cwd, '.venv', 'bin', 'python');
        if (fs.existsSync(venvPython)) {
            command = venvPython;
        }
      }
    }

    log(`Spawning backend: ${command} ${args.join(' ')}`);
    backendProcess = spawn(command, args, { cwd, env, shell: isWindows });

    backendProcess.stdout.on('data', (data) => log(`[Backend] ${data.toString().trim()}`));
    backendProcess.stderr.on('data', (data) => log(`[Backend ERR] ${data.toString().trim()}`));

    backendProcess.on('close', (code) => {
      log(`Backend process exited with code ${code}`);
      backendProcess = null;
    });
    
    // Don't wait for health check here, main.js does it
    resolve();
  });
}

async function stopBackend(log) {
  return new Promise((resolve) => {
    if (backendProcess) {
      const timer = setTimeout(() => {
        log('Backend stop timed out, forcing port kill...');
        const backendPort = process.env.DCF_BACKEND_PORT || '8000';
        killProcessOnPort(backendPort, log);
        backendProcess = null;
        resolve();
      }, 3000);

      backendProcess.on('close', () => {
        clearTimeout(timer);
        backendProcess = null;
        resolve();
      });
      
      try {
        backendProcess.kill('SIGTERM');
      } catch (err) {
        log(`Error killing backend: ${err.message}`);
        const backendPort = process.env.DCF_BACKEND_PORT || '8000';
        killProcessOnPort(backendPort, log);
        backendProcess = null;
        resolve();
      }
    } else {
      // Still kill port just in case of zombies
      const backendPort = process.env.DCF_BACKEND_PORT || '8000';
      killProcessOnPort(backendPort, log);
      resolve();
    }
  });
}

async function startFrontend(log, isDev) {
  return new Promise((resolve, reject) => {
    if (frontendProcess) {
      resolve();
      return;
    }

    log('Starting frontend...');
    const frontendPort = 3000;
    killProcessOnPort(frontendPort, log);

    const rootDir = getAppRoot();
    const isWindows = process.platform === 'win32';
    
    let command = 'npm';
    let args = ['run', 'dev:frontend'];
    let cwd = rootDir;
    
    // Inject backend URL for Next.js API routes
    const backendPort = process.env.DCF_BACKEND_PORT || '8000';
    const env = { ...process.env, SEC_SERVICE_URL: `http://127.0.0.1:${backendPort}` };

    if (!isDev) {
      const resourcesRoot = getResourcesRoot();
      const standaloneRoot = firstExistingPath([
        path.join(resourcesRoot, 'frontend-standalone'),
        path.join(rootDir, 'frontend', '.next', 'standalone'),
      ]);
      const serverPath = standaloneRoot ? findStandaloneServer(standaloneRoot) : null;

      if (!serverPath) {
        reject(new Error('Packaged Next.js standalone server was not found. Run npm run build:frontend first.'));
        return;
      }

      command = process.execPath;
      args = [serverPath];
      cwd = path.dirname(serverPath);
      env.ELECTRON_RUN_AS_NODE = '1';
      env.NODE_ENV = 'production';
      env.PORT = String(frontendPort);
      env.HOSTNAME = '127.0.0.1';
      env.NEXT_SHARP_PATH = path.join(path.dirname(serverPath), 'node_modules', 'sharp');
      env.NODE_PATH = [
        path.join(standaloneRoot, 'standalone_modules'),
        path.join(standaloneRoot, 'node_modules'),
        env.NODE_PATH || '',
      ].filter(Boolean).join(path.delimiter);
    }
    
    log(`Spawning frontend: ${command} ${args.join(' ')}`);
    frontendProcess = spawn(command, args, { cwd, env: env, shell: isWindows && isDev });

    frontendProcess.stdout.on('data', (data) => log(`[Frontend] ${data.toString().trim()}`));
    frontendProcess.stderr.on('data', (data) => log(`[Frontend ERR] ${data.toString().trim()}`));

    frontendProcess.on('close', (code) => {
      log(`Frontend process exited with code ${code}`);
      frontendProcess = null;
    });

    resolve();
  });
}

async function stopFrontend(log) {
  return new Promise((resolve) => {
    if (frontendProcess) {
      const timer = setTimeout(() => {
        log('Frontend stop timed out, forcing port kill...');
        const frontendPort = 3000;
        killProcessOnPort(frontendPort, log);
        frontendProcess = null;
        resolve();
      }, 3000);

      frontendProcess.on('close', () => {
        clearTimeout(timer);
        frontendProcess = null;
        resolve();
      });
      
      try {
        frontendProcess.kill('SIGTERM');
      } catch (err) {
        log(`Error killing frontend: ${err.message}`);
        const frontendPort = 3000;
        killProcessOnPort(frontendPort, log);
        frontendProcess = null;
        resolve();
      }
    } else {
      const frontendPort = 3000;
      killProcessOnPort(frontendPort, log);
      resolve();
    }
  });
}

module.exports = { startBackend, stopBackend, startFrontend, stopFrontend };
