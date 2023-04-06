const mongoose = require('mongoose');
const Take = require('./take');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
        url: String,
        filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
   return this.url.replace('/upload', '/upload/w_200');
});

const RosterSchema = new Schema({
    name: String,
    images: [ImageSchema],
    number: Number,
    position: String,
    hometown: String,
    height: String,
    weight: Number,
    class: String,
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

});

RosterSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Take.deleteMany({
            _id:{
                $in: doc.takes
            }
        })

    }
})

module.exports = mongoose.model('Roster', RosterSchema);
