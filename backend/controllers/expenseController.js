
import Expense from '../models/Expense.js';

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
export const addExpense = async (req, res) => {
  const { date, amount, category, description } = req.body;

  const expense = new Expense({
    user: req.user._id,
    date,
    amount,
    category,
    description,
  });

  const createdExpense = await expense.save();
  res.status(201).json(createdExpense);
};

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
    const { startDate, endDate, category } = req.query;
    const query = { user: req.user._id };

    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) {
        query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  const { date, amount, category, description } = req.body;
  const expense = await Expense.findById(req.params.id);

  if (expense && expense.user.toString() === req.user._id.toString()) {
    expense.date = date;
    expense.amount = amount;
    expense.category = category;
    expense.description = description;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } else {
    res.status(404).json({ message: 'Expense not found or user not authorized' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (expense && expense.user.toString() === req.user._id.toString()) {
    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } else {
    res.status(404).json({ message: 'Expense not found or user not authorized' });
  }
};
