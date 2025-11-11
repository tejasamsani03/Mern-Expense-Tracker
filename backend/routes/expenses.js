import express from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js'; // We'll need to create this next

const router = express.Router();

router.route('/').post(protect, addExpense).get(protect, getExpenses);
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);

export default router;