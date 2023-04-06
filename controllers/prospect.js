const Prospect = require('../models/prospect');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapBoxToken});
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const prospects = await Prospect.find({});
    res.render('prospects/index', {prospects})
};


module.exports.renderNewForm = (req, res) => {
    res.render('prospects/new', {isIndex: true,});
};

module.exports.addPlayer = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.prospect.hometown,
        limit: 1
    }).send()
    const prospect = new Prospect(req.body.prospect);
    prospect.geometry =  geoData.body.features[0].geometry;
    prospect.images = req.files.map(f =>({url: f.path, filename: f.filename}))
    prospect.author = req.user._id
    await prospect.save();
    req.flash('success', 'Successfully added a new Prospect!')
    res.redirect(`/prospects/${prospect._id}`)
};

module.exports.showPlayer = async (req, res,) => {
        const prospect = await Prospect.findById(req.params.id).populate({
            path: 'takes',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if(!prospect){
            req.flash('error', 'Cannot find that player');
            return res.redirect('/prospects');
        }
        res.render('prospects/show', { prospect });
};

module.exports.editPlayer = async (req, res) => {
    const { id } = req.params;
    const prospect = await Prospect.findById(id);
    if(!prospect){
        req.flash('error', 'Cannot find that player');
        return res.redirect('/prospects');
    }
    res.render('prospects/edit', { prospect });
};

module.exports.updatePlayer = async (req, res) => {
    const { id } = req.params;
    const prospect = await Prospect.findByIdAndUpdate(id, { ...req.body.prospect });
    const imgs = req.files.map(f =>({url: f.path, filename: f.filename}))
    prospect.images.push(...imgs);
    await prospect.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
       await prospect.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated Prospect!')
    res.redirect(`/prospects/${prospect._id}`);
};

module.exports.deletePlayer = async (req, res) => {
    const { id } = req.params;
    await Prospect.findByIdAndDelete(id);
    res.redirect('/prospects');
};
