const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\GoOne\\goone-website\\node_modules';
const destDir = 'c:\\GoOne\\goone-admin\\node_modules';

const packagesToCopy = [
  'react-router-dom',
  'react-router',
  '@remix-run',
  'lucide-react',
  'clsx',
  'date-fns',
  'zod',
  'react-hook-form',
];

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

console.log('Copying packages from website node_modules to admin node_modules...');
packagesToCopy.forEach((pkg) => {
  const source = path.join(srcDir, pkg);
  const target = path.join(destDir, pkg);
  console.log(`Copying ${pkg}...`);
  copyFolderRecursiveSync(source, target);
});
console.log('Done copying packages!');
