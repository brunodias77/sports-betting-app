import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Modal from './components/ui/Modal';
import Input from './components/ui/Input';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Badge from './components/ui/Badge';
import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length < 3) {
      setInputError('Minimum 3 characters required');
    } else {
      setInputError('');
    }
  };

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to external service in production
    console.error('Application error:', error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
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
        
        <main className="max-w-4xl mx-auto space-y-8">
          {/* Component Showcase */}
          <Card variant="hover" className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Foundational UI Components Implemented!
            </h2>
            <p className="text-gray-600 mb-6">
              All base components are ready: Button, Card, Modal, Input, LoadingSpinner, and Badge
            </p>
            
            {/* Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
              <Button variant="secondary" size="sm">
                Small Button
              </Button>
              <Button variant="danger" loading>
                Loading...
              </Button>
            </div>

            {/* Badges */}
            <div className="flex gap-2 justify-center mb-6 flex-wrap">
              <Badge variant="live">LIVE</Badge>
              <Badge variant="success">Won</Badge>
              <Badge variant="danger">Lost</Badge>
              <Badge variant="warning">Active</Badge>
              <Badge variant="primary">Primary</Badge>
            </div>

            {/* Loading Spinner */}
            <div className="flex gap-4 justify-center items-center mb-6">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
              <LoadingSpinner color="gray" />
            </div>
          </Card>

          {/* Cards Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-gray-600">Basic card styling</p>
            </Card>
            <Card variant="hover">
              <h3 className="font-semibold mb-2">Hover Card</h3>
              <p className="text-gray-600">Hover for effect</p>
            </Card>
            <Card variant="selected">
              <h3 className="font-semibold mb-2">Selected Card</h3>
              <p className="text-gray-600">Selected state</p>
            </Card>
          </div>

          {/* Input Showcase */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Input Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Test Input"
                value={inputValue}
                onChange={handleInputChange}
                error={inputError}
                placeholder="Type at least 3 characters"
              />
              <Input
                label="Disabled Input"
                value="Disabled value"
                disabled
                helperText="This input is disabled"
              />
            </div>
          </Card>
        </main>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <div className="space-y-4">
            <p>This is an example modal with all the features:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Click backdrop to close</li>
              <li>Press ESC to close</li>
              <li>Focus management</li>
              <li>Responsive design</li>
            </ul>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
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
    </ErrorBoundary>
  );
}

export default App;
