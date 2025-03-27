import React from 'react';

const EnvTest: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Environment Variables Test</h2>
      <div className="space-y-2">
        <p>
          <strong>API URL: </strong>
          {import.meta.env.VITE_API_URL || 'Not loaded'}
        </p>
        <p>
          <strong>GROQ API Key: </strong>
          {import.meta.env.VITE_GROQ_API_KEY ? '✅ Loaded' : '❌ Not loaded'}
        </p>
        <p>
          <strong>Node Environment: </strong>
          {import.meta.env.MODE}
        </p>
      </div>
    </div>
  );
};

export default EnvTest; 