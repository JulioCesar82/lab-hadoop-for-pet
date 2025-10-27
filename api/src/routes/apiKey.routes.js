const express = require('express');
const router = express.Router();

const apiKeyController = require('../controllers/apiKey.controller');
const { deleteApiKeyValidator } = require('../validators/apiKey.validator');
const { validatePagination } = require('../validators/pagination.validator');
const { authenticateApiKeyAsync } = require('../middleware/auth');

router.use(authenticateApiKeyAsync);

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiKey:
 *       type: object
 *       properties:
 *         organization_id:
 *           type: integer
 *         api_key:
 *           type: string
 *       example:
 *         organization_id: 1
 *         api_key: "a1b2c3d4e5f6..."
 */

/**
 * @swagger
 * tags:
 *   name: ApiKeys
 *   description: The API keys managing API
 */

/**
 * @swagger
 * /apikeys:
 *   post:
 *     summary: Create a new API key for the authenticated organization
 *     tags: [ApiKeys]
 *     responses:
 *       201:
 *         description: The API key was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiKey'
 *       500:
 *         description: Some server error
 */
router.post('/', apiKeyController.createAsync);

/**
 * @swagger
 * /apikeys:
 *   get:
 *     summary: Get all API keys for the authenticated organization
 *     tags: [ApiKeys]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items to retrieve per page.
 *     responses:
 *       200:
 *         description: A list of API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApiKey'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       500:
 *         description: Some server error
 */
router.get('/', validatePagination, apiKeyController.findAllAsync);

/**
 * @swagger
 * /apikeys/{api_key}:
 *   delete:
 *     summary: Delete an API key
 *     tags: [ApiKeys]
 *     parameters:
 *       - in: path
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: The API key to delete
 *     responses:
 *       204:
 *         description: The API key was deleted
 *       404:
 *         description: The API key was not found
 *       500:
 *         description: Some server error
 */
router.delete('/:api_key', deleteApiKeyValidator, apiKeyController.removeAsync);

module.exports = router;
