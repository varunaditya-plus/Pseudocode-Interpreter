import './style.css';

function router() {
  const app = document.getElementById('app');
  const path = window.location.pathname;
  
  app.innerHTML = '';
  
  switch (path) {
    case '/':
    case '/index.html':
      import('./editor.js')
        .then(module => {
          if (module.initEditor) {
            module.initEditor(app);
          } else {
            app.innerHTML = '<div class="p-5 text-red-500">Error: Editor module not properly exported</div>';
          }
        })
        .catch(error => {
          console.error('Failed to load editor:', error);
          app.innerHTML = `<div class="p-5 text-red-500">Failed to load editor: ${error.message}</div>`;
        });
      break;
      
    case '/docs':
      import('./docs.js')
        .then(module => {
          if (module.initDocs) {
            module.initDocs(app);
          } else {
            app.innerHTML = '<div class="p-5 text-red-500">Error: Documentation module not properly exported</div>';
          }
        })
        .catch(error => {
          console.error('Failed to load documentation:', error);
          app.innerHTML = `<div class="p-5 text-red-500">Failed to load documentation: ${error.message}</div>`;
        });
      break;
      
    default:
      app.innerHTML = `
        <div class="flex flex-col items-center justify-center h-screen bg-[#24262B] text-white p-5">
          <h1 class="text-4xl mb-4">404 - Page Not Found</h1>
          <p class="mb-6">The page you're looking for doesn't exist.</p>
          <a href="/" class="bg-[#3b3e48] hover:bg-[#4a4e5a] text-white rounded-lg px-4 py-2 transition-colors">Go to Editor</a>
        </div>
      `;
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  router();
  
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('/')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      window.history.pushState({}, '', href);
      router();
    }
  });
  
  window.addEventListener('popstate', router);
});