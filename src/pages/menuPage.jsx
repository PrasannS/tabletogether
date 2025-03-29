import React, { useState, useEffect } from 'react';

const WeeklyMenuPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [likedMeals, setLikedMeals] = useState({});
  const [dislikedMeals, setDislikedMeals] = useState({});
  
  // Update current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Generate array of dates for the current week (Sunday to Saturday)
  const getDaysOfWeek = () => {
    const today = new Date();
    const day = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    return Array(7).fill().map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - day + i);
      return date;
    });
  };
  
  const daysOfWeek = getDaysOfWeek();
  
  // Sample menu data
  const menuData = {
    Sunday: {
      lunch: { label: "Caesar Salad", image: "/api/placeholder/100/80" },
      dinner: { label: "Grilled Chicken", image: "/api/placeholder/100/80" }
    },
    Monday: {
      lunch: { label: "Vegetable Soup", image: "/api/placeholder/100/80" },
      dinner: { label: "Beef Stir Fry", image: "/api/placeholder/100/80" }
    },
    Tuesday: {
      lunch: { label: "Greek Wrap", image: "/api/placeholder/100/80" },
      dinner: { label: "Baked Salmon", image: "/api/placeholder/100/80" }
    },
    Wednesday: {
      lunch: { label: "Pasta Salad", image: "/api/placeholder/100/80" },
      dinner: { label: "Veggie Lasagna", image: "/api/placeholder/100/80" }
    },
    Thursday: {
      lunch: { label: "Tuna Sandwich", image: "/api/placeholder/100/80" },
      dinner: { label: "Tacos", image: "/api/placeholder/100/80" }
    },
    Friday: {
      lunch: { label: "Quinoa Bowl", image: "/api/placeholder/100/80" },
      dinner: { label: "Pizza Night", image: "/api/placeholder/100/80" }
    },
    Saturday: {
      lunch: { label: "Avocado Toast", image: "/api/placeholder/100/80" },
      dinner: { label: "BBQ Ribs", image: "/api/placeholder/100/80" }
    }
  };
  
  const handleLike = (day, mealType) => {
    const mealId = `${day}-${mealType}`;
    
    setLikedMeals(prev => {
      // If already liked, remove like
      if (prev[mealId]) {
        const newLiked = {...prev};
        delete newLiked[mealId];
        return newLiked;
      }
      
      // Add new like
      return {...prev, [mealId]: true};
    });
    
    // Remove from disliked if present
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
      // If already disliked, remove dislike
      if (prev[mealId]) {
        const newDisliked = {...prev};
        delete newDisliked[mealId];
        return newDisliked;
      }
      
      // Add new dislike
      return {...prev, [mealId]: true};
    });
    
    // Remove from liked if present
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
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <div className="text-xl font-bold">
          {formatDate(currentDate)}
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800">
            Pantry
          </button>
          <button className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800">
            Recipe Database
          </button>
        </div>
      </div>
      
      {/* Weekly Menu Table */}
      <div className="flex-grow p-6 overflow-auto">
        <div className="rounded-lg shadow bg-white overflow-hidden">
          <table className="min-w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="w-24 p-3 bg-gray-100 text-gray-600 border text-left">
                  Meal
                </th>
                {daysOfWeek.map((date, index) => {
                  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                  const isCurrentDay = date.getDate() === currentDate.getDate() && 
                                      date.getMonth() === currentDate.getMonth() && 
                                      date.getFullYear() === currentDate.getFullYear();
                  
                  return (
                    <th 
                      key={index} 
                      className={`w-1/7 p-3 text-center font-semibold border ${isCurrentDay ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                      <div>{day}</div>
                      <div className="text-sm text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Lunch Row */}
              <tr className="h-40">
                <td className="w-24 p-3 font-medium bg-gray-50 text-gray-600 border">
                  Lunch
                </td>
                {daysOfWeek.map((date, index) => {
                  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                  const isCurrentDay = date.getDate() === currentDate.getDate() && 
                                      date.getMonth() === currentDate.getMonth() && 
                                      date.getFullYear() === currentDate.getFullYear();
                  const mealId = `${day}-lunch`;
                  const isLiked = likedMeals[mealId];
                  const isDisliked = dislikedMeals[mealId];
                  
                  return (
                    <td 
                      key={index} 
                      className={`p-3 text-center border ${isCurrentDay ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex flex-col items-center h-full justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 flex items-center justify-center mb-2">
                            <img 
                              src={menuData[day].lunch.image} 
                              alt={menuData[day].lunch.label} 
                              className="w-20 h-16 object-cover rounded" 
                            />
                          </div>
                          <span className="font-medium">{menuData[day].lunch.label}</span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button 
                            onClick={() => handleLike(day, 'lunch')} 
                            className={`p-1 rounded ${isLiked ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                          >
                            👍
                          </button>
                          <button 
                            onClick={() => handleDislike(day, 'lunch')} 
                            className={`p-1 rounded ${isDisliked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                          >
                            👎
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
              
              {/* Dinner Row */}
              <tr className="h-40">
                <td className="w-24 p-3 font-medium bg-gray-50 text-gray-600 border">
                  Dinner
                </td>
                {daysOfWeek.map((date, index) => {
                  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                  const isCurrentDay = date.getDate() === currentDate.getDate() && 
                                      date.getMonth() === currentDate.getMonth() && 
                                      date.getFullYear() === currentDate.getFullYear();
                  const mealId = `${day}-dinner`;
                  const isLiked = likedMeals[mealId];
                  const isDisliked = dislikedMeals[mealId];
                  
                  return (
                    <td 
                      key={index} 
                      className={`p-3 text-center border ${isCurrentDay ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex flex-col items-center h-full justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 flex items-center justify-center mb-2">
                            <img 
                              src={menuData[day].dinner.image} 
                              alt={menuData[day].dinner.label} 
                              className="w-20 h-16 object-cover rounded" 
                            />
                          </div>
                          <span className="font-medium">{menuData[day].dinner.label}</span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button 
                            onClick={() => handleLike(day, 'dinner')} 
                            className={`p-1 rounded ${isLiked ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                          >
                            👍
                          </button>
                          <button 
                            onClick={() => handleDislike(day, 'dinner')} 
                            className={`p-1 rounded ${isDisliked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                          >
                            👎
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMenuPage;