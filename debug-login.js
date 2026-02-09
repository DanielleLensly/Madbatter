// Debug Script - Run this in Browser Console (F12)
// This will help diagnose login issues

console.log('=== LOGIN DEBUG ===');

// Check if users exist in localStorage
const usersKey = 'bakeryUsers';
const storedUsers = localStorage.getItem(usersKey);

if (!storedUsers) {
  console.log('❌ No users found in localStorage');
  console.log('Creating default admin user...');
  
  const defaultUser = {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    securityQuestion: 'What is your favorite color?',
    securityAnswer: 'blue',
    createdDate: new Date().toISOString()
  };
  
  localStorage.setItem(usersKey, JSON.stringify([defaultUser]));
  console.log('✅ Default user created!');
  console.log('Username: admin');
  console.log('Password: admin123');
} else {
  console.log('✅ Users found in localStorage:');
  const users = JSON.parse(storedUsers);
  users.forEach(user => {
    console.log(`- Username: ${user.username}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Role: ${user.role}`);
  });
}

console.log('\n=== Try logging in now ===');
