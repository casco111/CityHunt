let quests = [];
let signalSimulation;
let storageKey;
let finalScore= 0;
els.upload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();     // read file as text
    const data = JSON.parse(text);      // convert to JS object/array

    quests = data;
    els.searchLocation.classList.remove("hidden");
    els.startPanel.classList.add("hidden");

    storageKey = file.name;
    let storedIndex = parseInt(localStorage.getItem(storageKey));
    let storedScore = parseInt(localStorage.getItem(storageKey+"_score"));
    
    if(storedIndex) {
        if(storedIndex < quests.length && confirm("load saved Progress?")){

            currentQuestIndex = storedIndex;
            finalScore = storedScore;
        }
    }
    signalSimulation = new SignalSimulation(quests[currentQuestIndex]);
  });


let currentQuestIndex = 0;
let lQ = null;


// Add event listener for the destination button
els.btnGetDestination.addEventListener('click', () => {
    signalSimulation.startSearch();
});
els.btnStartQuest.addEventListener('click', () => {
    signalSimulation = null;
    els.searchLocation.classList.add("hidden")
    els.quizPanel.classList.remove("hidden")
    lQ = new loadQuest(quests[currentQuestIndex].questions);
    lQ.loadNextQuest();
});
els.btnNext.addEventListener("click", () => {
    lQ.loadNextQuest();
    els.btnSubmit.disabled =false;
})
els.btnSubmit.addEventListener("click", () => {
    lQ.checkQuestion();
    els.btnSubmit.disabled = true;
})
els.btnCloseQuiz.addEventListener('click', () => {
    finalScore = (finalScore*currentQuestIndex + lQ.scorePercentage)/(currentQuestIndex+1)
    lQ.closeQuiz(); //apply results
    currentQuestIndex++;
    localStorage.setItem(storageKey, currentQuestIndex);
    localStorage.setItem(storageKey+"_score", finalScore);
    if (currentQuestIndex >= quests.length) {
        endGame();
        return;
    }
    signalSimulation = new SignalSimulation(quests[currentQuestIndex]);
});

function endGame(){
    els.gameEndPanel.classList.remove('hidden');
    els.searchLocation.classList.add('hidden');
    els.finalScore.textContent = Math.round(finalScore);
}
function resetGame(){
    els.gameEndPanel.classList.add('hidden');
    els.startPanel.classList.remove('hidden');
    currentQuestIndex =0;
    finalScore = 0;
    storageKey= null;
    quests = [];
    lQ = null;
}


let holdTimer;
function startHold(e) {
    e.preventDefault();
    els.skipSearchButton.classList.add('holding'); //TODO
    
    holdTimer = setTimeout(() => {
      signalSimulation.completeSearch();
      els.btnStartQuest.click();
    }, 3000);
  }
  
  function cancelHold() {
    els.skipSearchButton.classList.remove('holding');
    clearTimeout(holdTimer);
  }
els.skipSearchButton.addEventListener('pointerdown',startHold );
els.skipSearchButton.addEventListener('pointerup',cancelHold );
els.skipSearchButton.addEventListener('pointerleave',cancelHold );


//#region story Editor
// Story Editor functionality
let storyData = [];
let locationCounter = 0;

// Show story editor when Create Story button is clicked
document.getElementById('createStory').addEventListener('click', () => {
    document.getElementById('startPanel').classList.add('hidden');
    document.getElementById('storyEditor').classList.remove('hidden');
    storyData = [];
    locationCounter = 0;
    updateStoryContent();
});

// Back to start panel
document.getElementById('backToStart').addEventListener('click', () => {
    document.getElementById('storyEditor').classList.add('hidden');
    document.getElementById('startPanel').classList.remove('hidden');
});

// Add new location
document.getElementById('addLocation').addEventListener('click', () => {
    const newLocation = {
        location: {
            latitude: 48.200100 + (locationCounter * 0.0001),
            longitude: 16.370100 + (locationCounter * 0.0001)
        },
        questions: []
    };
    storyData.push(newLocation);
    locationCounter++;
    updateStoryContent();
});

// Save story as JSON
document.getElementById('saveStory').addEventListener('click', () => {
    const jsonString = JSON.stringify(storyData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-story.cityHunt';
    a.click();
    URL.revokeObjectURL(url);
});

function updateStoryContent() {
    const content = document.getElementById('storyContent');
    if (storyData.length === 0) {
        content.innerHTML = '<div class="small" style="text-align: center; margin: 20px 0;">Click "Add Location" to begin creating your story</div>';
        return;
    }

    content.innerHTML = storyData.map((location, locationIndex) => `
        <div class="location-editor">
            <div class="location-header">
                <span class="location-title">Location ${locationIndex + 1}</span>
                <button class="remove-location" onclick="removeLocation(${locationIndex})">×</button>
            </div>
            <div class="coord-inputs">
                <input type="number" placeholder="Latitude" value="${location.location.latitude}" step="0.000001" onchange="updateLocation(${locationIndex}, 'latitude', this.value)">
                <input type="number" placeholder="Longitude" value="${location.location.longitude}" step="0.000001" onchange="updateLocation(${locationIndex}, 'longitude', this.value)">
            </div>
            <div class="questions-container" id="questions-${locationIndex}">
                ${location.questions.map((question, questionIndex) => createQuestionEditor(locationIndex, questionIndex, question)).join('')}
            </div>
            <button class="add-option" onclick="addQuestion(${locationIndex})">+ Add Question</button>
        </div>
    `).join('');
}

function createQuestionEditor(locationIndex, questionIndex, question) {
    const isText = question.type === 't';
    const isMC = question.type === 'mc';
    
    return `
        <div class="question-editor">
            <button class="remove-question" onclick="removeQuestion(${locationIndex}, ${questionIndex})">Remove</button>
            <div class="question-type">
                <select onchange="updateQuestionType(${locationIndex}, ${questionIndex}, this.value)">
                    <option value="t" ${isText ? 'selected' : ''}>Text/Story</option>
                    <option value="mc" ${isMC ? 'selected' : ''}>Multiple Choice</option>
                </select>
            </div>
            ${isText ? `
                <input class="editor-input" placeholder="Title/Header" value="${question.ht || ''}" onchange="updateQuestionField(${locationIndex}, ${questionIndex}, 'ht', this.value)">
                <input class="editor-input" placeholder="Image URL (optional)" value="${question.img || ''}" onchange="updateQuestionField(${locationIndex}, ${questionIndex}, 'img', this.value)">
                <textarea class="editor-textarea" placeholder="Story text..." onchange="updateQuestionField(${locationIndex}, ${questionIndex}, 'ct', this.value)">${question.ct || ''}</textarea>
            ` : `
                <input class="editor-input" placeholder="Question" value="${question.q || ''}" onchange="updateQuestionField(${locationIndex}, ${questionIndex}, 'q', this.value)">
                <input class="editor-input" placeholder="Image URL (optional)" value="${question.img || ''}" onchange="updateQuestionField(${locationIndex}, ${questionIndex}, 'img', this.value)">
                <div class="options-editor">
                    <label>Options:</label>
                    ${(question.options || []).map((option, optionIndex) => `
                        <div class="option-input">
                            <input value="${option}" onchange="updateOption(${locationIndex}, ${questionIndex}, ${optionIndex}, this.value)">
                            <button onclick="removeOption(${locationIndex}, ${questionIndex}, ${optionIndex})">×</button>
                        </div>
                    `).join('')}
                    <button class="add-option" onclick="addOption(${locationIndex}, ${questionIndex})">+ Add Option</button>
                </div>
                <input class="editor-input" placeholder="Correct answer index (0, 1, 2...)" type="number" value="${question.answer || 0}" onchange="updateQuestionField(${locationIndex}, ${questionIndex}, 'answer', parseInt(this.value))">
                <input class="editor-input" placeholder="Explanation" value="${question.explain || ''}" onchange="updateQuestionField(${locationIndex}, ${questionIndex}, 'explain', this.value)">
            `}
        </div>
    `;
}

// Global functions for the story editor
window.updateLocation = (locationIndex, field, value) => {
    storyData[locationIndex].location[field] = parseFloat(value);
};

window.removeLocation = (locationIndex) => {
    storyData.splice(locationIndex, 1);
    updateStoryContent();
};

window.addQuestion = (locationIndex) => {
    if (!storyData[locationIndex].questions) {
        storyData[locationIndex].questions = [];
    }
    storyData[locationIndex].questions.push({ type: 't', ht: '', ct: '', img: '' });
    updateStoryContent();
};

window.removeQuestion = (locationIndex, questionIndex) => {
    storyData[locationIndex].questions.splice(questionIndex, 1);
    updateStoryContent();
};

window.updateQuestionType = (locationIndex, questionIndex, type) => {
    const question = storyData[locationIndex].questions[questionIndex];
    question.type = type;
    if (type === 'mc') {
        question.q = question.ht || '';
        question.options = ['', ''];
        question.answer = 0;
        question.explain = '';
        delete question.ht;
        delete question.ct;
    } else {
        question.ht = question.q || '';
        question.ct = '';
        delete question.q;
        delete question.options;
        delete question.answer;
        delete question.explain;
    }
    updateStoryContent();
};

window.updateQuestionField = (locationIndex, questionIndex, field, value) => {
    storyData[locationIndex].questions[questionIndex][field] = value;
};

window.addOption = (locationIndex, questionIndex) => {
    if (!storyData[locationIndex].questions[questionIndex].options) {
        storyData[locationIndex].questions[questionIndex].options = [];
    }
    storyData[locationIndex].questions[questionIndex].options.push('');
    updateStoryContent();
};

window.removeOption = (locationIndex, questionIndex, optionIndex) => {
    storyData[locationIndex].questions[questionIndex].options.splice(optionIndex, 1);
    updateStoryContent();
};

window.updateOption = (locationIndex, questionIndex, optionIndex, value) => {
    storyData[locationIndex].questions[questionIndex].options[optionIndex] = value;
};




//#endregion