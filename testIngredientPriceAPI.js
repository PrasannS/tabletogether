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
  
  // Example search query
  var query = 'carrots';
  
  // Get the access token and then search for the product
  getAccessToken((token) => {
	searchProduct(query, token);
  });