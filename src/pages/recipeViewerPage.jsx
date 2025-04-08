import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// import RecipePriceCalculator from '../../RecipePriceCalculator';

// Custom Card Component
import { Card, CardHeader, CardTitle, CardContent, Button} from '../components/CardComponents';

import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  addDoc, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';


const RecipeViewerPage = () => {
  // get recipe from the recipeEntryPage
  const location = useLocation();
  const recipe = location.state?.recipe;

  if (!recipe) {
    console.error("No recipe data was passed to the viewer");
    return <div className="p-6">No recipe data found. Please go back and try again.</div>;
  }
  const navigate = useNavigate();


  const [currentRecipe, setCurrentRecipe] = useState({
    name: recipe.title,
    servings: "",
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    additionalSections: recipe.additionalSections,
    image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_efsfYCzQtTNE7syTtekzAZuKIItXB7Vh0S8ZsAa_LQIQlSx7lT3sxKhXvB6iXctYZr_OhChfTNyL20fVHTIwtIpPD3EDhO4yOxohcMNh",
    chefs: ["Marco Rossi", "Elena Garcia"],
    calories: 650,
    allergens: ["Dairy", "Wheat", "Eggs"],
  });

  // const [currentRecipe, setCurrentRecipe] = useState({
  //   name: "Chicken Parmesan",
  //   image: "/api/placeholder/400/300",
  //   chefs: ["Marco Rossi", "Elena Garcia"],
  //   calories: 650,
  //   allergens: ["Dairy", "Wheat", "Eggs"],
  // });

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

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // upload recipe to firebase
  const uploadRecipe = async () => {
    try {
      // Reference to the recipes collection
      const recipesRef = collection(db, 'recipes');
      
      // Query to check if a recipe with the same name exists
      const q = query(recipesRef, where("name", "==", currentRecipe.name));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Recipe with same name exists, update it
        const recipeDoc = querySnapshot.docs[0];
        const recipeId = recipeDoc.id;
        
        await updateDoc(doc(db, 'recipes', recipeId), {
          name: currentRecipe.name,
          servings: currentRecipe.servings,
          ingredients: currentRecipe.ingredients,
          instructions: currentRecipe.instructions,
          additionalSections: currentRecipe.additionalSections,
          image: currentRecipe.image,
          chefs: currentRecipe.chefs,
          calories: currentRecipe.calories,
          allergens: currentRecipe.allergens,
          updatedAt: new Date()
        });
        
        console.log("Recipe updated successfully");
      } else {
        // No recipe with same name, create new one
        await addDoc(recipesRef, {
          name: currentRecipe.name,
          servings: currentRecipe.servings,
          ingredients: currentRecipe.ingredients,
          instructions: currentRecipe.instructions,
          additionalSections: currentRecipe.additionalSections,
          image: currentRecipe.image,
          chefs: currentRecipe.chefs,
          calories: currentRecipe.calories,
          allergens: currentRecipe.allergens,
          likes: 0,
          dislikes: 0,
          createdAt: new Date()
        });
        
        console.log("Recipe created successfully");
      }
    } catch (error) {
      console.error("Error uploading recipe:", error);
    }
  };

  return (
    <div className="relative p-6">
      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 flex space-x-4">
        <Button variant="outline" className="flex items-center" onClick={() => navigate("/recipes")}>
          <BookmarkPlus className="mr-2" /> Recipe Book
        </Button>
        <Button variant="outline" className="flex items-center" onClick={() => navigate("/menu")}>
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
            
          </CardContent>
        </Card>

        {/* Middle Column - Recipe Details */}
        <Card className="w-2/3">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
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
                <Flame className="mr-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Price</h3>
                  {/* <p><RecipePriceCalculator currentRecipe={currentRecipe} /> cal</p> */}
                </div>
              </div>

              <div className="flex items-center border-b pb-4">
                <AlertTriangle className="mr-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Allergens</h3>
                  <p>{currentRecipe.allergens.join(", ")}</p>
                </div>
              </div>
              <div>

              {/* Given list of instructions in currenRecipe.instructions, show as a bulleted list */}
              <div className="mt-4">
                  <h3 className="font-semibold">Ingredients</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {currentRecipe.ingredients.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>

                
                  {/* Given list of instructions in currenRecipe.instructions, show as a bulleted list  (left-aligned)*/}
                <div className="mt-4">
                  <h3 className="font-semibold">Instructions</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {currentRecipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>

            
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeViewerPage;