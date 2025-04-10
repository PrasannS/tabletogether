import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PantryPage = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    perishable: false,
    organic: false,
    refrigerated: false,
    lowStock: false,
  });
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data
  const mockIngredients = [
    {
      id: 1,
      name: 'Organic Carrots',
      quantity: 12,
      unit: 'pieces',
      perishable: true,
      organic: true,
      refrigerated: true,
      lowStock: false,
      image: '/api/placeholder/200/150'
    },
    {
      id: 2,
      name: 'All-Purpose Flour',
      quantity: 4,
      unit: 'cups',
      perishable: false,
      organic: false,
      refrigerated: false,
      lowStock: false,
      image: '/api/placeholder/200/150'
    },
    {
      id: 3,
      name: 'Greek Yogurt',
      quantity: 1,
      unit: 'container',
      perishable: true,
      organic: false,
      refrigerated: true,
      lowStock: true,
      image: '/api/placeholder/200/150'
    },
    {
      id: 4,
      name: 'Organic Quinoa',
      quantity: 3,
      unit: 'cups',
      perishable: false,
      organic: true,
      refrigerated: false,
      lowStock: false,
      image: '/api/placeholder/200/150'
    },
    {
      id: 5,
      name: 'Ground Beef',
      quantity: 0.5,
      unit: 'lbs',
      perishable: true,
      organic: false,
      refrigerated: true,
      lowStock: true,
      image: '/api/placeholder/200/150'
    },
    {
      id: 6,
      name: 'Organic Honey',
      quantity: 2,
      unit: 'tbsp',
      perishable: false,
      organic: true,
      refrigerated: false,
      lowStock: true,
      image: '/api/placeholder/200/150'
    }
  ];

  useEffect(() => {
    const searchIngredients = () => {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        let filteredIngredients = [...mockIngredients];

        // Search query filter
        if (query) {
          filteredIngredients = filteredIngredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(query.toLowerCase())
          );
        }

        // Apply filters
        Object.keys(filters).forEach(filter => {
          if (filters[filter]) {
            filteredIngredients = filteredIngredients.filter(ingredient => ingredient[filter]);
          }
        });

        setIngredients(filteredIngredients);
        setLoading(false);
      }, 500);
    };

    searchIngredients();
  }, [query, filters]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
        <div className="bg-[#455932] text-white px-6 py-3 rounded-xl shadow-md text-center mb-6">
          <h1 className="text-3xl font-bold">Pantry</h1>
        </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={query}
          onChange={handleQueryChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 "
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="text-lg font-medium mr-2">Category Filters:</div>
        {Object.keys(filters).map((filter) => {
          const activeColors = {
            perishable: 'bg-orange-500 text-white',
            organic: 'bg-green-600 text-white',
            refrigerated: 'bg-blue-500 text-white',
            lowStock: 'bg-red-500 text-white',
          };

          const isActive = filters[filter];
          const classes = isActive
            ? activeColors[filter] || 'bg-gray-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

          return (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${classes}`}
            >
              {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-4">Loading pantry items...</div>}

      {/* Error */}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      {/* Results */}
      <div className="space-y-4">
        {!loading && ingredients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No ingredients found. Try adjusting your search or filters.
          </div>
        )}

        {ingredients.map(ingredient => (
          <div key={ingredient.id} className="flex border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-[#f5f8f2]">
            <div className="w-1/3 max-w-xs bg-gray-200">
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <h2 className="text-xl font-semibold mb-2">{ingredient.name}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {ingredient.perishable && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Perishable</span>
                )}
                {ingredient.organic && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Organic</span>
                )}
                {ingredient.refrigerated && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Refrigerated</span>
                )}
                {ingredient.lowStock && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Low Stock</span>
                )}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> in stock
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PantryPage;
