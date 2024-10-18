const express = require('express');
const userControllers = require('../Controllers/user.controllers');
const expenseControllers = require('../Controllers/expense.controllers');
const authMiddleware = require('../Middleware/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */
/**
 * @openapi
 * /user/detail:
 *   get:
 *     summary: Get user details
 *     description: Retrive details of a user. Requires authorization.
 *     tags: [User]
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
 *       description: User details retrieved successfully
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: The user's ID
 *           username:
 *            type: string
 *            description: The user's username
 *           email:
 *            type: string
 *            description: The user's email address
 *           registration_status:
 *            type: string
 *            example: confirmed, invited
 *      401:
 *         description: Unauthorized. Invalid or missing token.
 *      404:
 *         description: User not found
 *      500:
 *         description: Internal server error
 */

router.get('/detail',authMiddleware, userControllers.getUserDetails);

/**
 * @swagger
 * tags:
 *   name: TempUser
 *   description: Temporary User management
 */
/**
 * @openapi
 * /user/addTempUsers:
 *   post:
 *     summary: Add multiple temp users.
 *     description: Add multiple temp users in splitwise.
 *     tags: [TempUser]
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
 *             type: array
 *             items:
 *              type: object
 *              properties:
 *               username:
 *                 type: string
 *                 example: John Dev
 *               email:
 *                 type: string
 *                 example: Johndev@gmail.com
 *               inviteBy:
 *                 type: string
 *                 example: userId
 *     responses:
 *       200:
 *         description: Temp Users created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 inviteBy:
 *                   type: string
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       500:
 *         description: Internal server error
 */

router.post('/addTempUsers',authMiddleware,userControllers.addTempUsers);

/**
 * @openapi
 * /user/getFriends:
 *   get:
 *     summary: Get friend list
 *     description: Retrive list of a friend. Requires authorization.
 *     tags: [TempUser]
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
 *       description: Friend list retrieved successfully
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The temp user's ID 
 *             inviteBy:
 *               type: string
 *               description: The user's ID
 *             username:
 *               type: string
 *               description: The user's username
 *             email:
 *               type: string
 *               description: The user's email address
 *      401:
 *         description: Unauthorized. Invalid or missing token.
 *      404:
 *         description: User not found
 *      500:
 *         description: Internal server error
 */

router.get('/getFriends', authMiddleware, userControllers.getFriends );

/**
 * @openapi
 * /user/getOwnBalance:
 *   get:
 *     summary: Get Own Balance
 *     description: Retrieve own balance. Requires authorization.
 *     tags: [User]
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
 *       description: Get own balance
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

router.get('/getOwnBalance', authMiddleware, expenseControllers.getOwnBalance);

module.exports = router;