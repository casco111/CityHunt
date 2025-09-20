const els = {

    upload:document.getElementById('upload'),
    createStory:document.getElementById('createStory'),
    startPanel:document.getElementById('startPanel'),
    bar: document.getElementById('bar'),
    counter: document.getElementById('counter'),
    qType: document.getElementById('qType'),
    qText: document.getElementById('qText'),
    tText: document.getElementById('tText'),
    options: document.getElementById('options'),
    textRow: document.getElementById('textRow'),
    textInput: document.getElementById('textInput'),
    btnSubmit: document.getElementById('btnSubmit'),
    btnNext: document.getElementById('btnNext'),
    btnRestart: document.getElementById('btnRestart'),
    feedback: document.getElementById('feedback'),
    explain: document.getElementById('explain'),
    imgContainer: document.getElementById('img-container'),
    endCard: document.getElementById('endCard'),
    finalScore: document.getElementById('finalScore'),
    totalQuestions: document.getElementById('totalQuestions'),
    scorePercentage: document.getElementById('scorePercentage'),
    endMessage: document.getElementById('endMessage'),
    btnCloseQuiz: document.getElementById('btnCloseQuiz'),
    btnRestartQuiz: document.getElementById('btnRestartQuiz'),
    searchLocation: document.getElementById('searchLocation'),
    pulsatingCircle: document.getElementById('pulsatingCircle'),
    signalText: document.getElementById('signalText'),
    btnGetDestination: document.getElementById('btnGetDestination'),
    btnStartQuest: document.getElementById('btnStartQuest'),
    quizPanel: document.getElementById('quiz'),
    searchPanel: document.getElementById('searchLocation'),
};

class multipleChoice {
    constructor(data) {
        this.data = data;
    }

    show() {
        els.qText.textContent = this.data.q;
        els.qType.textContent = "Multiple Choice"
        this.divs = [];
        this.data.options.forEach((element, i) => {
            const div = document.createElement("div");
            div.className = "opt";
            div.innerHTML = `<span class="dot"></span><span>${element}</span>`;
            div.addEventListener("click", () => {
                this.divs.forEach((e) => {
                    e.setAttribute('aria-checked', "false");
                });
                div.setAttribute('aria-checked', "true");
            })
            this.divs.push(div);
            els.options.append(div);
        });
        this.showImage();
    }
    showImage(){
        if(!this.data.img) return;
        const imgDiv = document.createElement("img");
        imgDiv.src = this.data.img;
        els.imgContainer.appendChild(imgDiv);
    }
    check() {
        let index = -1;
        this.divs.forEach((e, i) => {
            if (e.getAttribute('aria-checked') === "true") index = i;
            e.style.pointerEvents = "none";
        });
        let result = index == this.data.answer;
        els.explain.textContent = this.data.explain;
        els.feedback.textContent = result ? "correct!" : "wrong!";
        return result;
    }
    remove() {
        els.options.innerHTML = "";
        els.explain.textContent = ""
        els.feedback.textContent = ""
        els.imgContainer.innerHTML = "";
    }
}


class inputQuestion {
    constructor(data) {
        this.data = data;
    }

    show() {
        els.qText.textContent = this.data.q;
        els.qType.textContent = "Text Question"
        this.div = document.createElement('input');
        this.div.type = "text";
        this.div.placeholder = "enter answer...";
        this.div.addEventListener("change",()=>{
            this.input = this.div.value;
        })
        els.textRow.appendChild(this.div);
        this.showImage();
    }
    showImage(){
        if(!this.data.img) return;
        const imgDiv = document.createElement("img");
        imgDiv.src = this.data.img;
        els.imgContainer.appendChild(imgDiv);
    }
    check() {
        let result = false;
        this.data.answer.forEach((e,i)=>{
            if(e===this.input)result = true;
        });
        this.div.style.pointerEvents = "none";
        els.explain.textContent = this.data.explain;
        els.feedback.textContent = result ? "correct!" : "wrong!";
        return result;
    }
    remove() {
        els.textRow.innerHTML = "";
        els.explain.textContent = ""
        els.feedback.textContent = ""
        els.imgContainer.innerHTML = "";
    }
}


class dragDropQuestion {
    constructor(data) {
        this.data = data;
        this.draggables = [];
        this.drops = [];
    }

    show() {
        els.qText.textContent = this.data.q;
        els.qType.textContent = "Drag & Drop Question";

        // Create draggable options
        this.data.options.forEach((opt, i) => {
            const div = document.createElement("div");
            div.className = "draggable";
            div.draggable = true;
            div.textContent = opt;

            div.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", i); // store index
            });

            this.draggables.push(div);
            els.options.appendChild(div);
        });

        // Create drop zones
        this.data.targets.forEach((target, i) => {
            const dropZone = document.createElement("div");
            dropZone.className = "dropzone";
            dropZone.textContent = target.label;

            dropZone.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            dropZone.addEventListener("drop", (e) => {
                e.preventDefault();
                const index = e.dataTransfer.getData("text/plain");
                const dragged = this.draggables[index];

                // Clear old child if exists
                dropZone.innerHTML = target.label + " → ";
                dropZone.appendChild(dragged);
                dropZone.setAttribute("data-answer", index);
            });

            this.drops.push(dropZone);
            els.textRow.appendChild(dropZone);
        });

        this.showImage();
    }

    showImage() {
        if (!this.data.img) return;
        const imgDiv = document.createElement("img");
        imgDiv.src = this.data.img;
        els.imgContainer.appendChild(imgDiv);
    }

    check() {
        let result = true;

        this.drops.forEach((drop, i) => {
            drop.style.pointerEvents = "none";
            const given = drop.getAttribute("data-answer");
            const expected = this.data.targets[i].answer;
            if (parseInt(given) !== expected) {
                result = false;
            }
        });

        els.explain.textContent = this.data.explain;
        els.feedback.textContent = result ? "correct!" : "wrong!";
        return result;
    }

    remove() {
        els.options.innerHTML = "";
        els.textRow.innerHTML = "";
        els.explain.textContent = "";
        els.feedback.textContent = "";
        els.imgContainer.innerHTML = "";
    }
}


class textCard {
    constructor(data) {
        this.data = data;
    }

    show() {
        els.qText.textContent = this.data.ht;
        els.tText.textContent = this.data.ct;
        this.showImage();
    }
    showImage(){
        if(!this.data.img) return;
        const imgDiv = document.createElement("img");
        imgDiv.src = this.data.img;
        els.imgContainer.appendChild(imgDiv);
    }
    check() {
        let index = -1;
        this.divs.forEach((e, i) => {
            if (e.getAttribute('aria-checked') === "true") index = i;
            e.style.pointerEvents = "none";
        });
        let result = index == this.data.answer;
        els.explain.textContent = this.data.explain;
        els.feedback.textContent = result ? "correct!" : "wrong!";
        return result;
    }
    remove() {
        els.qText.textContent = "";
        els.tText.textContent = "";
        els.imgContainer.innerHTML = "";
    }
}