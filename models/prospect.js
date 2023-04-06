const mongoose = require('mongoose');
const Take = require('./take');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
        url: String,
        filename: String
});

// may have to make this a new variable

ImageSchema.virtual('thumbnail').get(function() {
   return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const ProspectSchema = new Schema({
    name: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    number: Number,
    position: String,
    hometown: String,
    height: String,
    weight: Number,
    year: String,
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    takes: [
        {type: Schema.Types.ObjectId,
        ref: 'Take'
    }
    ]

}, opts);

ProspectSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/prospects/${this.id}">${this.name}</a><strong>`
 });


ProspectSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Take.deleteMany({
            _id:{
                $in: doc.takes
            }
        })

    }
})

module.exports = mongoose.model('Prospect', ProspectSchema);
