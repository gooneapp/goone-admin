const { execSync } = require('child_process');

console.log('Installing dependencies in goone-admin...');
try {
  execSync('npm install react-router-dom @tanstack/react-query axios zustand react-hook-form zod @hookform/resolvers recharts date-fns lucide-react clsx --no-audit --no-fund', {
    stdio: 'inherit',
    cwd: __dirname,
  });
  console.log('Successfully installed dependencies!');
} catch (err) {
  console.error('Error installing dependencies:', err.message);
}
