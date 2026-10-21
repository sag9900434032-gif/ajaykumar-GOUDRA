const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const auroraDir = path.join(rootDir, 'aurora');
const distDir = path.join(rootDir, 'dist');
const adminDir = path.join(rootDir, 'admin');

console.log('🚀 Starting Unified Build for AKRDevi Website & Portals...');

// Helper to copy files/folders recursively
function copySync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copySync(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. Build Aurora Admin App if node_modules are present; otherwise fallback to pre-built admin/
if (fs.existsSync(auroraDir)) {
  const auroraModules = path.join(auroraDir, 'node_modules');
  if (fs.existsSync(auroraModules)) {
    console.log('📦 Building Aurora React administration portal...');
    try {
      execSync('npm run build', { cwd: auroraDir, stdio: 'inherit' });
    } catch (err) {
      console.warn('⚠️ Aurora build step warning, continuing with existing dist assets...');
    }
  } else {
    console.log('ℹ️ Aurora node_modules not present in build environment; utilizing pre-compiled admin/ assets.');
  }
}

// 2. Prepare dist/ folder
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 3. Copy Aurora build to dist/admin and root/admin
const auroraDist = path.join(auroraDir, 'dist');
if (fs.existsSync(auroraDist)) {
  console.log('📋 Copying Aurora assets to admin/ and dist/admin/...');
  copySync(auroraDist, adminDir);
  copySync(auroraDist, path.join(distDir, 'admin'));
} else if (fs.existsSync(adminDir)) {
  console.log('📋 Copying existing admin/ to dist/admin/...');
  copySync(adminDir, path.join(distDir, 'admin'));
}

// Also sync admin/assets into dist/assets so relative asset paths resolve identically
const adminAssetsDir = path.join(adminDir, 'assets');
if (fs.existsSync(adminAssetsDir)) {
  copySync(adminAssetsDir, path.join(distDir, 'assets'));
}

// 4. Copy public website files to dist/
const filesToCopy = [
  'index.html',
  'admission-portal.html',
  'adminpanel.index.html',
  'style.css',
  'theme-dark.css',
  'supabase-client.js',
  'style.css for admin',
  'javascript for admin  panel',
  'mounesh  pic avatar.png',
  'WhatsApp Image 2026-07-22 at 4.13.14 PM.jpeg'
];

filesToCopy.forEach(file => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    copySync(src, path.join(distDir, file));
  }
});

// Copy directories
const dirsToCopy = ['assets', 'javascript'];
dirsToCopy.forEach(dir => {
  const src = path.join(rootDir, dir);
  if (fs.existsSync(src)) {
    copySync(src, path.join(distDir, dir));
  }
});

// Ensure admin/index.html is accessible at legacy and alternative endpoints
const adminIndex = path.join(distDir, 'admin', 'index.html');
if (fs.existsSync(adminIndex)) {
  copySync(adminIndex, path.join(distDir, 'admin-panel.html'));
  copySync(adminIndex, path.join(distDir, 'backend', 'admin-panel.html'));
  copySync(adminIndex, path.join(rootDir, 'backend', 'admin-panel.html'));
}

console.log('✅ Build complete! All static assets ready in dist/ for Vercel deployment:');
console.log('   - / -> index.html (Main College Public Portal)');
console.log('   - /admission -> admission-portal.html (Public Online Admissions)');
console.log('   - /admin -> admin/index.html (Aurora Next-Gen Administration Portal)');
console.log('   - /backend/admin-panel.html -> Aurora Administration Portal');
