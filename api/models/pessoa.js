const mongoose = require('mongoose');

const pessoaSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: { type: String },
    email: {type: String},
    telefone: {type: String},
    status: {type: Boolean}
},
{
    timestamps: true
});

mongoose.model('Pessoa', pessoaSchema);