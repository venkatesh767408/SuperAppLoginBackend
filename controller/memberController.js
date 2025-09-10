

const Member=require("../model/Member")

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || await Member.findOne({ name: name.toLowerCase() })) {
      return res.status(400).json({ message: 'Invalid or duplicate name' });
    }
    const member = new Member({ name, role: 'Member' });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};