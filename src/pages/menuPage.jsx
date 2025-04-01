import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../pages/firebasePage';

const WeeklyMenuPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [likedMeals, setLikedMeals] = useState({});
  const [dislikedMeals, setDislikedMeals] = useState({});
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const allRecipes = querySnapshot.docs.map(doc => doc.data());

      if (allRecipes.length === 0) {
        console.warn("No recipes found in Firestore");
        setMenuData({});
        setLoading(false);
        return;
      }

      const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const randomizedMenu = {};

      weekDays.forEach(day => {
        randomizedMenu[day] = {
          lunch: allRecipes[Math.floor(Math.random() * allRecipes.length)],
          dinner: allRecipes[Math.floor(Math.random() * allRecipes.length)],
        };
      });

      setMenuData(randomizedMenu);
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <div className="text-xl font-bold">{formatDate(currentDate)}</div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800" onClick={() => navigate('/pantry')}>Pantry</button>
          <button className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800" onClick={() => navigate('/recipes')}>Recipe Database</button>
          <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700" onClick={fetchAndAssignMenu}>Shuffle Menu</button>
        </div>
      </div>

      <div className="flex-grow p-6 overflow-auto">
        <div className="rounded-lg shadow bg-white overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading menu...</div>
          ) : (
            <table className="min-w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="w-24 p-3 bg-[#f5e8d5] text-gray-800 border text-left">Meal</th>
                  {daysOfWeek.map((date, index) => {
                    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                    return (
                      <th key={index} className="w-1/7 p-3 text-center font-semibold border bg-[#f5e8d5] text-gray-800">
                        <div>{day}</div>
                        <div className="text-sm text-gray-600">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {['lunch', 'dinner'].map((mealType) => (
                  <tr key={mealType} className="h-40">
                    <td className="w-24 p-3 font-medium bg-gray-50 text-gray-600 border capitalize">{mealType}</td>
                    {daysOfWeek.map((date, index) => {
                      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const isCurrentDay = date.toDateString() === currentDate.toDateString();
                      const mealId = `${day}-${mealType}`;
                      const isLiked = likedMeals[mealId];
                      const isDisliked = dislikedMeals[mealId];
                      const meal = menuData[day]?.[mealType];
                      return (
                        <td key={index} className={`p-3 text-center border ${isCurrentDay ? 'bg-blue-50' : ''}`}>
                          <div className="flex flex-col items-center h-full justify-between">
                            <div className="flex flex-col items-center">
                              <div className="w-24 h-24 flex items-center justify-center mb-2">
                                {meal?.image ? (
                                  <img src={meal.image} alt={meal.title} className="w-20 h-16 object-cover rounded" />
                                ) : (
                                  <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                                )}
                              </div>
                              <span className="font-medium">{meal?.title || 'No Meal Assigned'}</span>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <button onClick={() => handleLike(day, mealType)} className={`p-1 rounded ${isLiked ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>👍</button>
                              <button onClick={() => handleDislike(day, mealType)} className={`p-1 rounded ${isDisliked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>👎</button>
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