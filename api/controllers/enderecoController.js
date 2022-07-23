const mongoose = require('mongoose')
const EnderecoModel = mongoose.model('Endereco')
const PessoaModel = mongoose.model('Pessoa')


module.exports = {

    async getEnderecos(req, res, next){
        const enderecos = await EnderecoModel.find({}).populate('pessoa', 'nome');
        res.status(200).json({
            count: enderecos.length,
            enderecos: enderecos.map(endereco => {
                return {
                    pessoa: endereco.pessoa,
                    cep: endereco.cep,
                    logradouro: endereco.logradouro,
                    complemento: endereco.complemento,
                    bairro : endereco.bairro,
                    cidade : endereco.cidade,
                    uf : endereco.uf,
                    _id: endereco._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/enderecos/" + endereco._id
                    }
                }
            })
        })
    },

    async postEndereco(req, res, next){
        let pessoa = await PessoaModel.findById(req.body.pessoa);

        if (!pessoa) {
            res.status(404).json({
                message: 'Pessoa not found'
            })
            return;
        }

        let endereco = new EnderecoModel({
            pessoa: req.body.pessoa,
            cep: req.body.cep,
            logradouro: req.body.logradouro,
            complemento: req.body.complemento,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            uf: req.body.uf
        })

        endereco = await endereco.save()

        console.log(endereco)
        res.status(201).json({
            message: 'Endereco criado com sucesso!',
            createdEndereco: {
                pessoa: endereco.pessoa,
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                complemento: endereco.complemento,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                uf : endereco.uf,
                _id: endereco._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/enderecos/" + endereco._id
                }
            }
        })
    },

    async getEnderecoPorId(req, res, next){
        const id = req.params.enderecoId;
        const endereco = await EnderecoModel.findOne({_id: id})
        .populate('pessoa');
        if (endereco) {
            res.status(200).json({
                endereco: endereco,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/enderecos"
                }
            })
        } else {
            res.status(404).json("Endereco não existente!");
        }
    },

    async deleteEndereco(req, res, next){
        let id = req.params.enderecoId;
        let status = await EnderecoModel.deleteOne({_id: id});
        res.status(200).json({
            message: 'Delete endereco',
            status: status
        })
    },

    async patchEndereco(req, res, next){
        const id = req.params.enderecoId
        const updateCampos = {};
        Object.entries(req.body).map(endereco => {
            console.log(endereco);
            updateCampos[endereco[0]] = endereco[1];
        })
        let status = await EnderecoModel.updateOne({ _id: id }, { $set: updateCampos});
        res.status(200).json({
            message: 'Enderecos Atualizado',
            status: status,
            request: {
                type: "GET",
                url: "http://localhost:3000/enderecos/" + id
            }
        })
    }
}