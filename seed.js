const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        await Admin.deleteMany();

        const admin = new Admin({
            email: 'admin@example.com',
            password: 'password12'
        });

        await admin.save();

        console.log('Admin user created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: password12');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedAdmin();
