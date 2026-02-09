// ==================== User Management System ====================
class UserManager {
    constructor() {
        this.storageKey = 'bakeryUsers';
        this.users = this.loadUsers();
        this.initializeDefaultUser();
    }

    loadUsers() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    }

    initializeDefaultUser() {
        // Create default admin user if no users exist
        if (this.users.length === 0) {
            this.users.push({
                id: this.generateId(),
                username: 'anchen',
                password: this.hashPassword('madbatter2026'),
                email: 'anchen101@gmail.com',
                role: 'admin',
                securityQuestion: 'What is the name of your bakery?',
                securityAnswer: this.hashPassword('the mad batter'),
                createdAt: new Date().toISOString(),
                isActive: true
            });
            this.saveUsers();
        }
    }

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Simple hash function (for client-side use)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }

    findUser(username) {
        return this.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.isActive);
    }

    validateCredentials(username, password) {
        const user = this.findUser(username);
        if (!user) return null;
        
        const hashedPassword = this.hashPassword(password);
        if (user.password === hashedPassword) {
            return user;
        }
        return null;
    }

    validateSecurityAnswer(username, answer) {
        const user = this.findUser(username);
        if (!user) return false;
        
        const hashedAnswer = this.hashPassword(answer.toLowerCase().trim());
        return user.securityAnswer === hashedAnswer;
    }

    resetPassword(username, newPassword) {
        const user = this.findUser(username);
        if (!user) return false;
        
        user.password = this.hashPassword(newPassword);
        this.saveUsers();
        return true;
    }

    createUser(userData) {
        // Check if username already exists
        if (this.findUser(userData.username)) {
            return { success: false, error: 'Username already exists' };
        }

        const newUser = {
            id: this.generateId(),
            username: userData.username,
            password: this.hashPassword(userData.password),
            email: userData.email || '',
            role: userData.role || 'user',
            securityQuestion: userData.securityQuestion,
            securityAnswer: this.hashPassword(userData.securityAnswer.toLowerCase().trim()),
            createdAt: new Date().toISOString(),
            isActive: true
        };

        this.users.push(newUser);
        this.saveUsers();
        return { success: true, user: newUser };
    }

    getAllUsers() {
        return this.users.filter(u => u.isActive);
    }

    updateSecurityQuestion(username, newQuestion, newAnswer) {
        const user = this.findUser(username);
        if (!user) return false;
        
        user.securityQuestion = newQuestion;
        user.securityAnswer = this.hashPassword(newAnswer.toLowerCase().trim());
        this.saveUsers();
        return true;
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.isActive = false;
            this.saveUsers();
            return true;
        }
        return false;
    }
}

// ==================== Login Attempt Tracker ====================
class LoginAttemptTracker {
    constructor() {
        this.storageKey = 'loginAttempts';
        this.maxAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    }

    getAttempts(username) {
        const stored = localStorage.getItem(this.storageKey);
        const attempts = stored ? JSON.parse(stored) : {};
        return attempts[username] || { count: 0, lastAttempt: null, lockedUntil: null };
    }

    recordAttempt(username, success) {
        const stored = localStorage.getItem(this.storageKey);
        const attempts = stored ? JSON.parse(stored) : {};
        
        if (success) {
            // Clear attempts on successful login
            delete attempts[username];
        } else {
            // Increment failed attempts
            const userAttempts = attempts[username] || { count: 0, lastAttempt: null, lockedUntil: null };
            userAttempts.count++;
            userAttempts.lastAttempt = new Date().toISOString();
            
            if (userAttempts.count >= this.maxAttempts) {
                userAttempts.lockedUntil = new Date(Date.now() + this.lockoutDuration).toISOString();
            }
            
            attempts[username] = userAttempts;
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(attempts));
    }

    isLocked(username) {
        const attempts = this.getAttempts(username);
        if (!attempts.lockedUntil) return false;
        
        const lockedUntil = new Date(attempts.lockedUntil);
        const now = new Date();
        
        if (now < lockedUntil) {
            const minutesLeft = Math.ceil((lockedUntil - now) / 60000);
            return { locked: true, minutesLeft };
        }
        
        // Lock expired, reset attempts
        this.resetAttempts(username);
        return false;
    }

    resetAttempts(username) {
        const stored = localStorage.getItem(this.storageKey);
        const attempts = stored ? JSON.parse(stored) : {};
        delete attempts[username];
        localStorage.setItem(this.storageKey, JSON.stringify(attempts));
    }

    getRemainingAttempts(username) {
        const attempts = this.getAttempts(username);
        return Math.max(0, this.maxAttempts - attempts.count);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserManager, LoginAttemptTracker };
}
