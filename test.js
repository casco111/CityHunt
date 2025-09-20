console.log("test")



/*
els.bar.style.width = "20%"
const div = document.createElement('div');
div.className = 'opt';
//div.setAttribute('role','radio');
//div.setAttribute('aria-checked','false');
//div.tabIndex = 0;
div.innerHTML = `<span class="dot"></span><span>test</span>`;
div.addEventListener("click", ()=>{
    let set = div.getAttribute('aria-checked')||"false";
    set = set == "false"? "true" : "false"; 
    div.setAttribute('aria-checked',set+"");
})

els.options.appendChild(div);

const div2 = document.createElement('input');
div2.type = "text";
div2.placeholder = "text";

els.textRow.appendChild(div2);

const q1 =   { type: "mc", q: "Which language runs in a web browser?", options: ["Python", "C++", "JavaScript", "Java"], answer: 2, explain: "JavaScript is built into browsers." };


let mc = new multipleChoice(q1);
//mc.show();

const q2 =  { type: "text", q: "What color do you get when you mix blue and yellow?", answer: ["green"], explain: "Blue + yellow = green.", img:"https://www.animenachrichten.de/wp-content/uploads/2018/11/OK-saitama-one-punch-man-39439986-1920-1080.png" };
let tq = new inputQuestion(q2);
tq.show();
els.btnSubmit.addEventListener("click", ()=>{
   // console.log(mc.check())
    console.log(tq.check())
})
*/




let quests = [];
els.upload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();     // read file as text
    const data = JSON.parse(text);      // convert to JS object/array

    quests = data;
    console.log("JS object:", quests);
    els.searchLocation.classList.remove("hidden");
    els.startPanel.classList.add("hidden");
  });


let currentQuestIndex = 0;
let lQ = null;
// Signal simulation for destination search

let signalSimulation = new SignalSimulation(quests[currentQuestIndex]);

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
})
els.btnSubmit.addEventListener("click", () => {
    lQ.checkQuestion();
})
els.btnCloseQuiz.addEventListener('click', () => {
    lQ.closeQuiz(); //apply results
    currentQuestIndex++;
    if (currentQuestIndex >= quests.length) {
        return;
    }
    signalSimulation = new SignalSimulation(quests[currentQuestIndex]);
});


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