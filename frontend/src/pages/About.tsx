import React from 'react';
import { Book, Code, Server, Lightbulb, Shield, Cpu } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About the MediSort AI Classification System</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our image classification system uses machine learning to identify different types of medical waste, helping healthcare facilities manage waste safely and efficiently.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Cpu className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Machine Learning Model</h3>
                <p className="text-gray-700">
                  Our system uses a convolutional neural network (CNN) based on the MobileNetV2 architecture. The model has been trained on thousands of medical waste images across different categories. This allows it to identify visual patterns that distinguish different types of waste, even in varied lighting and backgrounds.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Server className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">API Architecture</h3>
                <p className="text-gray-700">
                  The system consists of a Flask-based backend API that handles image processing and classification. When you upload an image, it's preprocessed to match the input requirements of our model, then passed through the neural network for classification. The results are returned with confidence scores for each category.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Code className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Technologies Used</h3>
                <p className="text-gray-700">
                  Our application combines React for the frontend interface, TensorFlow for the machine learning model, and Flask for the API. This stack provides a responsive user experience while leveraging powerful AI capabilities. All classification happens on our servers, so there's no need to install anything on your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Why This Matters</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Proper medical waste classification is crucial for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ensuring regulatory compliance with healthcare waste guidelines</li>
                <li>Preventing the spread of infection and contamination</li>
                <li>Reducing environmental impact through proper disposal</li>
                <li>Minimizing health risks to healthcare workers and waste handlers</li>
                <li>Optimizing waste management costs by preventing over-classification</li>
              </ul>
              <p>
                Our system helps healthcare facilities achieve these goals through accurate, consistent classification that doesn't rely on human judgment alone.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Data & Privacy</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We take data security and privacy seriously:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All image processing is done securely on our servers</li>
                <li>Images are stored temporarily and securely during processing</li>
                <li>Classification history is stored locally on your device, not on our servers</li>
                <li>We don't collect personally identifiable information from your images</li>
                <li>The system is designed to handle medical waste images only and should not be used to upload any patient information or protected health information</li>
              </ul>
              <p>
                Our goal is to provide a helpful tool while respecting your privacy and maintaining compliance with data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Book className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Resources & References</h2>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <p>
              For more information on medical waste management and classification:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-blue-700 mb-1">WHO Guidelines</h3>
                <p className="text-sm text-gray-600">World Health Organization guidelines on safe management of wastes from healthcare activities</p>
              </a>
              
              <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-blue-700 mb-1">CDC Medical Waste</h3>
                <p className="text-sm text-gray-600">Centers for Disease Control and Prevention resources on medical waste management</p>
              </a>
              
              <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-blue-700 mb-1">EPA Regulations</h3>
                <p className="text-sm text-gray-600">Environmental Protection Agency regulations regarding medical waste disposal</p>
              </a>
              
              <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-blue-700 mb-1">Research Papers</h3>
                <p className="text-sm text-gray-600">Academic publications on AI in medical waste classification</p>
              </a>
            </div>
            
            <p className="mt-6">
              If you have questions about our system or need help with implementation in your facility, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;