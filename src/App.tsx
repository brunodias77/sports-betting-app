import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sports Betting Manager
          </h1>
          <p className="text-gray-600">
            Gerencie suas apostas esportivas de forma inteligente
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="card-base card-hover text-center">
            <h2 className="text-xl font-semibold mb-4">
              Projeto configurado com sucesso!
            </h2>
            <p className="text-gray-600 mb-4">
              React + Vite + TypeScript + TailwindCSS + Zustand + Zod + React Hot Toast
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn-primary">
                Botão Primário
              </button>
              <button className="btn-secondary">
                Botão Secundário
              </button>
              <button className="btn-danger">
                Botão Perigo
              </button>
            </div>
          </div>
        </main>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
