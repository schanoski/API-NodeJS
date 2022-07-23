const express = require('express');
const router = express.Router();
const controller = require('../controllers/pessoaController')

router.get('/', controller.getPessoas)
router.post('/', controller.postPessoa)
router.get('/:pessoaId', controller.getPessoaPorId)
router.patch('/:pessoaId', controller.atualizaPessoa)
router.delete('/:pessoaId', controller.deletarPessoa)

module.exports = router;