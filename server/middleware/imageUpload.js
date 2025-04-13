import multer from 'multer';
import { storage } from '../utils/Cloudinary.js';

const upload = multer({ storage: storage });

export default upload;