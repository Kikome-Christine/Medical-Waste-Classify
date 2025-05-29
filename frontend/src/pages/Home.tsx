import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Clock, Info } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
         MediSort AI Classification System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          An intelligent system that classifies medical waste images using machine learning to ensure proper disposal and safety.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/classify" className="btn btn-primary flex items-center gap-2">
            <Upload size={20} />
            Start Classifying
          </Link>
          <Link to="/categories" className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FileText size={20} />
            Learn About Categories
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              step={1}
              title="Upload Image"
              description="Take a photo of medical waste or upload an existing image to our secure platform."
              color="bg-blue-500"
            />
            <FeatureCard 
              step={2}
              title="AI Classification"
              description="Our machine learning model analyzes the image and identifies the type of medical waste."
              color="bg-teal-500"
            />
            <FeatureCard 
              step={3}
              title="Get Results"
              description="Receive accurate classification results with confidence scores and proper disposal guidelines."
              color="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Classification</h3>
              <p className="text-gray-600 mb-4">
                Upload and classify medical waste images in seconds with our intuitive interface.
              </p>
              <Link to="/classify" className="text-blue-600 font-medium hover:underline inline-flex items-center">
                Start classifying
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Waste Categories</h3>
              <p className="text-gray-600 mb-4">
                Learn about different medical waste categories and their proper disposal methods.
              </p>
              <Link to="/categories" className="text-teal-600 font-medium hover:underline inline-flex items-center">
                View categories
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Classification History</h3>
              <p className="text-gray-600 mb-4">
                Access your previous classifications to track waste management over time.
              </p>
              <Link to="/history" className="text-indigo-600 font-medium hover:underline inline-flex items-center">
                View history
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Info className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">About the System</h3>
              <p className="text-gray-600 mb-4">
                Learn about our machine learning model and the technology behind our classification system.
              </p>
              <Link to="/about" className="text-orange-600 font-medium hover:underline inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  step: number;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ step, title, description, color }) => {
  return (
    <div className="relative border border-gray-200 rounded-lg p-6 transition-all hover:shadow-md">
      <div className={`${color} text-white w-8 h-8 rounded-full flex items-center justify-center absolute -top-3 -left-3 font-bold`}>
        {step}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;