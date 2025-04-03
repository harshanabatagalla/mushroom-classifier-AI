
const User = require('../models/User');

module.exports = async function createAdmin() {
  try {
    // Check if admin already exists
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      // Create admin user
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });
      
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
