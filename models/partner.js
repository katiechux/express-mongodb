const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartnerSchema = new Schema(
    {
        name: {
            type: 'String',
            required: true,
            unique: true
        },
        image: {
            type: 'String',
            required: true
        },
        featured: {
            type: 'Boolean',
            required: true
        },
        description: {
            type: 'String',
            required: true
        }
    }, {
        timestamps: true
    }
);

const Partner = mongoose.model('Partner', PartnerSchema);

module.exports = Partner;