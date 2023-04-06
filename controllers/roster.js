const Roster = require('../models/roster');
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const rosters = await Roster.find({});
    res.render('UNCroster/index', { rosters })
};

module.exports.renderNewForm = (req, res) => {
    res.render('UNCroster/new');
};

module.exports.addPlayer = async (req, res, next) => {
    const roster = new Roster(req.body.roster);
    roster.images = req.files.map(f =>({url: f.path, filename: f.filename}))
    roster.author = req.user._id
    await roster.save();
    req.flash('success', 'Successfully added a new Tarheel!')
    res.redirect(`/UNCroster/${roster._id}`)
};

module.exports.showPlayer = async (req, res,) => {
        const roster = await Roster.findById(req.params.id).populate({
            path: 'takes',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if(!roster){
            req.flash('error', 'Cannot find that player');
            return res.redirect('/UNCroster');
        }
        res.render('UNCroster/show', {
            roster,
            isIndex: true,
            });
};

module.exports.editPlayer = async (req, res) => {
    const { id } = req.params;
    const roster = await Roster.findById(id);
    if(!roster){
        req.flash('error', 'Cannot find that player');
        return res.redirect('/UNCroster');
    }
    res.render('UNCroster/edit', {roster});
};

module.exports.updatePlayer = async (req, res) => {
    const { id } = req.params;
    const roster = await Roster.findByIdAndUpdate(id, { ...req.body.roster });
    const imgs = req.files.map(f =>({url: f.path, filename: f.filename}))
    roster.images.push(...imgs);
    await roster.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
       await roster.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated Tarheel!')
    res.redirect(`/UNCroster/${roster._id}`);
};

module.exports.deletePlayer = async (req, res) => {
    const { id } = req.params;
    await Roster.findByIdAndDelete(id);
    res.redirect('/UNCroster');
};
