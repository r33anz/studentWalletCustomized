import React from 'react';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-blue-600">React 18 con Tailwind CSS</h1>
        <p className="mt-4 text-gray-700">¡Tu aplicación está funcionando correctamente!</p>
        <button className="px-4 py-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-600">
          ¡Haz clic aquí!
        </button>
      </div>
    </div>
  );
}

export default App;