import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../pages/firebasePage';
import { setDoc, doc } from "firebase/firestore";

const WeeklyMenuPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [likedMeals, setLikedMeals] = useState({});
  const [dislikedMeals, setDislikedMeals] = useState({});
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const location = useLocation();
  const edrecipe = location.state?.edrecipe || null;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysOfWeek = () => {
    const today = new Date();
    const day = today.getDay();
    return Array(7).fill().map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - day + i);
      return date;
    });
  };

  const daysOfWeek = getDaysOfWeek();

  // Get the start of the current week for consistent menu identification
  const getWeekStartDate = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = today.getDate() - day;
    const startOfWeek = new Date(today.setDate(diff));
    return startOfWeek.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const fetchAndAssignMenu = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current week identifier
      const currentWeek = getWeekStartDate();
      console.log("Current week identifier:", currentWeek);

      // Check if a menu exists for this week
      const menusRef = collection(db, "menus");
      const querySnapshot = await getDocs(menusRef);
      console.log("Retrieved menus count:", querySnapshot.docs.length);
      
      // Log all available menu documents for debugging
      querySnapshot.docs.forEach(doc => {
        console.log("Available menu:", doc.id);
      });
      
      const menuDoc = querySnapshot.docs.find(doc => doc.id === currentWeek);
      
      if (menuDoc) {
        console.log("Menu found for this week:", menuDoc.data());
        const menu = menuDoc.data();
        
        // Handle edited recipe if present
        if (edrecipe) {
          const day = edrecipe[0];
          const mealType = edrecipe[1];
          const recipe = edrecipe[2];
          
          console.log("Updating menu with edited recipe:", { day, mealType, recipe });
          
          // Create a deep copy of the menu to avoid reference issues
          const updatedMenu = JSON.parse(JSON.stringify(menu));
          updatedMenu[day][mealType] = recipe;
          
          try {
            await setDoc(doc(db, "menus", currentWeek), updatedMenu);
            console.log("Menu updated in Firestore successfully");
            setMenuData(updatedMenu);
          } catch (updateError) {
            console.error("Error updating menu:", updateError);
            setError("Failed to update menu with edited recipe");
            setMenuData(menu); // Use original menu
          }
        } else {
          setMenuData(menu);
        }
      } else {
        console.log("No menu found for this week. Generating new menu...");
        
        // Fetch all recipes
        const recipesSnapshot = await getDocs(collection(db, "recipes"));
        const allRecipes = recipesSnapshot.docs.map(doc => doc.data());
        console.log("Retrieved recipes count:", allRecipes.length);
        
        if (allRecipes.length === 0) {
          console.warn("No recipes found in Firestore");
          setError("No recipes found in database");
          setMenuData({});
          setLoading(false);
          return;
        }

        // Log recipe types for debugging
        const mealTypes = allRecipes.map(r => r.mealType);
        console.log("Available meal types:", [...new Set(mealTypes)]);
        
        // Separate recipes by mealType
        const lunchRecipes = allRecipes.filter(recipe => recipe.mealType === 'lunch');
        const dinnerRecipes = allRecipes.filter(recipe => recipe.mealType === 'dinner');
        
        console.log("Lunch recipes:", lunchRecipes.length);
        console.log("Dinner recipes:", dinnerRecipes.length);
        
        if (lunchRecipes.length === 0 || dinnerRecipes.length === 0) {
          setError("Not enough recipes available for both lunch and dinner");
          setLoading(false);
          return;
        }

        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const randomizedMenu = {};

        // Generate menu for each day
        weekDays.forEach(day => {
          // Get random lunch and dinner
          const lunch = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
          const dinner = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)];
          
          randomizedMenu[day] = {
            lunch: lunch,
            dinner: dinner,
          };
        });

        console.log("Generated randomized menu:", randomizedMenu);
        
        // Save to Firestore
        try {
          await setDoc(doc(db, "menus", currentWeek), randomizedMenu);
          console.log("Menu saved to Firestore successfully");
          setMenuData(randomizedMenu);
        } catch (saveError) {
          console.error("Error saving menu to Firestore:", saveError);
          setError("Failed to save generated menu");
          setMenuData(randomizedMenu); // Still use the generated menu even if saving failed
        }
      }
    } catch (error) {
      console.error("Error in fetchAndAssignMenu:", error);
      setError(`Failed to load menu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndAssignMenu();
  }, []);

  const handleLike = (day, mealType) => {
    const mealId = `${day}-${mealType}`;
    setLikedMeals(prev => {
      if (prev[mealId]) {
        const newLiked = {...prev};
        delete newLiked[mealId];
        return newLiked;
      }
      return {...prev, [mealId]: true};
    });
    setDislikedMeals(prev => {
      if (prev[mealId]) {
        const newDisliked = {...prev};
        delete newDisliked[mealId];
        return newDisliked;
      }
      return prev;
    });
  };

  const handleDislike = (day, mealType) => {
    const mealId = `${day}-${mealType}`;
    setDislikedMeals(prev => {
      if (prev[mealId]) {
        const newDisliked = {...prev};
        delete newDisliked[mealId];
        return newDisliked;
      }
      return {...prev, [mealId]: true};
    });
    setLikedMeals(prev => {
      if (prev[mealId]) {
        const newLiked = {...prev};
        delete newLiked[mealId];
        return newLiked;
      }
      return prev;
    });
  };

  const editRecipe = (day_, mealType_) => {
    const meal = menuData[day_]?.[mealType_];
    console.log("Going to recipes for editing:", { day: day_, mealType: mealType_, meal });
    navigate('/recipes', { state: { editmode: true, mdata: {mealtype: mealType_, day: day_} } });
  };

  // Helper function to safely get recipe title/name
  const getRecipeName = (meal) => {
    if (!meal) return "No meal planned";
    return meal.title || meal.name || "Unnamed Recipe";
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f8f2]">
      <div className="flex justify-between items-center p-4 bg-[#6d8d4f] text-white">
        <div className="text-xl">{formatDate(currentDate)}</div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-[#394929] rounded hover:bg-blue-300" onClick={fetchAndAssignMenu}>Shuffle Menu</button>
        </div>
      </div>

      <div className="flex-grow p-6 overflow-auto">
        <div className="rounded-lg shadow bg-[#fffefc] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading menu...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <div className="mb-2">Error loading menu</div>
              <div>{error}</div>
              <button 
                onClick={fetchAndAssignMenu} 
                className="mt-4 px-4 py-2 bg-[#6d8d4f] text-white rounded hover:bg-[#5c7a41]"
              >
                Try Again
              </button>
            </div>
          ) : (
            <table className="min-w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="w-1/8 p-3 bg-[#455932] text-gray-100 border text-left">Meal</th>
                  {daysOfWeek.map((date, index) => {
                    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                    return (
                      <th key={index} className="w-1/8 p-3 text-center border bg-[#455932]">
                        <div className="text-gray-100">{day}</div>
                        <div className="text-sm text-gray-200">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {['lunch', 'dinner'].map((mealType) => (
                  <tr key={mealType} className="h-64">
                    <td className="w-24 p-3 bg-[#455932] text-gray-200 border capitalize">{mealType}</td>
                    {daysOfWeek.map((date, index) => {
                      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const isCurrentDay = date.toDateString() === currentDate.toDateString();
                      const mealId = `${day}-${mealType}`;
                      const isLiked = likedMeals[mealId];
                      const isDisliked = dislikedMeals[mealId];
                      const meal = menuData[day]?.[mealType];
                      
                      // Debug the meal data
                      if (isCurrentDay) {
                        console.log(`Current day meal (${day}, ${mealType}):`, meal);
                      }
                      
                      return (
                        <td key={index} className={`p-3 align-top border ${isCurrentDay ? 'bg-blue-50' : ''} h-64`}>
                          <div className="flex flex-col justify-between h-full">
                            <div>
                              <div className="w-32 h-32 flex items-center justify-center mb-3 mx-auto">
                                {meal?.image ? (
                                  <img src={meal.image} alt={getRecipeName(meal)} className="w-28 h-28 object-cover rounded" />
                                ) : (
                                  <div className="w-28 h-28 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                                )}
                              </div>
                              <span className="font-normal text-center text-black block">{getRecipeName(meal)}</span>
                            </div>
							
                            <div className="flex-grow" />

                            <div className="flex flex-col items-center mt-4">
							<div className="flex justify-center space-x-2 mb-2">
								<button
									onClick={() => handleLike(day, mealType)}
									className={`p-1 rounded border transition 
									${isLiked ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-300 text-gray-500 hover:bg-green-50'}`}
								>
									👍
								</button>
								<button
									onClick={() => handleDislike(day, mealType)}
									className={`p-1 rounded border transition 
									${isDisliked ? 'bg-red-100 border-red-400 text-red-700' : 'bg-white border-gray-300 text-gray-500 hover:bg-red-50'}`}
								>
									👎
								</button>
							</div>
                              {meal && (
                                <>
                                  <button
                                    onClick={() => navigate('/viewer', { state: { recipe: meal } })}
                                    className="px-3 py-1 bg-[#dde6d5] rounded-full text-sm transition mb-2"
                                  >
                                    View More
                                  </button>
                                  <button
                                    onClick={() => editRecipe(day, mealType)}
                                    className="px-3 py-1 bg-[#dde6d5] rounded-full text-sm transition"
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                              {!meal && (
                                <button
                                  onClick={() => editRecipe(day, mealType)}
                                  className="px-3 py-1 text-green-600 bg-green-50 hover:bg-green-100 rounded-full text-sm transition"
                                >
                                  Add Meal
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyMenuPage;