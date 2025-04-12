import Promotion from '../models/Promotion.js';

const promotionController = {
  // Create new promotion
  create: async (req, res) => {
    try {
      const promotion = await Promotion.create(req.body);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all promotions
  getAll: async (req, res) => {
    try {
      const promotions = await Promotion.find()
        .populate('productIds');
      res.json(promotions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get active promotions
  getActive: async (req, res) => {
    try {
      const currentDate = new Date();
      const promotions = await Promotion.find({
        validFrom: { $lte: currentDate },
        validUntil: { $gte: currentDate }
      }).populate('productIds');
      res.json(promotions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update promotion
  update: async (req, res) => {
    try {
      const promotion = await Promotion.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete promotion
  delete: async (req, res) => {
    try {
      const promotion = await Promotion.findByIdAndDelete(req.params.id);
      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }
      res.json({ message: "Promotion deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export default promotionController;