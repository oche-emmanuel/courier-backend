const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth admin & get token
// @route   POST /admin/login
// @access  Public
const authAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            console.log('Admin not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await admin.matchPassword(password);
        console.log(`Password match outcome: ${isMatch}`);

        if (isMatch) {
            const token = generateToken(admin._id);
            res.json({
                _id: admin._id,
                email: admin.email,
                token: token,
            });
        } else {
            console.log('Password mismatch');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('SERVER ERROR IN authAdmin:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        });
    }
};

// @desc    Update admin profile
// @route   PUT /admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
        admin.email = req.body.email || admin.email;
        if (req.body.password) {
            admin.password = req.body.password;
        }

        const updatedAdmin = await admin.save();

        res.json({
            _id: updatedAdmin._id,
            email: updatedAdmin.email,
            token: generateToken(updatedAdmin._id),
        });
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
};

module.exports = { authAdmin, updateAdminProfile };
