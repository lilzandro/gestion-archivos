const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/database')
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta'
const authenticateToken = require('../middleware/jwt')

module.exports = router
