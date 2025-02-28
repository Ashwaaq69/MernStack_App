// const mongoose = require('mongoose');
// const ValidateMongoDbId = (id =>{
//     const isValid = mongoose.Types.ObjectId.isValid(id)
//     if(!isValid) throw new Error ('this id is not valid or not found ')
// });

// module.exports = ValidateMongoDbId;

const mongoose = require('mongoose');

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error("This ID is not valid or not found");
    }
};

module.exports = validateMongoDbId;



