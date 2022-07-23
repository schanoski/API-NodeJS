const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const controller = require('../controllers/enderecoController')

router.get('/', controller.getEnderecos);
router.post('/', controller.postEndereco);
router.get('/:enderecoId', controller.getEnderecoPorId)
router.delete('/:enderecoId', controller.deleteEndereco)





module.exports = router;