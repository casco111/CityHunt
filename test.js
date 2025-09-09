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


const quests = [
    { type: "t", ht: "Which language runs in a web browser?", ct: "moin lennard \n du hund" },
    { type: "tq", q: "What color do you get when you mix blue and yellow?", answer: ["green"], explain: "Blue + yellow = green.", img: "https://www.animenachrichten.de/wp-content/uploads/2018/11/OK-saitama-one-punch-man-39439986-1920-1080.png" },
    { type: "mc", q: "Which language runs in a web browser?", options: ["Python", "C++", "JavaScript", "Java"], answer: 2, explain: "JavaScript is built into browsers." }
];


const lQ = new loadQuest(quests);
lQ.loadNextQuest();

els.btnNext.addEventListener("click", () => {
    lQ.loadNextQuest();
})
els.btnSubmit.addEventListener("click", () => {
    lQ.checkQuestion();
})

// Signal simulation for destination search
let signalSimulation = {
    isSearching: false,
    searchDuration: 5000, // 5 seconds
    signalStates: ['weak', 'medium', 'strong'],
    currentState: 0,
    searchInterval: null,
    
    startSearch() {
        if (this.isSearching) return;
        
        this.isSearching = true;
        els.btnGetDestination.disabled = true;
        els.btnGetDestination.querySelector('.btn-text').textContent = 'Searching...';
        
        // Start with weak signal
        this.currentState = 0;
        this.updateSignalState();
        
        // Progress through signal states
        this.searchInterval = setInterval(() => {
            this.currentState++;
            if (this.currentState < this.signalStates.length) {
                this.updateSignalState();
            } else {
                this.completeSearch();
            }
        }, this.searchDuration / this.signalStates.length);
    },
    
    updateSignalState() {
        const state = this.signalStates[this.currentState];
        const container = els.pulsatingCircle.parentElement;
        
        // Remove previous signal classes
        container.classList.remove('signal-weak', 'signal-medium', 'signal-strong');
        container.classList.add(`signal-${state}`);
        
        // Update signal text
        const messages = {
            weak: 'Weak signal...',
            medium: 'Signal improving...',
            strong: 'Strong signal!'
        };
        els.signalText.textContent = messages[state];
        
        // Update circle content
        const icons = {
            weak: '📡',
            medium: '📶',
            strong: '🎯'
        };
        els.pulsatingCircle.textContent = icons[state];
    },
    
    completeSearch() {
        clearInterval(this.searchInterval);
        this.isSearching = false;
        
        // Show completion state
        els.pulsatingCircle.textContent = '✅';
        els.signalText.textContent = 'Destination found!';
        
        // Reset button
        els.btnGetDestination.disabled = false;
        els.btnGetDestination.querySelector('.btn-text').textContent = 'Get Next Destination';
        
        // Reset signal state after a delay
        setTimeout(() => {
            this.resetSignal();
        }, 2000);
    },
    
    resetSignal() {
        const container = els.pulsatingCircle.parentElement;
        container.classList.remove('signal-weak', 'signal-medium', 'signal-strong');
        els.pulsatingCircle.textContent = '📍';
        els.signalText.textContent = 'Ready to search';
    }
};

// Add event listener for the destination button
els.btnGetDestination.addEventListener('click', () => {
    signalSimulation.startSearch();
});