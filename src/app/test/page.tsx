'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs?sort_by=relevance&page=1&limit=10');
        const data = await response.json();
        setApiResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">API Response:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Summary:</h2>
        <ul className="list-disc list-inside">
          <li>Total Jobs: {apiResponse?.total || 0}</li>
          <li>Jobs Array Length: {apiResponse?.jobs?.length || 0}</li>
          <li>Current Page: {apiResponse?.page || 0}</li>
          <li>Total Pages: {apiResponse?.total_pages || 0}</li>
        </ul>
      </div>

      {apiResponse?.jobs && apiResponse.jobs.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">First Job:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(apiResponse.jobs[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 