import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThumbsUp, 
  ThumbsDown, 
  ChefHat, 
  Flame, 
  AlertTriangle, 
  BookOpen,
  BookmarkPlus,
  Calendar 
} from 'lucide-react';

// Custom Card Component
import { Card, CardHeader, CardTitle, CardContent, Button} from '../components/CardComponents';

const recipeViewerPage = () => {
  const [currentRecipe, setCurrentRecipe] = useState({
    name: "Chicken Parmesan",
    image: "/api/placeholder/400/300",
    chefs: ["Marco Rossi", "Elena Garcia"],
    calories: 650,
    allergens: ["Dairy", "Wheat", "Eggs"],
  });

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const recipes = [
    {
      name: "Chicken Parmesan",
      image: "/api/placeholder/400/300",
      chefs: ["Marco Rossi", "Elena Garcia"],
      calories: 650,
      allergens: ["Dairy", "Wheat", "Eggs"],
    },
    {
      name: "Vegetable Lasagna",
      image: "/api/placeholder/400/300",
      chefs: ["Sofia Chen", "Antonio Rodriguez"],
      calories: 450,
      allergens: ["Dairy", "Wheat"],
    },
    {
      name: "Salmon Teriyaki",
      image: "/api/placeholder/400/300",
      chefs: ["Hiroshi Tanaka", "Maria Santos"],
      calories: 400,
      allergens: ["Fish", "Soy"],
    }
  ];

  const changeRecipe = () => {
    const currentIndex = recipes.findIndex(r => r.name === currentRecipe.name);
    const nextIndex = (currentIndex + 1) % recipes.length;
    setCurrentRecipe(recipes[nextIndex]);
    setLikes(0);
    setDislikes(0);
  };

  return (
    <div className="relative p-6">
      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 flex space-x-4">
        <Button variant="outline" className="flex items-center">
          <BookmarkPlus className="mr-2" /> Recipe Book
        </Button>
        <Button variant="outline" className="flex items-center">
          <Calendar className="mr-2" /> Weekly Menu
        </Button>
      </div>

      <div className="flex space-x-6 mt-12">
        {/* Right Column - Image and Interactions */}
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle className="text-center">{currentRecipe.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <img 
              src={currentRecipe.image} 
              alt={currentRecipe.name} 
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setLikes(likes + 1)}
                className="flex items-center"
              >
                <ThumbsUp className="mr-2" /> Like ({likes})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setDislikes(dislikes + 1)}
                className="flex items-center"
              >
                <ThumbsDown className="mr-2" /> Dislike ({dislikes})
              </Button>
            </div>
            <Button 
              onClick={changeRecipe}
              className="w-full"
            >
              Change Recipe
            </Button>
          </CardContent>
        </Card>

        {/* Middle Column - Recipe Details */}
        <Card className="w-2/3">
          <CardContent className="p-6">
            <div className="grid grid-rows-4 gap-4">
              <div className="flex items-center border-b pb-4">
                <ChefHat className="mr-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Chefs</h3>
                  <p>{currentRecipe.chefs.join(", ")}</p>
                </div>
              </div>

              <div className="flex items-center border-b pb-4">
                <Flame className="mr-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Calories</h3>
                  <p>{currentRecipe.calories} cal</p>
                </div>
              </div>

              <div className="flex items-center border-b pb-4">
                <AlertTriangle className="mr-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Allergens</h3>
                  <p>{currentRecipe.allergens.join(", ")}</p>
                </div>
              </div>

              <div className="flex items-center">
                <BookOpen className="mr-4 text-gray-600" />
                <div>
                  <Button variant="link" className="p-0">
                    View Full Recipe
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default recipeViewerPage;