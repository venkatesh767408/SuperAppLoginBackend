const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expensiveController');

router.get('/expenses/', expenseController.getExpenses);
router.post('/expenses/', expenseController.createExpense);
router.put('/expenses/:id', expenseController.updateExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);

module.exports = router;