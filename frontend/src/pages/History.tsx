import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Image as ImageIcon,
  Search,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ClassificationResult {
  id: string;
  user_id: string;
  filename: string;          
  top_category: string;
  confidence: number;
  all_predictions: { category: string; confidence: number }[];
  created_at: string; 
}

const ADMIN_EMAIL = 'admin@gmail.com';

const History: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const isAdmin = user?.email === ADMIN_EMAIL;

  /* ------------------------------------------------------------------ */
  /*  Fetch history from Supabase                                       */
  /* ------------------------------------------------------------------ */
  const fetchHistory = useCallback(async () => {
    if (!user?.id) return; // wait until auth resolves

    setLoading(true);

    let query = supabase
      .from('classification_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    console.log("Fetched user:", user);
    console.log("User ID:", user?.id);

    console.log('Supabase response:', { data, error }); // debug

    if (error) {
      console.error('Error fetching history:', error.message);
    } else {
      setHistory((data as ClassificationResult[]) ?? []);
    }

    setLoading(false);
  }, [user, isAdmin]);

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  /* ------------------------------------------------------------------ */
  /*  Mutations                                                         */
  /* ------------------------------------------------------------------ */
  const clearHistory = async () => {
    if (
      !window.confirm(
        'Are you sure you want to clear your classification history?'
      )
    )
      return;

    if (isAdmin) {
      alert('Admin cannot clear the entire history table.');
      return;
    }

    const { error } = await supabase
      .from('classification_history')
      .delete()
      .eq('user_id', user!.id);

    if (error) console.error(error.message);
    await fetchHistory();
  };

  const deleteHistoryItem = async (id: string) => {
    const { error } = await supabase
      .from('classification_history')
      .delete()
      .eq('id', id);

    if (error) console.error(error.message);
    await fetchHistory();
  };

  /* ------------------------------------------------------------------ */
  /*  Client-side search & filter                                       */
  /* ------------------------------------------------------------------ */
  const filtered = history.filter((item) => {
    const matches =
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.top_category.toLowerCase().includes(searchTerm.toLowerCase());

    return filter === 'all'
      ? matches
      : matches && item.top_category === filter;
  });

  const categories = [...new Set(history.map((h) => h.top_category))];

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Clock className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Classification History
          </h1>
          <p className="text-gray-600">
            View your previous image classifications and their results
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={clearHistory}
            className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            disabled={history.length === 0}
          >
            <Trash2 size={18} />
            Clear History
          </button>
        )}
      </div>

      {/* Empty state */}
      {history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-gray-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Clock className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Classification History
          </h2>
          <p className="text-gray-600 mb-6">
            Your previous image classifications will appear here after you
            classify some images.
          </p>
          <Link
            to="/classify"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <ImageIcon size={18} /> Classify an Image
          </Link>
        </div>
      ) : (
        <>
          {/* Search + Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by filename or category"
                  className="pl-10 input w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="input w-full md:w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Filename</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Confidence</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {item.filename}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.top_category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isAdmin && (
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete this record"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default History;


// import React, { useState, useEffect } from 'react';
// import { Trash2, Image, Search, Clock } from 'lucide-react';

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

// const History: React.FC = () => {
//   const [history, setHistory] = useState<ClassificationResult[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState<string>('all');

//   useEffect(() => {
//     // Load history from localStorage
//     const savedHistory = localStorage.getItem('classificationHistory');
//     if (savedHistory) {
//       setHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   const clearHistory = () => {
//     if (window.confirm('Are you sure you want to clear your classification history?')) {
//       localStorage.removeItem('classificationHistory');
//       setHistory([]);
//     }
//   };

//   const deleteHistoryItem = (index: number) => {
//     const updatedHistory = [...history];
//     updatedHistory.splice(index, 1);
//     localStorage.setItem('classificationHistory', JSON.stringify(updatedHistory));
//     setHistory(updatedHistory);
//   };

//   const formatDate = (timestamp: number) => {
//   const date = new Date(timestamp < 1000000000000 ? timestamp * 1000 : timestamp);
//   return date.toLocaleString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });
// };



//   const filteredHistory = history.filter((item) => {
//     const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          item.top_category.toLowerCase().includes(searchTerm.toLowerCase());
    
//     if (filter === 'all') return matchesSearch;
//     return matchesSearch && item.top_category === filter;
//   });

//   // Get unique categories
//   const categories = [...new Set(history.map(item => item.top_category))];

//   return (
//     <div className="max-w-5xl mx-auto">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Classification History</h1>
//           <p className="text-gray-600">
//             View your previous image classifications and their results
//           </p>
//         </div>
        
//         <button 
//           onClick={clearHistory}
//           className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
//           disabled={history.length === 0}
//         >
//           <Trash2 size={18} />
//           Clear History
//         </button>
//       </div>

//       {history.length === 0 ? (
//         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//           <div className="bg-gray-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
//             <Clock className="h-8 w-8 text-gray-500" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">No Classification History</h2>
//           <p className="text-gray-600 mb-6">
//             Your previous image classifications will appear here after you classify some medical waste images.
//           </p>
//           <a href="/classify" className="btn btn-primary inline-flex items-center gap-2">
//             <Image size={18} />
//             Classify an Image
//           </a>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search by filename or category"
//                   className="pl-10 input w-full"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <select
//                   className="input w-full md:w-auto"
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                 >
//                   <option value="all">All Categories</option>
//                   {categories.map((category, idx) => (
//                     <option key={idx} value={category}>{category}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {filteredHistory.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-6 text-center">
//               <p className="text-gray-600">No results match your search criteria</p>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Filename
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Classification
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Confidence
//                     </th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredHistory.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {formatDate(item.timestamp)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.filename}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {item.top_category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {(item.confidence * 100).toFixed(1)}%
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => deleteHistoryItem(index)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete this record"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default History;