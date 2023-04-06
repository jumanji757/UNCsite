const Take = require('../models/take');
const Roster = require('../models/roster');

module.exports.createTake = async (req,res) => {
    const roster = await Roster.findById(req.params.id);
    const take = new Take(req.body.take);
    take.author = req.user._id;
    roster.takes.push(take);
    
        // takes is from RosterSchema object
    await take.save();
    await roster.save();
    req.flash('success', 'Created Hot Take!')
    res.redirect(`/UNCroster/${roster._id}`)
};

module.exports.deleteTake = async(req, res) => {
    const {id, takeId} = req.params
    Roster.findByIdAndUpdate(id, {$pull: {takes: takeId}});
    // pull operator removes from an existing array(takes) all instances of a value or values that match a specified condition.
    await Take.findByIdAndDelete(takeId)
    req.flash('success', 'Successfully deleted your terrible take!')
    res.redirect(`/UNCroster/${id}`);
};
