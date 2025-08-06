const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/cloudidada');
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@cloudidada.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`   📧 Email: ${existingAdmin.email}`);
      console.log(`   👤 Name: ${existingAdmin.name}`);
      console.log(`   🎭 Role: ${existingAdmin.role}`);
      console.log(`   🆔 ID: ${existingAdmin._id}`);
      return;
    }

    // Create admin user
    console.log('🔧 Creating admin user...');
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@cloudidada.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      plan: 'enterprise',
      isEmailVerified: true,
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🎯 Admin Login Credentials:');
    console.log('   📧 Email: admin@cloudidada.com');
    console.log('   🔑 Password: admin123');
    console.log('');
    console.log('🌐 Admin Panel: http://localhost:3000');

    // Also create a test regular user for frontend testing
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('🔧 Creating test user for frontend...');
      const regularUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'user',
        plan: 'free',
        isEmailVerified: true,
        isActive: true
      });

      await regularUser.save();
      console.log('✅ Test user created!');
      console.log('   📧 Email: test@example.com');
      console.log('   🔑 Password: test123');
    }

    // Show total user count
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdminUser();
