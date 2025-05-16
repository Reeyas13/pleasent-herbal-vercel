
// import cloudinary from 'cloudinary';
// import dotenv from 'dotenv';
// dotenv.config();

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadImage = async (file) => {
//   try {
//     const buffer = file.data; // Access the buffer from the 'data' property

//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.v2.uploader.upload_stream(
//         { folder: 'e-commerce' },
//         (error, result) => {
//           if (error) {
//             console.error('Error uploading image:', error);
//             return reject(new Error('Image upload failed'));
//           }
//           resolve({
//             url: result.secure_url,
//             public_id: result.public_id,
//           });
//         }
//       );
//       uploadStream.end(buffer); // End the stream with the image data buffer
//     });
//   } catch (error) {
//     console.error('Error processing image:', error);
//     throw new Error('Image processing failed');
//   }
// };

// export const deleteImage = async (imageUrl) => {
//   try {
//     // Extract the public ID from the URL
//     const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0]; // Get the last part of the URL and remove the extension
//     const folder = 'e-commerce'; // Extract folder path from the URL
//     const fullPublicId = `${folder}/${publicId}`; // Combine folder and public ID

//     // console.log("Attempting to delete image with public ID:", fullPublicId);

//     // Use delete_resources to delete a single image
//     return new Promise(async (resolve, reject) => {
//       const result = await cloudinary.v2.api.delete_resources([fullPublicId], {
//         type: 'upload',
//         resource_type: 'image',
//       });

//       console.log('Deletion result:', result);
//       resolve(result); // Resolve the promise with the result
//     });
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     throw new Error('Image deletion failed');
//   }
// };
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the public URL for an image path
 * @param {string} filename - The filename of the uploaded file
 * @returns {string} - The public URL for the image
 */
export const getImageUrl = (filename) => {
  // Construct URL based on your server config
  return `/uploads/products/${filename}`;
};

/**
 * Delete an image by its URL path
 * @param {string} imageUrl - The URL of the image to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract the filename from the URL
    const filename = path.basename(imageUrl);
    const filepath = path.join(__dirname, '../uploads/products', filename);
    
    // Check if file exists before attempting to delete
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

