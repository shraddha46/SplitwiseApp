const express = require('express');
const expenseControllers = require('../Controllers/expense.controllers');
const authMiddleware = require('../Middleware/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: Expense management
 */
/**
 * @openapi
 * /expense/addExpense:
 *   post:
 *     summary: Add a new expense
 *     description: Add a new expense in splitwise.
 *     tags: [Expense]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        required: true
 *        description: Bearer token for authentication
 *        schema:
 *         type: string
 *         example: "Bearer YOUR_JWT_TOKEN"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Dinner
 *               amount:
 *                 type: number
 *                 example: 100
 *               createdBy:
 *                 type: string
 *                 example: userId
 *               splitMethod:
 *                 type: string
 *                 example: simple_split
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-09-17T12:00:00Z"
 *               tempUsers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     inviteBy:
 *                       type: string
 *                       example: userId
 *               expanseDetail:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: userId
 *                     username:
 *                       type: string
 *                     paidBy:
 *                       type: number
 *                     owedBy:
 *                       type: number
 *     responses:
 *       200:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 description:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *                 splitMethod:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 tempUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       username:
 *                         type: string
 *                       createdBy:
 *                         type: string
 *                         example: userId
 *                 expenseDetail:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       tempUserId:
 *                         type: string
 *                         example: userId
 *                       paidBy:
 *                         type: number
 *                       owedBy:
 *                         type: number
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       500:
 *         description: Internal server error
 */

router.post('/addExpense', authMiddleware, expenseControllers.addExpense);

/**
 * @openapi
 * /expense/all:
 *   get:
 *     summary: Get all expenses
 *     description: Retrieve a list of all expenses. Requires authorization.
 *     tags: [Expense]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        required: true
 *        description: Bearer token for authentication
 *        schema:
 *         type: string
 *         example: "Bearer YOUR_JWT_TOKEN"
 *     responses:
 *      200:
 *       description: A list of expenses
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Expense'
 *      401:
 *         description: Unauthorized. Invalid or missing token.
 *      500:
 *         description: Internal server error
 */

router.get('/all', authMiddleware, expenseControllers.getAllExpenses);

/**
 * @openapi
 * /expense/getAllDebts:
 *   get:
 *     summary: Get all debts
 *     description: Retrieve a list of all debits. Requires authorization.
 *     tags: [Expense]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        required: true
 *        description: Bearer token for authentication
 *        schema:
 *         type: string
 *         example: "Bearer YOUR_JWT_TOKEN"
 *     responses:
 *      200:
 *       description: A list of debts
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Expense'
 *      401:
 *         description: Unauthorized. Invalid or missing token.
 *      500:
 *         description: Internal server error
 */

router.get('/getAllDebts', authMiddleware, expenseControllers.getAllDebts);

module.exports = router;