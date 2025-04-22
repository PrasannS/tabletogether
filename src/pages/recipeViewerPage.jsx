import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  ChefHat,
  Flame,
  AlertTriangle,
  BookOpen,
  BookmarkPlus,
  Calendar,
  ArrowLeft,
} from "lucide-react";

// import RecipePriceCalculator from '../../RecipePriceCalculator';

// Custom Card Component
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../components/CardComponents";

import { collection, query, onSnapshot, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const RecipeViewerPage = () => {
  const [editingMode, setEditingMode] = useState(null); // 'instructions' or 'ingredients' or null
  const [batchEditText, setBatchEditText] = useState("");

  const handleStartEdit = (type) => {
    // Convert array to newline-separated text for editing
    const text =
      type === "instructions"
        ? currentRecipe.instructions.join("\n")
        : currentRecipe.ingredients.join("\n");

    setBatchEditText(text);
    setEditingMode(type);
  };

  const handleSaveEdit = () => {
    if (editingMode === "instructions") {
      // Split by newline and filter empty strings
      const updatedInstructions = batchEditText
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      setCurrentRecipe({
        ...currentRecipe,
        instructions: updatedInstructions,
      });
    } else if (editingMode === "ingredients") {
      const updatedIngredients = batchEditText
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      setCurrentRecipe({
        ...currentRecipe,
        ingredients: updatedIngredients,
      });
    } else if (editingMode === "title") {
      const updatedTitle = batchEditText
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      setCurrentRecipe({
        ...currentRecipe,
        name: updatedTitle,
      });
    } else if (editingMode === "chefs") {
      const updatedChefs = batchEditText
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      setCurrentRecipe({
        ...currentRecipe,
        chefs: updatedChefs,
      });
    }

    // Exit editing mode
    setEditingMode(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setEditingMode(null);
    }
  };

  // get recipe from the recipeEntryPage
  const location = useLocation();
  const recipe = location.state?.recipe;

  if (!recipe) {
    console.error("No recipe data was passed to the viewer");
    return (
      <div className="p-6">
        No recipe data found. Please go back and try again.
      </div>
    );
  }

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const getlikesdislikes = async () => {
    const recipesRef = collection(db, "recipes");
    const q = query(recipesRef, where("name", "==", currentRecipe.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const recipeDoc = querySnapshot.docs[0];
      const recipeData = recipeDoc.data();
      setLikes(recipeData.likes);
      setDislikes(recipeData.dislikes);
    }
  };

  useEffect(() => {
    getlikesdislikes();
  }, []);

  const navigate = useNavigate();

  const [currentRecipe, setCurrentRecipe] = useState({
    name: recipe.title || recipe.name,
    servings: "",
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    additionalSections: recipe.additionalSections,
    image:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_efsfYCzQtTNE7syTtekzAZuKIItXB7Vh0S8ZsAa_LQIQlSx7lT3sxKhXvB6iXctYZr_OhChfTNyL20fVHTIwtIpPD3EDhO4yOxohcMNh",
    chefs: recipe.chefs || "Marco Rossi, Elena Garcia",
    calories: 650,
    allergens: recipe.allergens || "Dairy, Wheat, Eggs",
    mealtype: recipe.mealType || "lunch",
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
    appId: "1:536905524696:web:e93dcac6f4106ca8a73ead",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // upload recipe to firebase
  const uploadRecipe = async () => {
    try {
      // Reference to the recipes collection
      const recipesRef = collection(db, "recipes");

      // Query to check if a recipe with the same name exists
      const q = query(recipesRef, where("name", "==", currentRecipe.name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("recipe with same name exists, updating it: ");
        // Recipe with same name exists, update it
        const recipeDoc = querySnapshot.docs[0];
        const recipeId = recipeDoc.id;

        await updateDoc(doc(db, "recipes", recipeId), {
          name: currentRecipe.name,
          servings: currentRecipe.servings,
          ingredients: currentRecipe.ingredients,
          instructions: currentRecipe.instructions,
          additionalSections: currentRecipe.additionalSections,
          imageUrl: currentRecipe.imageUrl,
          chefs: currentRecipe.chefs,
          calories: currentRecipe.calories,
          allergens: currentRecipe.allergens,
          updatedAt: new Date(),
          mealType: currentRecipe.mealtype,
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
          imageUrl: currentRecipe.imageUrl,
          chefs: currentRecipe.chefs,
          calories: currentRecipe.calories,
          allergens: currentRecipe.allergens,
          likes: 0,
          dislikes: 0,
          createdAt: new Date(),
          mealType: currentRecipe.mealtype,
        });

        console.log("Recipe created successfully");
      }
    } catch (error) {
      console.error("Error uploading recipe:", error);
    }
  };

  return (
    <div className="relative p-6">
      <div className="absolute top-6 right-6 flex space-x-4">
        <Button
          
          className="flex items-center"
          onClick={() => navigate("/recipes")}
        >
          <BookmarkPlus className="mr-2" /> Recipe Book
        </Button>
        <Button
          
          className="flex items-center"
          onClick={() => navigate("/menu")}
        >
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
                className="flex items-center bg-[#455932] hover:bg-[#5f7d47] text-white"
              >
                <ThumbsUp className="mr-2" /> Like ({likes})
              </Button>
              <Button
              className="flex items-center bg-[#455932] hover:bg-[#5f7d47] text-white"
              >
                <ThumbsDown className="mr-2" /> Dislike ({dislikes})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Middle Column - Recipe Details */}
        <Card className="w-2/3 text-left">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center border-b pb-4">
                <ChefHat className="mr-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Chefs</h3>
                  <p>
                    {Array.isArray(currentRecipe.chefs)
                      ? currentRecipe.chefs.join(", ")
                      : currentRecipe.chefs ?? "Unknown"}
                  </p>
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
                  <p> $500 </p>
                </div>
              </div>

              <div className="flex items-center border-b pb-4">
                <AlertTriangle className="mr-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Allergens</h3>
                  <p>
                    {Array.isArray(currentRecipe.allergens)
                      ? currentRecipe.allergens.join(", ")
                      : currentRecipe.allergens ?? "Unknown"}
                  </p>
                </div>
              </div>
              <div>
                {/* mealtype choice buttons that are either "lunch" or "dinner", with appropriate onclick behavior*/}
                <div className="flex items-center border-b pb-4">
                  <BookOpen className="mr-4 text-gray-600" />
                  <div>
                    <h3 className="font-semibold">Meal Type</h3>
                    <p>{currentRecipe.mealtype}</p>
                    <div className="flex space-x-4 mt-2">
                      <Button
                        
                        className={`flex items-center ${
                          currentRecipe.mealtype === "lunch"
                            ? "bg-white-500 text-white"
                            : ""
                        }`}
                        onClick={() =>
                          setCurrentRecipe({
                            ...currentRecipe,
                            mealtype: "Lunch",
                          })
                        }
                      >
                        Lunch
                      </Button>
                      <Button
                        
                        className={`flex items-center ${
                          currentRecipe.mealtype === "dinner"
                            ? "bg-white-500 text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setCurrentRecipe({
                            ...currentRecipe,
                            mealtype: "Dinner",
                          });
                          console.log(currentRecipe);
                        }}
                      >
                        Dinner
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold">Instructions</h3>
                  {editingMode === "instructions" ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full p-2 border rounded"
                        value={batchEditText}
                        onChange={(e) => setBatchEditText(e.target.value)}
                        rows={Math.max(
                          5,
                          currentRecipe.instructions.length + 2
                        )}
                        autoFocus
                        onKeyDown={handleKeyDown}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          variant="outline"
                          className="px-3 py-1 bg-[#455932] hover:bg-[#5f7d47] text-white rounded hover:text-[#455932]"
                          onClick={handleSaveEdit}
                          // "bg-[#4d693a] hover:bg-[#5f7d47] text-white py-2 px-4 rounded transition"
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setEditingMode(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="mt-2 border border-transparent hover:border-gray-200 p-2 rounded cursor-pointer"
                      onClick={() => handleStartEdit("instructions")}
                    >
                      <ul className="list-disc pl-6">
                        {currentRecipe.instructions.map(
                          (instruction, index) => (
                            <li key={index} className="mb-2">
                              {instruction}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold">Ingredients</h3>
                  {editingMode === "ingredients" ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full p-2 border rounded"
                        value={batchEditText}
                        onChange={(e) => setBatchEditText(e.target.value)}
                        rows={Math.max(5, currentRecipe.ingredients.length + 2)}
                        autoFocus
                        onKeyDown={handleKeyDown}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          className="px-3 py-1 bg-[#455932] text-white rounded hover:text-[#455932] hover:bg-[#5f7d47]"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setEditingMode(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="mt-2 border border-transparent hover:border-gray-200 p-2 rounded cursor-pointer"
                      onClick={() => handleStartEdit("ingredients")}
                    >
                      <ul className="list-disc pl-6">
                        {currentRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="mb-2">
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Button that uploads recipe and goes back to home page */}
                <Button
                  
                  className="mt-4 w-full bg-[#455932] text-white"
                  onClick={() => {
                    uploadRecipe();
                    navigate("/recipes");
                  }}
                >
                  Save Recipe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeViewerPage;
