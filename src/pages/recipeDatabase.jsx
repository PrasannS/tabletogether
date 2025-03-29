import React, { useState, useEffect } from 'react';

const RecipeSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data to simulate API response
  const mockRecipes = [
    {
      id: 1,
      title: 'Vegetable Stir Fry',
      calories: 320,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true,
      image: '/api/placeholder/200/150'
    },
    {
      id: 2,
      title: 'Chicken Alfredo Pasta',
      calories: 650,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      image: '/api/placeholder/200/150'
    },
    {
      id: 3,
      title: 'Greek Salad',
      calories: 280,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false,
      image: '/api/placeholder/200/150'
    },
    {
      id: 4,
      title: 'Vegan Buddha Bowl',
      calories: 420,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true,
      image: '/api/placeholder/200/150'
    },
    {
      id: 5,
      title: 'Beef Burger',
      calories: 580,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      image: '/api/placeholder/200/150'
    },
    {
      id: 6,
      title: 'Gluten-Free Pancakes',
      calories: 340,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false,
      image: '/api/placeholder/200/150'
    }
  ];

  // Search and filter recipes
  useEffect(() => {
    const searchRecipes = () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API request delay
        setTimeout(() => {
          let filteredRecipes = [...mockRecipes];
          
          // Filter by search query
          if (query) {
            filteredRecipes = filteredRecipes.filter(recipe => 
              recipe.title.toLowerCase().includes(query.toLowerCase())
            );
          }
          
          // Apply dietary filters
          Object.keys(filters).forEach(filter => {
            if (filters[filter]) {
              filteredRecipes = filteredRecipes.filter(recipe => recipe[filter]);
            }
          });
          
          setRecipes(filteredRecipes);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again.');
        setLoading(false);
      }
    };
    
    searchRecipes();
  }, [query, filters]);

  // Handle search input change
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle filter toggle
  const handleFilterChange = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Finder</h1>
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={handleQueryChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Filter Options */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="text-lg font-medium mr-2">Dietary Filters:</div>
        {Object.keys(filters).map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters[filter]
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
      </div>
      
      {/* Loading State */}
      {loading && <div className="text-center py-4">Loading recipes...</div>}
      
      {/* Error State */}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      
      {/* Results */}
      <div className="space-y-4">
        {!loading && recipes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recipes found. Try adjusting your search or filters.
          </div>
        )}
        
        {recipes.map(recipe => (
          <div key={recipe.id} className="flex border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="w-1/3 max-w-xs bg-gray-200">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {recipe.vegetarian && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Vegetarian</span>
                )}
                {recipe.vegan && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Vegan</span>
                )}
                {recipe.glutenFree && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Gluten-Free</span>
                )}
                {recipe.dairyFree && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Dairy-Free</span>
                )}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">{recipe.calories}</span> calories per serving
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSearch;