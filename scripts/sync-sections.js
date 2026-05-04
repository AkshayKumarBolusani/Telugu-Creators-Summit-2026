const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.resolve(projectRoot, '..', 'html');
const targetDir = path.resolve(projectRoot, 'public', 'sections');
const sectionOrder = Array.from({ length: 10 }, (_, index) => index + 1);

if (!fs.existsSync(sourceDir)) {
  console.warn(`Source folder not found: ${sourceDir}`);
  process.exit(0);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

sectionOrder.forEach((number) => {
  const matchingFile = files.find((fileName) => {
    const parsed = path.parse(fileName);
    return (
      parsed.name === String(number) &&
      parsed.ext.toLowerCase() === '.html'
    );
  });

  const sourceFilePath = matchingFile ? path.join(sourceDir, matchingFile) : null;
  const targetFilePath = path.join(targetDir, `${number}.html`);

  if (!sourceFilePath || !fs.existsSync(sourceFilePath)) {
    fs.writeFileSync(targetFilePath, '', 'utf-8');
    return;
  }

  fs.copyFileSync(sourceFilePath, targetFilePath);
});

console.log('Sections synced to public/sections in order 1-10.');
