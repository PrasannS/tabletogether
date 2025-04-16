import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { useNavigate , useLocation} from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { 
  getFirestore, 
  addDoc, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';


const RecipeSearch = () => {

  const firebaseConfig = {
    apiKey: "AIzaSyAPFn9zzoCufbohVJ5VDcUC6gBtPC7IB_o",
    authDomain: "tabletogether.firebaseapp.com",
    projectId: "tabletogether",
    storageBucket: "tabletogether.firebasestorage.app",
    messagingSenderId: "536905524696",
    appId: "1:536905524696:web:e93dcac6f4106ca8a73ead"
  };
  const navigate = useNavigate();
  

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


  const location = useLocation();
  const editMode = location.state?.editmode || false;
  console.log("Edit mode:", location.state?.editmode);

  const mdata = location.state?.mdata || null;

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipes from Firestore with live updates
  useEffect(() => {

    console.log();
    setLoading(true);
    setError(null);

    try {
      // Create a base query to the recipes collection
      const recipesRef = collection(db, 'recipes');
      
      // Apply filters to the query if any are active
      let firestoreQuery = query(recipesRef);
      
      // Construct array of conditions for Firestore query
      const activeFilters = Object.entries(filters)
        .filter(([_, isActive]) => isActive)
        .map(([filterName]) => filterName);

      // Apply live subscription to query results with onSnapshot
      const unsubscribe = onSnapshot(
        firestoreQuery,
        (querySnapshot) => {
          let fetchedRecipes = [];
          
          querySnapshot.forEach((doc) => {
            fetchedRecipes.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          // Apply text search filter client-side (Firestore doesn't support full-text search)
          if (searchQuery) {
            fetchedRecipes = fetchedRecipes.filter(recipe => 
              recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          
          // Apply dietary filters client-side if we couldn't do it in the query
          activeFilters.forEach(filter => {
            fetchedRecipes = fetchedRecipes.filter(recipe => recipe[filter] === true);
          });
          
          setRecipes(fetchedRecipes);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching recipes:", err);
          setError('Failed to fetch recipes. Please try again.');
          setLoading(false);
        }
      );
      
      // Cleanup the listener when component unmounts
      return () => unsubscribe();
      
    } catch (err) {
      console.error("Error setting up Firestore listener:", err);
      setError('Failed to connect to the database. Please try again.');
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Handle search input change
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter toggle
  const handleFilterChange = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const titleHandle = () => {
    if (editMode) {
      return <h1 className="text-3xl font-bold mb-6 text-center"> Select New Recipe</h1>;
    } else {
      return (
        <div className="bg-[#455932] text-white px-6 py-3 rounded-xl shadow-md text-center mb-6">
          <h1 className="text-3xl font-bold">Recipe Book</h1>
        </div>
      );
      
    }
  }

  const handleRecipeSelect = (recipe) => {
    // Handle recipe selection logic here
    console.log("Selected recipe:", recipe);
    if (editMode) {
      // Navigate to the viewer page with the selected recipe data
      navigate('/', { state: { edrecipe: [mdata.day, mdata.mealtype, recipe]} });
    } else {
      // Navigate to the viewer page with the selected recipe data
      navigate('/viewer', { state: { recipe: recipe } });
    }
  }
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-[#455932] mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back
      </button>
  
      {titleHandle()}  
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleQueryChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add Recipe Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/addrecipe')}
          className="text-white px-4 py-2 rounded-md hover:bg-[#6d8d4f] transition-colors bg-[#455932]"
        >
          Add New Recipe
        </button>
      </div>
      {/* Recipe Count */}
      
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
          <div key={recipe.id} className="flex border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-[#f5f8f2]">
            <div className="w-1/3 max-w-xs bg-gray-200">
              <img 
                src={recipe.image || '/api/placeholder/200/150'} 
                alt={recipe.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              {/* TODO unify name / title metadata */}
              <h2 className="text-xl font-semibold mb-2">{recipe.name || recipe.title}</h2>
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
              {/* Selection button */}
              <button
                onClick={() => handleRecipeSelect(recipe)}
                className="mt-4 bg-[#354426] text-white px-4 py-2 rounded-md hover:bg-[#6d8d4f] transition-colors"
              >
                {editMode ? 'Select Recipe' : 'View Recipe'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSearch;