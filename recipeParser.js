/**
 * Parse a recipe text and extract structured information about the recipe.
 * 
 * @param {string} recipeText - The full text of the recipe
 * @returns {Object} A structured object containing parsed recipe information
 */
function recipeParser(recipeText) {
	// Initialize the recipe object with empty values
	const recipe = {
	  title: "",
	  servings: "",
	  ingredients: [],
	  instructions: [],
	  additionalSections: {}
	};
  
	// Split the recipe into lines for processing
	const lines = recipeText.trim().split('\n');
  
	// Extract the title (assuming it's the first non-empty line)
	for (const line of lines) {
	  if (line.trim()) {
		recipe.title = line.trim();
		break;
	  }
	}
  
	// Common section headers in recipes (using regex patterns)
	const sectionPatterns = {
	  ingredients: /^(?:ingredients|what you'll need)[\s:]*$/i,
	  instructions: /^(?:instructions|directions|method|preparation|steps)[\s:]*$/i,
	  servings: /^(?:servings|serves|yield)[\s:]*$/i
	};
  
	// Additional patterns to identify potential sections (must be a header-only line)
	const additionalSectionPattern = /^([A-Z][A-Za-z\s]+)[\s:]*$/i;
	
	// Pattern to recognize an ingredient line (usually has measurements, quantity indicators)
	const ingredientLinePattern = /^\s*[\*\-•]?\s*(?:\d+(?:[.,\/]\d+)?(?:\s*[+-]\s*\d+%)?(?:\s*[⅓⅔¼½¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])?(?:\s*to\s*\d+)?(?:\s*(?:cups?|tablespoons?|teaspoons?|tbsps?|tsps?|lbs?|pounds?|ounces?|oz|grams?|kilograms?|kgs?|milliliters?|ml|liters?|l|inches?|in|cm|pieces?|cloves?|heads?|bunche?s?|cans?|jars?|boxes?|packages?|pkgs?))?)?.*$|^\s*[\*\-•]?\s*[Ss]alt\s+(?:to\s+)?(?:taste|preference).*$|^\s*[\*\-•]?\s*[Pp]epper\s+(?:to\s+)?(?:taste|preference).*$/;
  
	// Process the recipe line by line
	let currentSection = null;
	let sectionContent = [];
	let foundIngredientSection = false;
	let lineIsInIngredientFormat = false;
  
	for (let i = 0; i < lines.length; i++) {
	  if (i === 0) { // Skip the title line
		continue;
	  }
  
	  const line = lines[i].trim();
	  if (!line) { // Skip empty lines
		continue;
	  }
  
	  // Check if this line is a known section header
	  let isSectionHeader = false;
	  
	  // Handle special case for "**Ingredients:**" format (bold markdown)
	  if (line.match(/^\*\*ingredients:?\*\*$/i)) {
		if (currentSection && sectionContent.length) {
		  saveCurrentSection(recipe, currentSection, sectionContent);
		}
		currentSection = "ingredients";
		sectionContent = [];
		isSectionHeader = true;
		foundIngredientSection = true;
		continue;
	  }
	  
	  // Handle special case for "**Directions:**" format (bold markdown)
	  if (line.match(/^\*\*directions:?\*\*$/i) || line.match(/^\*\*instructions:?\*\*$/i)) {
		if (currentSection && sectionContent.length) {
		  saveCurrentSection(recipe, currentSection, sectionContent);
		}
		currentSection = "instructions";
		sectionContent = [];
		isSectionHeader = true;
		continue;
	  }
  
	  // Check against known section patterns
	  for (const [section, pattern] of Object.entries(sectionPatterns)) {
		if (pattern.test(line)) {
		  // Save previous section if there was one
		  if (currentSection && sectionContent.length) {
			saveCurrentSection(recipe, currentSection, sectionContent);
		  }
  
		  // Start new section
		  currentSection = section;
		  sectionContent = [];
		  isSectionHeader = true;
		  
		  if (section === "ingredients") {
			foundIngredientSection = true;
		  }
		  
		  break;
		}
	  }
  
	  // Check if the line looks like an ingredient without being in the ingredients section
	  lineIsInIngredientFormat = ingredientLinePattern.test(line);
	  
	  // If we've found a line that looks like an ingredient but we're not in the ingredients section yet
	  // and we haven't already found an ingredients section, assume we're starting the ingredients
	  if (!isSectionHeader && lineIsInIngredientFormat && !currentSection && !foundIngredientSection) {
		currentSection = "ingredients";
		foundIngredientSection = true;
		sectionContent = [line];
		continue;
	  }
  
	  // Check if it's another kind of section header (only if the line doesn't look like an ingredient)
	  if (!isSectionHeader && !lineIsInIngredientFormat) {
		const match = line.match(additionalSectionPattern);
		// Make sure it's not a common ingredient description that happens to start with a capital letter
		const commonIngredientWords = /salt|pepper|chicken|beef|pork|lamb|fish|tofu|rice|pasta|cheese|milk|cream|butter|oil|flour|sugar|spice|herb|vegetable|fruit/i;
		
		if (match && !commonIngredientWords.test(match[1])) {
		  // Save previous section if there was one
		  if (currentSection && sectionContent.length) {
			saveCurrentSection(recipe, currentSection, sectionContent);
		  }
  
		  // Start new section (remove any trailing colon)
		  currentSection = match[1].replace(/:$/, '');
		  sectionContent = [];
		  isSectionHeader = true;
		}
	  }
  
	  // If not a section header, add content to current section
	  if (!isSectionHeader) {
		// Check if line contains servings information without a header
		const servingsMatch = line.match(/(?:yield|serves|servings):?\s*(\d+(?:\s*\(\+?\s*\d+%\s*(?:increase)?\))?)/i);
		if (!currentSection && servingsMatch) {
		  recipe.servings = line;
		} else {
		  sectionContent.push(line);
		}
	  }
	}
  
	// Add the last section
	if (currentSection && sectionContent.length) {
	  saveCurrentSection(recipe, currentSection, sectionContent);
	}
  
	// Clean up ingredient list (preserve quantity but remove bullets)
	recipe.ingredients = recipe.ingredients.map(item => 
	  item.replace(/^\s*[\*\-•]\s*/, '').trim()
	);
  
	// Clean up instruction list (preserve numbers)
	recipe.instructions = recipe.instructions.map(item => {
	  // Keep the numbering format if it exists, but clean up any bullet points
	  const numberMatch = item.match(/^\s*(\d+\.?\s*)/);
	  if (numberMatch) {
		return item.trim();
	  } else {
		return item.replace(/^\s*[\*\-•]\s*/, '').trim();
	  }
	});
  
	return recipe;
  }
  
  /**
   * Helper function to save the current section to the appropriate place in the recipe object
   */
  function saveCurrentSection(recipe, currentSection, sectionContent) {
	if (currentSection in recipe && Array.isArray(recipe[currentSection])) {
	  recipe[currentSection].push(...sectionContent);
	} else if (currentSection === "servings") {
	  recipe[currentSection] = sectionContent.join(" ");
	} else {
	  recipe.additionalSections[currentSection] = sectionContent;
	}
  }
  
  // Export the function as both default and named export
  export { recipeParser };
  export default recipeParser;