const Taskmodel = require("../model/TaskModel");
const {isPast} = require("date-fns");

const TaskValidation = async(req, res, next) => {

    const {macaddress, type, title, description, when} = req.body;
    
    if (!macaddress || !type || !title || !description || !when)
        return res.status(400).json({error: 'Preencha os campos obrigatórios!'});
    else if(isPast(new Date(when)))
        return res.status(400).json({error: 'Preencha uma data válida'});
    else {
        let exists;

        if(req.params.id){
            exists = await Taskmodel
            .findOne({  '_id': {'$ne' : req.params.id},
                        'when': {'$eq' : new Date(when)},
                        'macaddress': {'$in': macaddress}
            });
        } else {

        exists = await Taskmodel
        .findOne(
            {'when': {'$eq' : new Date(when)},
             'macaddress': {'$in': macaddress}
            });

    }
    
    if(exists){
        return res.status(400).json({error : 'Já existe uma tarefa nesse dia e horário'});
    }
        next();
    }

}

module.exports = TaskValidation;