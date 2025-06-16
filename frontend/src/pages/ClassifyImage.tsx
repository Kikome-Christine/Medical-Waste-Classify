import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ClassificationResult {
  id: string;
  user_id: string;
  filename: string;          
  top_category: string;
  confidence: number;
  all_predictions: { category: string; confidence: number }[];
  created_at: string; // ISO string from Supabase
}
// interface ClassificationResult {
//   top_category: string;
//   confidence: number;
//   all_predictions: Array<{
//     category: string;
//     confidence: number;
//   }>;
//   timestamp: number;
//   filename: string;
// }

const ClassifyImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset states
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleClassify = async () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post(' https://medical-waste-classify-1.onrender.com/api/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resultData = response.data;
    setResult(resultData);

      // Save to localStorage for history
      const historyResults = JSON.parse(localStorage.getItem('classificationHistory') || '[]');
      const updatedHistory = [response.data, ...historyResults].slice(0, 20); // Keep only the latest 20 results
      localStorage.setItem('classificationHistory', JSON.stringify(updatedHistory));

      const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    const { error: insertError } = await supabase
  .from('classification_history')
  .insert({
    id: crypto.randomUUID(),
    user_id: user?.id,

    filename: image.name,
    top_category: resultData.top_category,
    confidence: resultData.confidence
  
  });
    if (insertError) {
      console.error('Failed to save classification to Supabase:', insertError);
    }
   

  } catch (err) {
    console.error('Error classifying image:', err);
    setError('Failed to classify image. Please try again.');
  } finally {
    setIsLoading(false);
  }

  }   

  const resetClassification = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Classify Medical Waste</h1>
        <p className="text-lg text-gray-600">
          Upload an image of medical waste to classify it into the appropriate category
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            } ${image ? 'bg-gray-50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-blue-500 mb-4" />
            {!image ? (
              <>
                <p className="text-lg font-medium text-gray-800 mb-1">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                </p>
                <p className="text-gray-500">or click to select a file</p>
                <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG</p>
              </>
            ) : (
              <p className="text-gray-700 font-medium">
                {image.name} ({(image.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {preview && (
            <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-auto object-contain max-h-80"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleClassify}
              disabled={!image || isLoading}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Classifying...</span>
                </>
              ) : (
                <>
                  <span>Classify Image</span>
                </>
              )}
            </button>
            {image && (
              <button
                onClick={resetClassification}
                className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2 items-center">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div>
          {result ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Classification Results
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Primary Classification:</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-xl font-bold text-blue-800">{result.top_category}</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">All Categories:</h3>
                  <div className="space-y-3">
                    {result.all_predictions.map((pred, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-40 text-gray-800 font-medium truncate" title={pred.category}>
                          {pred.category}
                        </div>
                        <div className="flex-1 ml-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-400'}`}
                              style={{ width: `${(pred.confidence * 100).toFixed(1)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm text-gray-600">
                          {(pred.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
              <div className="text-center text-gray-500">
                <div className="bg-blue-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">No Classification Yet</p>
                <p>Upload an image and click "Classify Image" to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassifyImage;