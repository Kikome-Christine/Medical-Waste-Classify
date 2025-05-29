import React, { useCallback } from 'react';
import { GoogleMap, useLoadScript, useJsApiLoader,  MarkerF } from '@react-google-maps/api';
import { MapPin, Phone, Clock, Info } from 'lucide-react';


const containerStyle = {
  width: '100%',
  height: '500px',
};

const disposalSites = [
  {
    name: "Nakasero Hospital Medical Waste Facility",
    location: "Plot 14A, Nakasero Road, Kampala",
    coordinates: { lat: 0.3136, lng: 32.5833 },
    phone: "+256 414 346 153",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    type: ["Infectious Waste", "Sharps", "Pharmaceutical Waste"],
    description: "State-of-the-art medical waste disposal facility with autoclave sterilization."
  },
  {
    name: "Mulago Hospital Waste Management Center",
    location: "Upper Mulago Hill, Kampala",
    coordinates: { lat: 0.3378, lng: 32.5763 },
    phone: "+256 414 554 001",
    hours: "24/7 Operation",
    type: ["All Medical Waste Categories"],
    description: "Largest medical waste processing center in Uganda."
  },
  {
    name: "Green Waste Solutions Uganda",
    location: "Jinja Road Industrial Area, Kampala",
    coordinates: { lat: 0.3225, lng: 32.6103 },
    phone: "+256 757 123 456",
    hours: "Mon-Sat: 7:00 AM - 6:00 PM",
    type: ["Chemical Waste", "Pharmaceutical Waste"],
    description: "Environmental-friendly waste management facility."
  },
  {
    name: "Mbarara Regional Waste Treatment",
    location: "Mbarara-Kabale Road",
    coordinates: { lat: -0.6167, lng: 30.6500 },
    phone: "+256 485 660 123",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM",
    type: ["Infectious Waste", "Pathological Waste"],
    description: "Regional facility serving Western Uganda."
  },
  {
    name: "Gulu Medical Waste Center",
    location: "Gulu-Kampala Road",
    coordinates: { lat: 2.7747, lng: 32.2990 },
    phone: "+256 471 432 100",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    type: ["General Medical Waste", "Infectious Waste"],
    description: "Northern Uganda's primary medical waste facility."
  }
];

const DisposalSites: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCeCxAuv6LQc3RXvSgvgvqKJcOlJqaHvIo',
  });
  
const handleLoad = useCallback((map: google.maps.Map) => {
  const bounds = new window.google.maps.LatLngBounds();
  disposalSites.forEach((m) => bounds.extend(m.coordinates));
  map.fitBounds(bounds);
}, []);

  
  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Error Loading Map</h2>
        <p>Unable to load Google Maps. Please try again later.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Waste Disposal Sites</h1>
        <p className="text-lg text-gray-600">
          Find authorized medical waste disposal facilities across Uganda
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={handleLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {disposalSites.map((site, index) => (
            <MarkerF
              key={index}
              position={site.coordinates}
              title={site.name}
            />
          ))}
        </GoogleMap>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {disposalSites.map((site, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">{site.name}</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">{site.location}</p>
                  <p className="text-sm text-gray-500">
                    {site.coordinates.lat.toFixed(4)}°, {site.coordinates.lng.toFixed(4)}°
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <p className="text-gray-800">{site.phone}</p>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <p className="text-gray-800">{site.hours}</p>
              </div>

              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="mb-2">
                    <p className="font-medium text-gray-800">Accepted Waste Types:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {site.type.map((type, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{site.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Transport Guidelines</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Use approved containers for different waste types</li>
              <li>Ensure proper labeling and documentation</li>
              <li>Follow designated transport routes</li>
              <li>Maintain temperature control for certain waste types</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Emergency Contacts</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Emergency Hotline: +256 800 100 066</li>
              <li>Environmental Authority: +256 414 251 064</li>
              <li>Health Ministry Waste Management: +256 414 340 874</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisposalSites;

// import React, { useCallback } from 'react';
// import { GoogleMap, useLoadScript, useJsApiLoader,  MarkerF } from '@react-google-maps/api';
// import { MapPin, Phone, Clock, Info } from 'lucide-react';


// const containerStyle = {
//   width: '100%',
//   height: '500px',
// };

// const disposalSites = [
//   {
//     name: "Nakasero Hospital Medical Waste Facility",
//     location: "Plot 14A, Nakasero Road, Kampala",
//     coordinates: { lat: 0.3136, lng: 32.5833 },
//     phone: "+256 414 346 153",
//     hours: "Mon-Fri: 8:00 AM - 5:00 PM",
//     type: ["Infectious Waste", "Sharps", "Pharmaceutical Waste"],
//     description: "State-of-the-art medical waste disposal facility with autoclave sterilization."
//   },
//   {
//     name: "Mulago Hospital Waste Management Center",
//     location: "Upper Mulago Hill, Kampala",
//     coordinates: { lat: 0.3378, lng: 32.5763 },
//     phone: "+256 414 554 001",
//     hours: "24/7 Operation",
//     type: ["All Medical Waste Categories"],
//     description: "Largest medical waste processing center in Uganda."
//   },
//   {
//     name: "Green Waste Solutions Uganda",
//     location: "Jinja Road Industrial Area, Kampala",
//     coordinates: { lat: 0.3225, lng: 32.6103 },
//     phone: "+256 757 123 456",
//     hours: "Mon-Sat: 7:00 AM - 6:00 PM",
//     type: ["Chemical Waste", "Pharmaceutical Waste"],
//     description: "Environmental-friendly waste management facility."
//   },
//   {
//     name: "Mbarara Regional Waste Treatment",
//     location: "Mbarara-Kabale Road",
//     coordinates: { lat: -0.6167, lng: 30.6500 },
//     phone: "+256 485 660 123",
//     hours: "Mon-Fri: 8:00 AM - 4:00 PM",
//     type: ["Infectious Waste", "Pathological Waste"],
//     description: "Regional facility serving Western Uganda."
//   },
//   {
//     name: "Gulu Medical Waste Center",
//     location: "Gulu-Kampala Road",
//     coordinates: { lat: 2.7747, lng: 32.2990 },
//     phone: "+256 471 432 100",
//     hours: "Mon-Fri: 8:30 AM - 5:30 PM",
//     type: ["General Medical Waste", "Infectious Waste"],
//     description: "Northern Uganda's primary medical waste facility."
//   }
// ];

// const DisposalSites: React.FC = () => {
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: 'AIzaSyCeCxAuv6LQc3RXvSgvgvqKJcOlJqaHvIo',
//   });
  
// const handleLoad = useCallback((map: google.maps.Map) => {
//   const bounds = new window.google.maps.LatLngBounds();
//   disposalSites.forEach((m) => bounds.extend(m.coordinates));
//   map.fitBounds(bounds);
// }, []);

  
//   if (loadError) {
//     return (
//       <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
//         <h2 className="text-lg font-bold mb-2">Error Loading Map</h2>
//         <p>Unable to load Google Maps. Please try again later.</p>
//       </div>
//     );
//   }

//   if (!isLoaded) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading map...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto space-y-8">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Waste Disposal Sites</h1>
//         <p className="text-lg text-gray-600">
//           Find authorized medical waste disposal facilities across Uganda
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           onLoad={handleLoad}
//           options={{
//             streetViewControl: false,
//             mapTypeControl: false,
//           }}
//         >
//           {disposalSites.map((site, index) => (
//             <MarkerF
//               key={index}
//               position={site.coordinates}
//               title={site.name}
//             />
//           ))}
//         </GoogleMap>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {disposalSites.map((site, index) => (
//           <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
//               <h2 className="text-xl font-bold text-white">{site.name}</h2>
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-gray-500 mt-1" />
//                 <div>
//                   <p className="font-medium text-gray-800">{site.location}</p>
//                   <p className="text-sm text-gray-500">
//                     {site.coordinates.lat.toFixed(4)}°, {site.coordinates.lng.toFixed(4)}°
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Phone className="w-5 h-5 text-gray-500" />
//                 <p className="text-gray-800">{site.phone}</p>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <p className="text-gray-800">{site.hours}</p>
//               </div>

//               <div className="flex items-start gap-3">
//                 <Info className="w-5 h-5 text-gray-500 mt-1" />
//                 <div>
//                   <div className="mb-2">
//                     <p className="font-medium text-gray-800">Accepted Waste Types:</p>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       {site.type.map((type, idx) => (
//                         <span 
//                           key={idx}
//                           className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//                         >
//                           {type}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <p className="text-gray-700">{site.description}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Information</h2>
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Transport Guidelines</h3>
//             <ul className="list-disc pl-5 space-y-2 text-gray-700">
//               <li>Use approved containers for different waste types</li>
//               <li>Ensure proper labeling and documentation</li>
//               <li>Follow designated transport routes</li>
//               <li>Maintain temperature control for certain waste types</li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Emergency Contacts</h3>
//             <ul className="list-disc pl-5 space-y-2 text-gray-700">
//               <li>Emergency Hotline: +256 800 100 066</li>
//               <li>Environmental Authority: +256 414 251 064</li>
//               <li>Health Ministry Waste Management: +256 414 340 874</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DisposalSites;
