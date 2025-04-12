import Category from '../models/category.js';

const categoryController = {
    // Create new category
    createCategory: async (req, res) => {
        try {
            const { categoryName, slug, parentId } = req.body;
            
            if (!categoryName || !slug) {
                return res.status(400).json({ error: 'Category name and slug are required' });
            }

            const category = await Category.create({
                categoryName,
                slug,
                parentId: parentId || null
            });

            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get all categories
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
                .populate('parentId')
                .sort({ categoryName: 1 });
            res.json(categories);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get single category
    getCategory: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id)
                .populate('parentId');
            
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            
            res.json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Update category
    updateCategory: async (req, res) => {
        try {
            const { categoryName, slug, parentId } = req.body;
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                { categoryName, slug, parentId },
                { new: true }
            );

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete category
    deleteCategory: async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            // Also delete all subcategories
            await Category.deleteMany({ parentId: req.params.id });
            
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

export default categoryController;