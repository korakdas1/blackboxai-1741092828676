import { workoutTracker, WorkoutTimer } from './workouts.js';
import storage from './storage.js';

// DOM Elements
const sections = {
    home: document.getElementById('home'),
    workouts: document.getElementById('workouts'),
    history: document.getElementById('history'),
    profile: document.getElementById('profile')
};

const navLinks = document.querySelectorAll('nav a');

// Navigation Handler
function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    
    // Hide all sections
    Object.values(sections).forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show target section
    sections[targetId].classList.remove('hidden');
    
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('text-white');
            link.classList.remove('text-gray-300');
        } else {
            link.classList.add('text-gray-300');
            link.classList.remove('text-white');
        }
    });
}

// Initialize Navigation
navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
});

// Initialize Workout Timer
const workoutTimer = new WorkoutTimer();

// Update History Section
function updateHistorySection() {
    const historySection = document.getElementById('history');
    const workouts = storage.getWorkoutHistory();
    
    if (historySection && workouts.length > 0) {
        const historyList = historySection.querySelector('.divide-y');
        if (historyList) {
            historyList.innerHTML = workouts
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(workout => `
                    <div class="p-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-semibold text-gray-700">${workout.name}</h3>
                                <p class="text-sm text-gray-500">${new Date(workout.date).toLocaleString()}</p>
                            </div>
                            <span class="text-blue-600">${workout.calories} cal</span>
                        </div>
                    </div>
                `).join('');
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    sections.home.classList.remove('hidden');
    
    // Update history section
    updateHistorySection();
    
    // Timer Controls
    const startWorkoutBtn = document.getElementById('startWorkoutBtn');
    const timerBtn = document.getElementById('timerBtn');
    const completeWorkoutBtn = document.getElementById('completeWorkoutBtn');
    const timerDisplay = document.getElementById('timerDisplay');

    let isWorkoutActive = false;

    startWorkoutBtn.addEventListener('click', () => {
        if (!isWorkoutActive) {
            isWorkoutActive = true;
            workoutTimer.start();
            startWorkoutBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';
            completeWorkoutBtn.classList.remove('hidden');
        } else {
            isWorkoutActive = false;
            workoutTimer.pause();
            startWorkoutBtn.innerHTML = '<i class="fas fa-play-circle mr-2"></i>Resume';
        }
    });

    timerBtn.addEventListener('click', () => {
        workoutTimer.reset();
        isWorkoutActive = false;
        startWorkoutBtn.innerHTML = '<i class="fas fa-play-circle mr-2"></i>Start Workout';
        completeWorkoutBtn.classList.add('hidden');
    });

    completeWorkoutBtn.addEventListener('click', () => {
        const workout = {
            name: 'Custom Workout',
            calories: Math.floor(Math.random() * 200) + 100, // Random calories for demo
            duration: Math.floor(workoutTimer.elapsedTime / 1000) // Convert to seconds
        };
        
        storage.saveWorkoutSession(workout);
        updateHistorySection();
        workoutTimer.reset();
        isWorkoutActive = false;
        startWorkoutBtn.innerHTML = '<i class="fas fa-play-circle mr-2"></i>Start Workout';
        completeWorkoutBtn.classList.add('hidden');
    });

    // Update timer display
    workoutTimer.updateDisplay = (time) => {
        timerDisplay.textContent = time;
    };

    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
});
