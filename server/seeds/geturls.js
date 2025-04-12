import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "kenox", // Replace with your Cloudinary cloud name
  api_key: "156548721981172",         // Replace with your API key
  api_secret: "fE7-zkH8zqbZ6x_wkKX58uWBJ8g"    // Replace with your API secret
});

console.log('Cloudinary configuration:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



// Function to fetch all images in a folder using pagination
async function fetchAllImages(folder) {
  let allResources = [];
  let nextCursor = null;
  const maxResults = 100; // Adjust this number if you have fewer or more images

  do {
    try {
      const options = {
        type: 'upload',
        prefix: folder,       // e.g., 'myFood' or 'myHotels'
        max_results: maxResults
      };
      if (nextCursor) {
        options.next_cursor = nextCursor;
      }
      const result = await cloudinary.api.resources(options);
      allResources = allResources.concat(result.resources);
      nextCursor = result.next_cursor;
    } catch (error) {
      console.error('Error fetching resources:', error);
      break;
    }
  } while (nextCursor);

  return allResources;
}

// Usage example:
(async () => {
  // Replace 'myFood' with the folder name where your images are stored
  const resources = await fetchAllImages('profile_pictures');
  const urls = resources.map(resource => resource.secure_url);
  console.log('Public URLs:', urls);
})();
