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
    title: "",
    servings: "",
    ingredients: [],
    instructions: [],
    name: "Chicken Parmesan",
    image: "/api/placeholder/400/300",
    chefs: ["Marco Rossi", "Elena Garcia"],
    calories: 650,
    additionalSections: {}
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

  const firebaseConfig = {
    apiKey: "AIzaSyAPFn9zzoCufbohVJ5VDcUC6gBtPC7IB_o",
    authDomain: "tabletogether.firebaseapp.com",
    projectId: "tabletogether",
    storageBucket: "tabletogether.firebasestorage.app",
    messagingSenderId: "536905524696",
    appId: "1:536905524696:web:e93dcac6f4106ca8a73ead"
  };
  

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // upload recipe to firebase
  const uploadRecipe = () => {
    // Logic to upload the recipe
    console.log("Uploading recipe:", currentRecipe);
    const recipeRef = collection(db, 'recipes');
    // if recipe with same name exists, update it
    const existingRecipe = recipes.find(r => r.name === currentRecipe.name);
    if (existingRecipe) {
      const recipeDoc = doc(recipeRef, existingRecipe.id);
      updateDoc(recipeDoc, currentRecipe)
        .then(() => console.log("Recipe updated successfully"))
        .catch(error => console.error("Error updating recipe:", error));
    } else {
      addDoc(recipeRef, currentRecipe)
        .then(() => console.log("Recipe uploaded successfully"))
        .catch(error => console.error("Error uploading recipe:", error));
    }
  }

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
                  {/* <Button variant="link" className="p-0">
                    View Full Recipe
                  </Button> */}
                  <Button variant="link" className="p-0" onClick={uploadRecipe}>
                    Done Editing Recipe
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