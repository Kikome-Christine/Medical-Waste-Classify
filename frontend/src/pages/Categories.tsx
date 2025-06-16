import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Syringe, FlaskRound as Flask, Radiation, Pill, FileText } from 'lucide-react';

interface Category {
  name: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(' https://medical-waste-classify-1.onrender.com/api/categories');
        
        // Add icons to categories
        const categoriesWithIcons = response.data.categories.map((category: Category) => {
          let icon, color;
          
          switch(category.name) {
            case 'Infectious Waste':
              icon = <AlertTriangle />;
              color = 'bg-red-500';
              break;
            case 'Sharps':
              icon = <Syringe />;
              color = 'bg-orange-500';
              break;
            case 'Chemical Waste':
              icon = <Flask />;
              color = 'bg-purple-500';
              break;
            case 'Radioactive Waste':
              icon = <Radiation />;
              color = 'bg-yellow-500';
              break;
            case 'Pharmaceutical Waste':
              icon = <Pill />;
              color = 'bg-blue-500';
              break;
            default:
              icon = <FileText />;
              color = 'bg-teal-500';
          }
          
          return { ...category, icon, color };
        });
        
        setCategories(categoriesWithIcons);
        if (categoriesWithIcons.length > 0) {
          setSelectedCategory(categoriesWithIcons[0]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Waste Categories</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Understanding the different types of medical waste is crucial for proper disposal and safety. Browse through the categories below to learn more.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-3 text-white">
              <h2 className="font-bold">Waste Categories</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      selectedCategory?.name === category.name
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className={`${category.color} text-white p-2 rounded-lg`}>
                      {category.icon}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedCategory ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`${selectedCategory.color} px-6 py-4 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    {selectedCategory.icon}
                  </div>
                  <h2 className="text-xl font-bold">{selectedCategory.name}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                  <p className="text-gray-700 mb-6">{selectedCategory.description}</p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Disposal Guidelines</h3>
                  <DisposalGuidelines category={selectedCategory.name} />
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Safety Considerations</h3>
                  <SafetyConsiderations category={selectedCategory.name} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              <p>Select a category to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DisposalGuidelines: React.FC<{ category: string }> = ({ category }) => {
  
  switch (category) {
    case 'Infectious Waste':
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Place in red biohazard bags or containers labeled with the biohazard symbol</li>
          <li>Do not compress bags to prevent punctures or tears</li>
          <li>Keep containers sealed when not in use</li>
          <li>Must be treated via incineration or autoclaving before final disposal</li>
        </ul>
      );
    case 'Pathological Waste':
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Place in red biohazard bags within leak-proof containers</li>
          <li>Must be refrigerated if stored more than 24 hours</li>
          <li>Requires incineration as the primary disposal method</li>
          <li>Some tissues may require special religious or cultural consideration</li>
        </ul>
      );
    case 'Sharps':
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Must be placed in puncture-resistant containers with the biohazard symbol</li>
          <li>Containers should be sealed when 3/4 full</li>
          <li>Never bend, break, or recap needles</li>
          <li>Containers require treatment by incineration or alternative methods</li>
        </ul>
      );
    case 'Pharmaceutical Waste':
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Separate into hazardous and non-hazardous categories</li>
          <li>Place in designated containers, often blue in color</li>
          <li>Never flush drugs down toilets or drains</li>
          <li>Controlled substances require special disposal procedures</li>
        </ul>
      );
    case 'Chemical Waste':
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Store in compatible containers labeled with chemical contents</li>
          <li>Keep acids and bases separate</li>
          <li>Follow specific disposal methods based on chemical properties</li>
          <li>Maintain safety data sheets for all chemicals</li>
        </ul>
      );
    case 'Radioactive Waste':
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Store in shielded containers with radiation warning symbols</li>
          <li>Segregate by half-life and radiation type</li>
          <li>Short-lived isotopes may be stored for decay</li>
          <li>Disposal must comply with nuclear regulatory requirements</li>
        </ul>
      );
    default:
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Dispose of in regular black bags if not contaminated</li>
          <li>Recycle appropriate materials whenever possible</li>
          <li>Follow local waste disposal regulations</li>
          <li>When in doubt, treat as infectious waste</li>
        </ul>
      );
  }
};

const SafetyConsiderations: React.FC<{ category: string }> = ({ category }) => {
  // Mock safety considerations based on category
  switch (category) {
    case 'Infectious Waste':
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Always wear appropriate PPE (gloves, gown, face shield) when handling</li>
            <li>Practice proper hand hygiene after handling, even when wearing gloves</li>
            <li>Keep waste contained to prevent exposure to pathogens</li>
            <li>Report any spills immediately and follow facility protocols</li>
          </ul>
        </div>
      );
    case 'Pathological Waste':
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Use nitrile gloves and protective clothing when handling</li>
            <li>Minimize time spent handling to reduce exposure risk</li>
            <li>Follow specific protocols for handling large tissue specimens</li>
            <li>Be aware of psychological impacts when handling recognizable body parts</li>
          </ul>
        </div>
      );
    case 'Sharps':
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Never attempt to retrieve items from sharps containers</li>
            <li>Keep sharps containers away from public areas and children</li>
            <li>In case of needlestick, flush the area and report immediately</li>
            <li>Use safe devices with engineered sharps injury protections when available</li>
          </ul>
        </div>
      );
    case 'Pharmaceutical Waste':
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Follow specific handling procedures for hazardous drugs</li>
            <li>Use appropriate PPE based on medication hazard classification</li>
            <li>Be aware of exposure risks from powders and aerosolized medications</li>
            <li>Maintain accurate inventory of disposed controlled substances</li>
          </ul>
        </div>
      );
    case 'Chemical Waste':
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Know emergency procedures for chemical spills</li>
            <li>Store incompatible chemicals separately</li>
            <li>Use appropriate respirators when handling volatile chemicals</li>
            <li>Be aware of fire and explosion hazards with certain chemicals</li>
          </ul>
        </div>
      );
    case 'Radioactive Waste':
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Minimize exposure time, maximize distance, and use shielding</li>
            <li>Wear radiation dosimeters when handling</li>
            <li>Follow specific decontamination procedures after handling</li>
            <li>Regular monitoring for radiation levels in storage areas</li>
          </ul>
        </div>
      );
    default:
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Handle with care even if non-hazardous</li>
            <li>Follow facility waste segregation protocols</li>
            <li>Report any suspicious or unidentified waste</li>
            <li>When in doubt about safety, consult waste management specialists</li>
          </ul>
        </div>
      );
  }
};

export default Categories;