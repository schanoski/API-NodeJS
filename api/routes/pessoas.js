const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const PessoaModel = mongoose.model('Pessoas');

router.get('/', async (req, res, next) => {
    try {
        const pessoas = await PessoaModel.find()
        .select("nome sobrenome email telefone status");
        res.status(200).json({
            count: pessoas.length,
            pessoas: pessoas.map(pessoa => {
                return {
                    nome: pessoa.nome,
                    sobrenome: pessoa.sobrenome,
                    email: pessoa.email,
                    telefone: pessoa.telefone,
                    status: pessoa.status,
                    _id: pessoa._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/pessoas/"
                         + pessoa._id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/', async (req, res, next) => {
    try{
        const pessoa = new PessoaModel({
            nome: pessoa.body.nome,
            sobrenome: pessoa.body.sobrenome,
            email: pessoa.body.email,
            telefone: pessoa.body.telefone,
            status: pessoa.body.status,
        });
        await pessoa.save();
        res.status(201).json({
            message: 'Pessoa cadastrada com sucesso!',
            createdPessoa: {
                nome: pessoa.nome,
                    sobrenome: pessoa.sobrenome,
                    email: pessoa.email,
                    telefone: pessoa.telefone,
                    status: pessoa.status,
                    _id: pessoa._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/pessoas/"
                        + pessoa._id
                }
            }
        })  
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/:pessoaId', async (req, res, next) => {
    const id = req.params.pessoaId;

    try {
        const pessoa = await PessoaModel.findOne({_id: id});
        if (pessoa) {
            res.status(200).json({
                pessoa: pessoa,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/pessoas"
                }
              });
        } else {
            res.status(404).json("Pessoa não existente!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.patch('/:pessoaId', async (req, res, next) => {
    const id = req.params.pessoaId;
    const updateCampos = {};
    Object.entries(req.body).map (item => {
        console.log(item);
        updateCampos[item[0]] = item[1];
    })
    try {
        let status = await PessoaModel.updateOne({_id: id}, 
            { $set: updateCampos});

        res.status(200).json({
            message: 'Cadastro de pessoa atualizado',
            status: status,
            request: {
              type: "GET",
              url: "http://localhost:3000/pessoas/" + id
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

})


router.delete('/:pessoaId', async (req, res, next) => {
    const id = req.params.pessoaId;

    try {
        let status = await PessoaModel.deleteOne({_id: id});
        
            res.status(200).json({
                message: 'Pessoa deletada',
                status: status
            })
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
})

module.exports = router;