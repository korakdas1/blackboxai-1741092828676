// Export WorkoutTimer class
export class WorkoutTimer {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.interval = null;
        this.elapsedTime = 0;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.interval = setInterval(() => this.updateTimer(), 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
            this.elapsedTime = Date.now() - this.startTime;
        }
    }

    reset() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.elapsedTime = 0;
        this.updateDisplay('00:00');
    }

    updateTimer() {
        const currentTime = Date.now();
        this.elapsedTime = currentTime - this.startTime;
        this.updateDisplay(this.formatTime(this.elapsedTime));
    }

    formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDisplay(time) {
        // This will be overridden by the app.js implementation
        console.log(time);
    }
}

// Workout Plans Database
const workoutPlans = {
    beginner: {
        id: 'beginner',
        name: 'Beginner Workout',
        difficulty: 'Easy',
        duration: 20,
        calories: '150-200',
        description: 'Perfect for those just starting their fitness journey',
        exercises: [
            {
                name: 'Jumping Jacks',
                duration: 60,
                type: 'warmup',
                instructions: 'Start with feet together and arms at sides, then jump to wide stance while raising arms above head'
            },
            {
                name: 'Body Weight Squats',
                sets: 3,
                reps: 10,
                instructions: 'Stand with feet shoulder-width apart, lower body as if sitting back into a chair'
            },
            {
                name: 'Push-ups (Modified)',
                sets: 3,
                reps: 8,
                instructions: 'Start on knees if needed, lower chest to ground keeping body straight'
            },
            {
                name: 'Walking Lunges',
                sets: 2,
                reps: 10,
                instructions: 'Step forward with one leg, lowering hips until both knees are bent at 90 degrees'
            },
            {
                name: 'Plank Hold',
                duration: 30,
                type: 'core',
                instructions: 'Hold straight body position supported by forearms and toes'
            }
        ]
    },
    intermediate: {
        id: 'intermediate',
        name: 'Intermediate Workout',
        difficulty: 'Medium',
        duration: 35,
        calories: '300-350',
        description: 'Challenge yourself with more intense exercises',
        exercises: [
            {
                name: 'Mountain Climbers',
                duration: 60,
                type: 'warmup',
                instructions: 'Start in plank position, alternately drive knees toward chest'
            },
            {
                name: 'Burpees',
                sets: 3,
                reps: 12,
                instructions: 'Drop to ground, perform push-up, jump feet forward, explode up with jump'
            },
            {
                name: 'Diamond Push-ups',
                sets: 3,
                reps: 12,
                instructions: 'Form diamond shape with hands under chest, perform push-up'
            },
            {
                name: 'Jump Squats',
                sets: 3,
                reps: 15,
                instructions: 'Perform regular squat, explode upward into jump at top'
            },
            {
                name: 'Russian Twists',
                sets: 3,
                reps: 20,
                instructions: 'Sit with knees bent, feet off ground, rotate torso side to side'
            }
        ]
    }
};

// Exercise Categories
const exerciseCategories = {
    warmup: 'Warm-up exercises to prepare your body',
    strength: 'Exercises focused on building muscle and strength',
    cardio: 'Exercises to improve cardiovascular fitness',
    core: 'Exercises targeting core muscles',
    cooldown: 'Cool-down exercises to safely end your workout'
};

// Workout Progress Tracking
class WorkoutTracker {
    constructor() {
        this.currentWorkout = null;
        this.exerciseIndex = 0;
        this.currentSet = 1;
    }

    startWorkout(workoutId) {
        this.currentWorkout = workoutPlans[workoutId];
        this.exerciseIndex = 0;
        this.currentSet = 1;
        return this.getCurrentExercise();
    }

    getCurrentExercise() {
        if (!this.currentWorkout || this.exerciseIndex >= this.currentWorkout.exercises.length) {
            return null;
        }
        return {
            ...this.currentWorkout.exercises[this.exerciseIndex],
            currentSet: this.currentSet
        };
    }

    nextExercise() {
        if (!this.currentWorkout) return null;

        const currentExercise = this.getCurrentExercise();
        if (currentExercise.sets && this.currentSet < currentExercise.sets) {
            this.currentSet++;
        } else {
            this.exerciseIndex++;
            this.currentSet = 1;
        }

        return this.getCurrentExercise();
    }

    getProgress() {
        if (!this.currentWorkout) return 0;
        
        const totalExercises = this.currentWorkout.exercises.length;
        return (this.exerciseIndex / totalExercises) * 100;
    }
}

// Initialize workout tracker
const workoutTracker = new WorkoutTracker();

// Export functionality
export {
    workoutPlans,
    exerciseCategories,
    workoutTracker
};
