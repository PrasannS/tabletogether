import React, { useState } from 'react';
import { recipeParser } from '../../recipeParser';

const recipeEntryPage = () => {
	const [recipeText, setRecipeText] = useState('');
	const [parsedRecipe, setParsedRecipe] = useState(null);
	const [isEditing, setIsEditing] = useState(true);
  
	// Handle form submission
	const handleSubmit = (e) => {
	  e.preventDefault();
	  
	  if (!recipeText.trim()) return;
	  
	  const parsed = recipeParser(recipeText);
	  console.log("Parsed recipe:", parsed);
	  
	  setParsedRecipe(parsed);
	  
	  setIsEditing(false);
	};
  
	const handleEdit = () => {
	  setIsEditing(true);
	};
  
	return (
	  <div className="container mx-auto p-4 max-w-2xl">
		<h1 className="text-2xl font-bold mb-4">Recipe Parser</h1>
		
		{isEditing ? (
		  <form onSubmit={handleSubmit}>
			<div className="mb-4">
			  <textarea
				className="w-full p-4 border border-gray-300 rounded-md min-h-64"
				value={recipeText}
				onChange={(e) => setRecipeText(e.target.value)}
				placeholder="Paste your recipe here..."
			  />
			</div>
			<button
			  type="submit"
			  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
			>
			  Parse Recipe
			</button>
		  </form>
		) : (
		  <div className="recipe-display bg-white p-6 rounded-md shadow-md">
			{parsedRecipe && (
			  <>
				{/* Title Section */}
				<h2 className="text-2xl font-bold mb-4 border-b pb-2">{parsedRecipe.title || 'My Recipe'}</h2>
				
				{/* Servings Section */}
				{parsedRecipe.servings && (
				  <div className="mb-6">
					<h3 className="text-lg font-semibold mb-2">Yield</h3>
					<p>{parsedRecipe.servings}</p>
				  </div>
				)}
				
				{/* Ingredients Section */}
				{parsedRecipe.ingredients && parsedRecipe.ingredients.length > 0 && (
				  <div className="mb-6">
					<h3 className="text-lg font-semibold mb-2 border-b pb-1">Ingredients</h3>
					<ul className="list-disc pl-6 space-y-1 mt-3">
					  {parsedRecipe.ingredients.map((ingredient, index) => (
						<li key={index}>{ingredient}</li>
					  ))}
					</ul>
				  </div>
				)}
				
				{/* Instructions Section */}
				{parsedRecipe.instructions && parsedRecipe.instructions.length > 0 && (
				  <div className="mb-6">
					<h3 className="text-lg font-semibold mb-2 border-b pb-1">Instructions</h3>
					<ol className="list-decimal pl-6 space-y-2 mt-3">
					  {parsedRecipe.instructions.map((step, index) => (
						<li key={index} className="mb-2">{step}</li>
					  ))}
					</ol>
				  </div>
				)}
				
				{/* Additional Sections */}
				{parsedRecipe.additionalSections && Object.keys(parsedRecipe.additionalSections).length > 0 && 
				  Object.entries(parsedRecipe.additionalSections).map(([sectionName, content]) => (
					<div key={sectionName} className="mb-6">
					  <h3 className="text-lg font-semibold mb-2 border-b pb-1 capitalize">{sectionName}</h3>
					  {Array.isArray(content) ? (
						<ul className="list-disc pl-6 space-y-1 mt-3">
						  {content.map((item, index) => (
							<li key={index}>{item}</li>
						  ))}
						</ul>
					  ) : (
						<p>{content}</p>
					  )}
					</div>
				  ))
				}
			  </>
			)}
			
			<div className="flex mt-6 space-x-3">
			  <button
				onClick={handleEdit}
				className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
			  >
				Edit Recipe
			  </button>
			  
			  <button
				className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
				onClick={() => {
				  setRecipeText('');
				  setIsEditing(true);
				}}
			  >
				New Recipe
			  </button>
			</div>
		  </div>
		)}
	  </div>
	);
};

export default recipeEntryPage;