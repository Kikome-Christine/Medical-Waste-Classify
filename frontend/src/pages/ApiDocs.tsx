import React from 'react';
import { Code, FileJson, Image, AlertCircle } from 'lucide-react';

const ApiDocs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">MediSort REST API Explorer</h1>
        <p className="text-lg text-gray-600">
          Integrate medical waste classification into other applications such as mobile apps, embedded systems, smartbins, e.t.c., using our REST API
        </p>
      </div>

      <div className="space-y-8">
        {/* Base URL Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code className="h-6 w-6" />
              Base URL
            </h2>
          </div>
          <div className="p-6">
            <code className="bg-gray-100 px-4 py-2 rounded-md text-gray-800 block">
              http://localhost:5000
            </code>
          </div>
        </div>

        {/* Authentication Section */}
        {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Authentication
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Currently, the API is open and does not require authentication. For production use, we recommend implementing API key authentication.
            </p>
          </div>
        </div> */}

        {/* Endpoints Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileJson className="h-6 w-6" />
              Core Endpoints
            </h2>
          </div>
          <div className="p-6 space-y-8">
            {/* Classify Image Endpoint */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Classify Image</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-700">Endpoint</p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                    POST /api/classify
                  </code>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Content-Type</p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                    multipart/form-data
                  </code>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Request Body</p>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="text-gray-800 mb-2">Form Data:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>image</code> - Image file (JPG, PNG)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Response</p>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code className="text-gray-800">{`{
  "top_category": "Infectious Waste",
  "confidence": 0.92,
  "all_predictions": [
    {
      "category": "Infectious Waste",
      "confidence": 0.92
    },
    // ... other categories
  ],
  "timestamp": 1647123456.789,
  "filename": "waste_image.jpg"
}`}</code>
                  </pre>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Example Usage (Python)</p>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code className="text-gray-800">{`import requests

url = 'http://localhost:5000/api/classify'
files = {'image': open('waste_image.jpg', 'rb')}

response = requests.post(url, files=files)
result = response.json()

print(f"Category: {result['top_category']}")
print(f"Confidence: {result['confidence']:.2%}")`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Get History Endpoint */}
            <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Get Classification History</h3>
            <div className="space-y-4">
                <div>
                <p className="font-medium text-gray-700">Endpoint</p>
                <code className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                    GET /api/history
                </code>
                </div>

                <div>
                <p className="font-medium text-gray-700">Response</p>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code className="text-gray-800">{`[
            {
                "filename": "waste_image_1.jpg",
                "top_category": "General Waste",
                "confidence": 0.88,
                "timestamp": 1647123555.123
            },
            {
                "filename": "waste_image_2.jpg",
                "top_category": "Infectious Waste",
                "confidence": 0.93,
                "timestamp": 1647123567.456
            }
            ]`}</code>
                </pre>
                </div>

                <div>
                <p className="font-medium text-gray-700">Example Usage (JavaScript)</p>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code className="text-gray-800">{`fetch('http://localhost:5000/api/history')
            .then(response => response.json())
            .then(data => {
                console.log('History:', data);
            })
            .catch(error => console.error('Error:', error));`}</code>
                </pre>
                </div>
            </div>
            </div>


            {/* Get Categories Endpoint */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Get Categories</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-700">Endpoint</p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                    GET /api/categories
                  </code>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Response</p>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code className="text-gray-800">{`{
  "categories": [
    {
      "name": "Infectious Waste",
      "description": "Waste contaminated with blood and other bodily fluids"
    },
    // ... other categories
  ]
}`}</code>
                  </pre>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Example Usage (JavaScript)</p>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code className="text-gray-800">{`fetch('http://localhost:5000/api/categories')
  .then(response => response.json())
  .then(data => {
    console.log('Categories:', data.categories);
  })
  .catch(error => console.error('Error:', error));`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>


        

        {/* Error Handling Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Error Handling</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-gray-700">The API uses standard HTTP status codes and returns error messages in JSON format:</p>
              
              <div className="space-y-2">
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="font-medium text-gray-800">400 Bad Request</p>
                  <pre className="text-gray-700 mt-2">{`{
  "error": "No image part"
}`}</pre>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="font-medium text-gray-800">500 Internal Server Error</p>
                  <pre className="text-gray-700 mt-2">{`{
  "error": "Classification failed"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Tips */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Image className="h-6 w-6" />
              Integration Tips
            </h2>
          </div>
          <div className="p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Ensure images are in JPG or PNG format</li>
              <li>Maximum recommended image size is 5MB</li>
              <li>Images should be well-lit and clearly focused</li>
              <li>Handle API errors gracefully in your application</li>
              <li>Consider implementing retry logic for failed requests</li>
              <li>Cache category information to reduce API calls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;