const Take = require('../models/take');
const Prospect = require('../models/prospect');

module.exports.createScout = async (req,res) => {
    const prospect = await Prospect.findById(req.params.id);
    const scout= new Take(req.body.scout);
    // may need to change take
    scout.author = req.user._id;
    prospect.takes.push(scout);
    console.log(prospect.takes);
        // scouts is from ProspectSchema object
    await scout.save();
    await prospect.save();
    req.flash('success', 'Created Scouting Report!')
    res.redirect(`/prospects/${prospect._id}`);
};

module.exports.deleteScout = async(req, res) => {
    const {id, scoutId} = req.params
    Prospect.findByIdAndUpdate(id, {$pull: {takes: scoutId}});
    // pull operator removes from an existing array(takes) all instances of a value or values that match a specified condition.
    await Take.findByIdAndDelete(scoutId)
    // may need new model named scout
    req.flash('success', 'Successfully deleted your scouting report')
    res.redirect(`/prospects/${prospect._id}`);
};
