const express = require('express');
const friendControllers = require('../Controllers/friend.controllers');
const authMiddleware = require('../Middleware/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friends Management
 */
/**
 * @openapi
 * /friends/add:
 *   post:
 *     summary: Add friendss
 *     description: Add friends in splitwise.
 *     tags: [Friends]
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
 *               friendId:
 *                 type: string
 *               UserId:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: invited, confirmed
 *     responses:
 *       200:
 *         description: Friends added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 friendId:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       500:
 *         description: Internal server error
 */

router.post('/add',authMiddleware,friendControllers.addFriends);

/**
 * @openapi
 * /friends/getFriends:
 *   get:
 *     summary: Get friends list
 *     description: Retrive list of a friend. Requires authorization.
 *     tags: [Friends]
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
 *             status:
 *               type: string
 *               description: the status of the invitation
 *             userId:
 *               type: string
 *               description: The user's ID
 *             friendId:
 *               type: string
 *               description: The user's ID
 *      401:
 *         description: Unauthorized. Invalid or missing token.
 *      404:
 *         description: User not found
 *      500:
 *         description: Internal server error
 */

router.get('/getFriends', authMiddleware, friendControllers.getFriends );

module.exports = router;