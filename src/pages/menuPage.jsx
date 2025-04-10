import React, { useState, useEffect } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../pages/firebasePage';
import { setDoc, doc } from "firebase/firestore"; // Import setDoc and doc

const WeeklyMenuPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [likedMeals, setLikedMeals] = useState({});
  const [dislikedMeals, setDislikedMeals] = useState({});
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);
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

  const fetchAndAssignMenu = async () => {
    setLoading(true);

    // check "menus" collection to see if there is a menu for this week
    const menusRef = collection(db, "menus");
    const querySnapshot = await getDocs(menusRef);
    const currentWeek = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const menuDoc = querySnapshot.docs.find(doc => doc.id === currentWeek);
    if (menuDoc) {
      console.log("Menu found for this week:", menuDoc.data());
      // if there is a menu for this week, assign it to menuData
      const menu = menuDoc.data();
      // if edrecipe is not null, then check if it's in the menu for that day / meal
      // if not then update menu in the database
      if (edrecipe) {
        const day = edrecipe[0];
        const mealType = edrecipe[1];
        const meal = menu[day][mealType];
        if (meal && meal.name !== edrecipe[2].name) {
          console.log("Updating menu with new recipe:", edrecipe);
          menu[day][mealType] = edrecipe[2];
          await setDoc(doc(menusRef, currentWeek), menu);
          console.log("Menu updated in Firestore:", menu);
        }
      }

      setMenuData(menu);
      setLoading(false);
      

      return;
    }
    // if not, fetch recipes from "recipes" collection and assign to menu
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const allRecipes = querySnapshot.docs.map(doc => doc.data());

      
      if (allRecipes.length === 0) {
        console.warn("No recipes found in Firestore");
        setMenuData({});
        setLoading(false);
        return;
      }

      // Separate recipes by mealType
      const lunchRecipes = allRecipes.filter(recipe => recipe.mealType === 'lunch');
      const dinnerRecipes = allRecipes.filter(recipe => recipe.mealType === 'dinner');

      const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const randomizedMenu = {};

      // TODO need a way for this to not be random every time

      weekDays.forEach(day => {
        randomizedMenu[day] = {
          lunch: lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)],
          dinner: dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)],
        };
      });

      setMenuData(randomizedMenu);
      // Save the generated menu to Firestore
      const menusRef = collection(db, "menus");
      await setDoc(doc(menusRef, currentWeek), randomizedMenu);
      console.log("Menu saved to Firestore:", randomizedMenu);
    
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
    setLoading(false);
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

  // Logic to edit a recipe used in the menu (overlaid popup that will show a search bar with other recipes, and upon selection will replace initial selected recipe)
  const editRecipe = (day_, mealType_) => {
    const meal = menuData[day_]?.[mealType_];
    console.log("Going to recipes");
    if (meal) {
      navigate('/recipes', { state: { editmode: true, mdata: {mealtype: mealType_, day: day_} } });
    }
  }


  return (
    <div className="flex flex-col h-screen bg-[#f5f8f2]">
      <div className="flex justify-between items-center p-4 bg-[#6d8d4f] text-white">
        <div className="text-xl font-bold">{formatDate(currentDate)}</div>
        <div className="flex space-x-4 bg-">
          <button className="px-4 py-2 bg-[#394929] rounded hover:bg-blue-300" onClick={() => navigate('/pantry')}>Pantry</button>
          <button className="px-4 py-2 bg-[#394929] rounded hover:bg-blue-300" onClick={() => navigate('/recipes')}>Recipe Database</button>
          <button className="px-4 py-2 bg-[#394929] rounded hover:bg-blue-300" onClick={fetchAndAssignMenu}>Shuffle Menu</button>
        </div>
      </div>

      <div className="flex-grow p-6 overflow-auto">
        <div className="rounded-lg shadow bg-[#f1f5ed] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-">Loading menu...</div>
          ) : (
            <table className="min-w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="w-1/8 p-3 bg-[#455932] text-gray-100 border text-left">Meal</th>
                  {daysOfWeek.map((date, index) => {
                    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                    return (
                      <th key={index} className="w-1/8 p-3 text-center font-semibold border bg-[#455932]">
                        <div>{day}</div>
                        <div className="text-sm text-gray-200">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {['lunch', 'dinner'].map((mealType) => (
                  <tr key={mealType} className=" h-64">
                    <td className="w-24 p-3 font-bold medium bg-[#455932] text-gray-200 border capitalize">{mealType}</td>
                    {daysOfWeek.map((date, index) => {
                      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const isCurrentDay = date.toDateString() === currentDate.toDateString();
                      const mealId = `${day}-${mealType}`;
                      const isLiked = likedMeals[mealId];
                      const isDisliked = dislikedMeals[mealId];
                      const meal = menuData[day]?.[mealType];
                      return (
                        <td key={index} className={`p-3 align-top border ${isCurrentDay ? 'bg-blue-50' : ''} h-64`}>
							<div className="flex flex-col justify-between h-full">
								<div>
								<div className="w-32 h-32 flex items-center justify-center mb-3 mx-auto">
									{meal?.image ? (
									<img src={meal.image} alt={meal.title} className="w-28 h-28 object-cover rounded" />
									) : (
									<div className="w-28 h-28 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
									)}
								</div>
								<span className="font-medium text-center text-black block">{meal?.title || meal?.name}</span>
								<div className="flex justify-center space-x-2 mt-2">
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
								</div>

								{/* Spacer to push buttons down */}
								<div className="flex-grow" />

								<div className="flex flex-col items-center mt-4">
								<button
									onClick={() => navigate('/viewer', { state: { recipe: meal } })}
									className="px-3 py-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full text-sm transition"
									>
									View More
									</button>

									<button
									onClick={() => editRecipe(day, mealType)}
									className="px-3 py-1 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-full text-sm transition"
									>
									Edit
									</button>
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