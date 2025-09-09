class loadQuest {
    constructor(questData) {
        this.data = questData;
        this.current = -1;
        this.questionNumber = 0;
        this.score = 0;
        questData.forEach(q => {
            if (q.type !== 't') this.questionNumber++;
        })

    }


    loadNextQuest() {
        if (this.currentCard) this.currentCard.remove();
        if (this.data.length <= ++this.current) {
            this.endQuiz();
            return null;
        }


        let currentQuest = this.data[this.current];
        this.currentCard = null;
        if (currentQuest.type === 'mc') {
            this.currentCard = new multipleChoice(currentQuest);
        }
        if (currentQuest.type == 'tq') {
            this.currentCard = new inputQuestion(currentQuest);

        }
        if (currentQuest.type === 'ddq') {
            this.currentCard = new dragDropQuestion(currentQuest);
        }
        if (currentQuest.type === 't') {
            this.currentCard = new textCard(currentQuest);
        }
        this.currentCard.show();



        let isQ = currentQuest.type !== 't';
        const qUIs = document.querySelectorAll('[data-id="qUI"]');
        els.btnNext.disabled = isQ;
        if (isQ) {
            els.counter.textContent = `Question ${this.current} / ${this.questionNumber}`
        }

        qUIs.forEach(element => {
            if (!isQ) element.classList.add("hidden")
            else element.classList.remove("hidden")
        });

        const tUIs = document.querySelectorAll('[data-id="tUI"]');
        tUIs.forEach(element => {
            if (isQ) element.classList.add("hidden")
            else element.classList.remove("hidden")
        });



    }

    checkQuestion() {
        let result = this.currentCard.check();
        if (result === null) return null;
        if(result === true) this.score ++;
        els.btnNext.disabled = false;
        els.bar.style.width = this.current / this.questionNumber * 100 + "%";
    }

    endQuiz() {
        // Hide all quiz elements
        const qUIs = document.querySelectorAll('[data-id="qUI"]');
        const tUIs = document.querySelectorAll('[data-id="tUI"]');
        const card = document.getElementById('card');
        const textUI = document.getElementById('textUI');
        const progress = document.querySelector('.progress');
        const counter = document.querySelector('.counter');
        const footer = document.querySelector('.footer');
        
        qUIs.forEach(element => element.classList.add("hidden"));
        tUIs.forEach(element => element.classList.add("hidden"));
        card.classList.add("hidden");
        textUI.classList.add("hidden");
        progress.classList.add("hidden");
        counter.classList.add("hidden");
        footer.classList.add("hidden");
        
        // Show end card
        els.endCard.classList.remove("hidden");
        
        // Calculate and display score
        const correctAnswers = this.score;
        const totalQuestions = this.questionNumber;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        els.scorePercentage.textContent = percentage;
        
       
        els.endMessage.textContent = "done";
       
        els.btnCloseQuiz.addEventListener('click', () => {
            this.closeQuiz();
        });
        
    }
    
    closeQuiz() {
        // Hide the entire app
        const app = document.getElementById('quiz');
        app.classList.add("hidden")
        document.getElementById('searchLocation').classList.remove("hidden")
       
    }
    /*
    restartQuiz() {
        // Reset quiz state
        this.current = -1;
        this.score = 0;
        
        // Hide end card
        els.endCard.classList.add("hidden");
        
        // Show quiz elements again
        const qUIs = document.querySelectorAll('[data-id="qUI"]');
        const tUIs = document.querySelectorAll('[data-id="tUI"]');
        const card = document.getElementById('card');
        const textUI = document.getElementById('textUI');
        const progress = document.querySelector('.progress');
        const counter = document.querySelector('.counter');
        const footer = document.querySelector('.footer');
        
        qUIs.forEach(element => element.classList.remove("hidden"));
        tUIs.forEach(element => element.classList.remove("hidden"));
        card.classList.remove("hidden");
        textUI.classList.remove("hidden");
        progress.classList.remove("hidden");
        counter.classList.remove("hidden");
        footer.classList.remove("hidden");
        
        // Reset progress bar
        els.bar.style.width = "0%";
        
        // Start quiz from beginning
        this.loadNextQuest();
    }*/

}