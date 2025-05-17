const { spawn } = require('child_process');
const path = require('path');

// Start Node.js server
const nodeServer = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true
});

// Start Python server
const pythonServer = spawn('python', ['python/app.py'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname)
});

// Handle process termination
process.on('SIGINT', () => {
    nodeServer.kill();
    pythonServer.kill();
    process.exit();
});

// Handle errors
nodeServer.on('error', (err) => {
    console.error('Node.js server error:', err);
});

pythonServer.on('error', (err) => {
    console.error('Python server error:', err);
});

// Log server starts
console.log('Starting Node.js server...');
console.log('Starting Python server...'); 