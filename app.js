let exerciseLogger;
document.addEventListener('DOMContentLoaded', () => {
    exerciseLogger = new ExerciseHistoryLogger();
});

class ExerciseHistoryLogger {
    constructor() {
        this.exerciseHistory = this.loadHistory();
        this.currentPlan = [];
        this.init();
    }
    init() {
        this.Setup();
        this.displayPlans();
    }

    Setup() {
        const addExerciseBtn = document.getElementById('addExerciseBtn');
        const exerciseInputs = [
            document.getElementById('exerciseName'),
            document.getElementById('sets'),
            document.getElementById('reps'),
            document.getElementById('weight')
        ];

        addExerciseBtn.addEventListener('click', () => this.addExerciseToPlan());

        exerciseInputs.forEach(input => {
            input.addEventListener('keypress', e => {
                if (e.key === 'Enter') this.addExerciseToPlan();
            });
        });
    }

    addExerciseToPlan() {
        const planName = document.getElementById('planName').value.trim();
        const exerciseName = document.getElementById('exerciseName').value.trim();
        const sets = document.getElementById('sets').value;
        const reps = document.getElementById('reps').value;
        const weight = document.getElementById('weight').value;

        if (!exerciseName) {
            alert('Please enter an exercise name');
            document.getElementById('exerciseName').focus();
            return;
        }

        if (!sets || !reps) {
            alert('Please enter sets and reps');
            return;
        }

        const exercise = {
            name: exerciseName,
            sets: Number(sets),
            reps: Number(reps),
            weight: Number(weight),
            id: Date.now() + Math.random()
        };

        const finalPlanName = planName || `Workout ${new Date().toLocaleDateString()}`;

        let existingPlan = this.exerciseHistory.find(plan => plan.name === finalPlanName);
        
        if (!existingPlan) {
            existingPlan = {
                name: finalPlanName,
                exercises: [],
            };
            this.exerciseHistory.push(existingPlan);
        }

        existingPlan.exercises.push(exercise);

        if (!planName) document.getElementById('planName').value = finalPlanName;

        document.getElementById('exerciseName').value = '';
        document.getElementById('sets').value = '';
        document.getElementById('reps').value = '';
        document.getElementById('weight').value = '';

        document.getElementById('exerciseName').focus();

        this.saveHistory();
        this.displayPlans();
    }

    displayPlans() {
        const container = document.getElementById('plansContainer');
        
        if (this.exerciseHistory.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <p class="text-lg">No workout plans yet!</p>
                    <p>Add your first exercise above to get started</p>
                </div>
            `;
            return;
        }
//CHATGPT
        let plansHTML = '';
        
        this.exerciseHistory.forEach((plan, index) => {
            let exercisesHTML = '';
            plan.exercises.forEach((exercise, exerciseIndex) => {
                const weightText = exercise.weight ? ` @ ${exercise.weight}kg` : '';
                exercisesHTML += `
                    <div class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded border-l-4 border-blue-400">
                        <span class="font-medium">${exercise.name}</span>
                        <div class="flex items-center gap-4">
                            <span class="text-sm text-gray-600">
                                ${exercise.sets} sets × ${exercise.reps} reps${weightText}
                            </span>
                            <button 
                                onclick="exerciseLogger.deleteExercise(${index}, ${exerciseIndex})"
                                class="text-red-500 hover:text-red-700 text-sm"
                                title="Delete exercise">
                                ❌
                            </button>
                        </div>
                    </div>
                `;
            });
            
            plansHTML += `
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div class="mb-3">
                        <h3 class="text-lg font-semibold text-gray-800">${plan.name}</h3>
                        <p class="text-sm text-gray-500">${plan.date} • ${plan.exercises.length} exercise${plan.exercises.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div class="space-y-2">
                        ${exercisesHTML}
                    </div>
                </div>
            `;
        });

        container.innerHTML = plansHTML;
    }

    deleteExercise(planIndex, exerciseIndex) {
        const plan = this.exerciseHistory[planIndex];
        plan.exercises.splice(exerciseIndex, 1);

        if (plan.exercises.length === 0) {
            this.exerciseHistory.splice(planIndex, 1);
        }

        this.saveHistory();
        this.displayPlans();
    }

    newPlan() {
        document.getElementById('planName').value = '';
        document.getElementById('exerciseName').value = '';
        document.getElementById('sets').value = '';
        document.getElementById('reps').value = '';
        document.getElementById('weight').value = '';
        document.getElementById('planName').focus();
    }

//CHATGPT
    saveHistory() {
        localStorage.setItem('gymWorkoutHistory', JSON.stringify(this.exerciseHistory));
    }
    loadHistory() {
        const saved = localStorage.getItem('gymWorkoutHistory');
        return saved ? JSON.parse(saved) : [];
    }
}