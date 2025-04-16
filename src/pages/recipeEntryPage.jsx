import React, { useState } from "react";
import { recipeParser } from "../../recipeParser";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EntryPage = () => {
  console.log("Recipe Entry Page Loaded");
  const [viewMode, setViewMode] = useState("paste"); // 'paste' or 'structured'

  // Fields for paste view
  const [recipeText, setRecipeText] = useState("");

  // Fields for structured view
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const [parsedRecipe, setParsedRecipe] = useState(null);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipeText.trim()) return;

    // send back parsed recipe
    const parsed = recipeParser(recipeText);
    console.log("Parsed recipe:", parsed);

    setParsedRecipe(parsed);
    navigate("/viewer", { state: { recipe: parsed } });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-[#455932] text-white px-6 py-3 rounded-xl shadow-md text-center mb-6">
          <h1 className="text-3xl font-bold">Enter New Recipe</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-md min-h-[350px] min-w-[750px]"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              placeholder="Paste your recipe here..."
            />
          </div>
          <button
            type="submit"
            className="bg-[#394929] text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default EntryPage;
