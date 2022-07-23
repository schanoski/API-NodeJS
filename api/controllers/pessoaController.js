const mongoose = require('mongoose');
const { patch } = require('../routes/pessoas');
const PessoaModel = mongoose.model('Pessoa')

module.exports = {

    async getPessoas(req, res, next ){
        let pessoas = await PessoaModel.find()
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
    },

    async postPessoa(req, res, next){
        const pessoa = new PessoaModel({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            telefone: req.body.telefone,
            status: req.body.status
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
    },

    async getPessoaPorId(req, res, next){
        const id = req.params.pessoaId;
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
    },

    async atualizaPessoa(req, res, next){
        const id = req.params.pessoaId;
        const updateCampos = {};
        Object.entries(req.body).map (item => {
            console.log(item);
            updateCampos[item[0]] = item[1];
        })

        let status = await PessoaModel.updateOne({_id: id}, 
            { $set: updateCampos});

        res.status(200).json({
            message: 'Pessoa Atualizada',
            status: status,
            request: {
                type: "GET",
                url: "http://localhost:3000/pessoas/" + id
            }
        })
    },

    async deletePessoa(res, req, next){
        const id = req.params.pessoaId;
        let status = await PessoaModel.deleteOne({_id: id});
        res.status(200).json({
            message: 'Pessoa deletada',
            status: status
        })
    }



}