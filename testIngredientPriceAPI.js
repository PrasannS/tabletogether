import request from 'request';
// read api key from secret.json
import fs from 'fs';

var CLIENT_ID = "tabletogether-24326124303424434f766663324151646747314846306b585435462e4f554863496c71565369426a6533422f5968355144565956316d35574e4c52472525399801873539799"
var CLIENT_SECRET = "ulbx7geDCb8OTwKPXY0oKPdrpNPKZ8CDOQuVKTJS"

// Function to get OAuth token
function getAccessToken(callback) {
	request.post(
	  {
		url: 'https://api.kroger.com/v1/connect/oauth2/token',
		form: {
		  grant_type: 'client_credentials',
		  client_id: CLIENT_ID,
		  client_secret: CLIENT_SECRET,
		  scope: 'product.compact'
		}
	  },
	  (error, response, body) => {
		if (error) {
		  console.error('Token request failed:', error);
		  return;
		}
		const data = JSON.parse(body);
		callback(data.access_token);
	  }
	);
  }
  
  // Function to search Kroger API for a product
  function searchProduct(query, token) {
	request.get(
	  {
		url: `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(query)}&filter.limit=1`,
		headers: {
		  'Authorization': `Bearer ${token}`
		}
	  },
	  (error, response, body) => {
		if (error) {
		  console.error('Request failed:', error);
		} else if (response.statusCode !== 200) {
		  console.error('Error:', response.statusCode, body.toString('utf8'));
		} else {
		  console.log(`Results for "${query}":`);
		  console.log(body);
		}
	  }
	);
  }

  // Function to extract price from Kroger API response
const extractPrice = (productData, quantity, unit) => {
	// Default fallback price if we can't find or calculate
	let price = 0;
	
	try {
	  // Check if there are products in the response
	  if (productData.data && productData.data.length > 0) {
		const product = productData.data[0];
		
		// Get the regular price from the first item
		if (product.items && product.items.length > 0) {
		  const item = product.items[0];
		  
		  // Get the price
		  if (item.price && item.price.regular) {
			const unitPrice = item.price.regular;
			
			// Get the size and calculate based on quantity
			if (item.size) {
			  // Parse the product size (e.g., "16 oz" or "1 lb")
			  const sizeMatch = item.size.match(/(\d+(\.\d+)?)\s*([a-zA-Z]+)/);
			  
			  if (sizeMatch) {
				const productSize = parseFloat(sizeMatch[1]);
				const productUnit = sizeMatch[3].toLowerCase();
				
				// Simple unit conversion factors (can be expanded)
				const unitConversions = {
				  // Weight
				  'oz': { 'lb': 16, 'oz': 1 },
				  'lb': { 'oz': 0.0625, 'lb': 1 },
				  // Volume
				  'fl oz': { 'cup': 8, 'fl oz': 1 },
				  'cup': { 'fl oz': 0.125, 'cup': 1 },
				  // Count
				  'each': { 'each': 1 }
				};
				
				// Normalize units
				const normalizedQuantity = parseFloat(quantity);
				const normalizedUnit = unit.toLowerCase();
				
				// Calculate price based on requested quantity
				if (productUnit in unitConversions && normalizedUnit in unitConversions[productUnit]) {
				  const conversionFactor = unitConversions[productUnit][normalizedUnit];
				  price = (normalizedQuantity / productSize * conversionFactor) * unitPrice;
				} else {
				  // If we can't convert units, just use the product price
				  price = unitPrice;
				}
			  } else {
				// If we couldn't parse the size, just use the product price
				price = unitPrice;
			  }
			} else {
			  // If there's no size info, assume the price is per unit
			  price = unitPrice * parseFloat(quantity);
			}
		  }
		}
	  }
	} catch (error) {
	  console.error('Error extracting price:', error);
	}
	
	return price;
  };
  
  // Calculate price for a single ingredient
  const fetchIngredientPrice = async (ingredientName, quantity, unit) => {
	try {
	  // Get authentication token
	  const token = await getKrogerToken();
	  
	  // Search for the ingredient
	  const productData = await searchProduct(ingredientName, token);
	  
	  // Extract and calculate the price based on quantity and unit
	  const price = extractPrice(productData, quantity, unit);
	  
	  return price;
	} catch (error) {
	  console.error(`Error fetching price for ${ingredientName}:`, error);
	  return 0; // Return 0 if price fetch fails
	}
  };
  
  // Main function to calculate the total recipe price
  const calculateRecipePrice = async (ingredients) => {
	let totalPrice = 0;
	const pricePromises = [];
  
	// Process each ingredient
	for (const ingredient of ingredients) {
	  pricePromises.push(
		fetchIngredientPrice(ingredient.name, ingredient.quantity, ingredient.unit)
		  .then(price => {
			totalPrice += price;
			return { ingredient: ingredient.name, price };
		  })
	  );
	}
  
	// Wait for all price fetches to complete
	const priceDetails = await Promise.all(pricePromises);
	
	return {
	  totalPrice: totalPrice.toFixed(2),
	  breakdown: priceDetails
	};
  };
  
  // Component integration example
  const RecipePriceCalculator = ({ currentRecipe }) => {
	const [recipePrice, setRecipePrice] = useState(null);
	const [isPriceLoading, setIsPriceLoading] = useState(false);
	const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  
	const handleCalculatePrice = async () => {
	  if (!currentRecipe.ingredients || currentRecipe.ingredients.length === 0) {
		alert("This recipe doesn't have any ingredients listed.");
		return;
	  }
	  
	  setIsPriceLoading(true);
	  try {
		const priceData = await calculateRecipePrice(currentRecipe.ingredients);
		setRecipePrice(priceData);
	  } catch (error) {
		console.error("Error calculating recipe price:", error);
		alert("Failed to calculate recipe price. Please try again.");
	  } finally {
		setIsPriceLoading(false);
	  }
	};
  
	return (
	  <div className="flex items-center border-b pb-4">
		<DollarSign className="mr-4 text-gray-600" />
		<div>
		  <h3 className="font-semibold">Recipe Cost</h3>
		  {isPriceLoading ? (
			<p>Calculating...</p>
		  ) : recipePrice ? (
			<div>
			  <p className="font-bold">${recipePrice.totalPrice}</p>
			  <Button variant="link" onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}>
				{showPriceBreakdown ? "Hide" : "Show"} price breakdown
			  </Button>
			  {showPriceBreakdown && (
				<ul className="mt-2 text-sm">
				  {recipePrice.breakdown.map((item, index) => (
					<li key={index}>
					  {item.ingredient}: ${item.price.toFixed(2)}
					</li>
				  ))}
				</ul>
			  )}
			</div>
		  ) : (
			<Button onClick={handleCalculatePrice} size="sm">
			  Calculate Price
			</Button>
		  )}
		</div>
	  </div>
	);
  };
  
  // Example search query
  var query = 'carrots';
  
  // Get the access token and then search for the product
  getAccessToken((token) => {
	searchProduct(query, token);
  });

  export default RecipePriceCalculator;