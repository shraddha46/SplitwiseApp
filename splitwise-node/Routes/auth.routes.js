const express = require('express');
const authControllers = require('../Controllers/auth.controllers');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management
 */
/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user in splitwise.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the user.
 *                   example: 60d21b4667d0d8992e610c85
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: johndoe@example.com
 *       400:
 *         description: Bad request, possibly due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */

router.post('/signup',authControllers.registration);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Login user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *               type: string
 *               description: The email address of the user.
 *               example: johndoe@example.com
 *              password:
 *               type: string
 *               description: The password of the user.
 *               example: securepassword123
 *     responses:
 *      200:
 *         description: Successfully logged in
 *      401:
 *          description: Invalid credentials
 *      500:
 *          description: Internal Server Error
 */

router.post('/login',authControllers.login);

module.exports = router;