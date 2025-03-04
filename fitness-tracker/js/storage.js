// Storage Keys
const STORAGE_KEYS = {
    WORKOUTS: 'fittrack_workouts',
    USER_PROFILE: 'fittrack_user',
    WORKOUT_HISTORY: 'fittrack_history',
    SETTINGS: 'fittrack_settings'
};

// Storage Manager Class
class StorageManager {
    constructor() {
        this.initialized = this.initializeStorage();
    }

    // Initialize storage with default values if empty
    initializeStorage() {
        if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
            this.saveSettings({
                notifications: true,
                darkMode: false,
                units: 'metric' // or 'imperial'
            });
        }

        if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
            this.saveUserProfile({
                name: 'User',
                level: 'beginner',
                goals: {
                    weeklyWorkouts: 3,
                    dailyCalories: 2500
                }
            });
        }

        return true;
    }

    // Workout History Methods
    saveWorkoutSession(workout) {
        const history = this.getWorkoutHistory();
        history.unshift({
            ...workout,
            id: Date.now(),
            date: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
    }

    getWorkoutHistory() {
        const history = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
        return history ? JSON.parse(history) : [];
    }

    clearWorkoutHistory() {
        localStorage.removeItem(STORAGE_KEYS.WORKOUT_HISTORY);
        return true;
    }

    // User Profile Methods
    saveUserProfile(profile) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    }

    getUserProfile() {
        const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        return profile ? JSON.parse(profile) : null;
    }

    updateUserProfile(updates) {
        const currentProfile = this.getUserProfile();
        const updatedProfile = { ...currentProfile, ...updates };
        this.saveUserProfile(updatedProfile);
        return updatedProfile;
    }

    // Settings Methods
    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }

    getSettings() {
        const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : null;
    }

    updateSettings(updates) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...updates };
        this.saveSettings(updatedSettings);
        return updatedSettings;
    }

    // Statistics and Analytics
    getWorkoutStats() {
        const history = this.getWorkoutHistory();
        
        return {
            totalWorkouts: history.length,
            totalCalories: history.reduce((sum, workout) => sum + workout.calories, 0),
            totalMinutes: history.reduce((sum, workout) => sum + workout.duration, 0),
            // Last 7 days stats
            weeklyStats: this.getWeeklyStats(history),
            // Monthly progress
            monthlyProgress: this.getMonthlyProgress(history)
        };
    }

    getWeeklyStats(history) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyWorkouts = history.filter(workout => 
            new Date(workout.date) >= oneWeekAgo
        );

        return {
            workouts: weeklyWorkouts.length,
            calories: weeklyWorkouts.reduce((sum, workout) => sum + workout.calories, 0),
            minutes: weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0)
        };
    }

    getMonthlyProgress(history) {
        const monthlyData = {};
        
        history.forEach(workout => {
            const month = new Date(workout.date).toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = {
                    workouts: 0,
                    calories: 0,
                    minutes: 0
                };
            }
            monthlyData[month].workouts++;
            monthlyData[month].calories += workout.calories;
            monthlyData[month].minutes += workout.duration;
        });

        return monthlyData;
    }

    // Data Export
    exportUserData() {
        return {
            profile: this.getUserProfile(),
            history: this.getWorkoutHistory(),
            settings: this.getSettings(),
            stats: this.getWorkoutStats()
        };
    }

    // Clear All Data
    clearAllData() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
        return true;
    }
}

// Create and export storage instance
const storage = new StorageManager();
export default storage;
