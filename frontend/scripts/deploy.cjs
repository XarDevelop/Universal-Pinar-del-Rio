// frontend/scripts/deploy.js
const ghpages = require('gh-pages');

ghpages.publish('dist', {
  length: 100,  // Procesa archivos en lotes de 100 (evita ENAMETOOLONG)
  dotfiles: true
}, (err) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('✅ Desplegado correctamente en GitHub Pages');
});