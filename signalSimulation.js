class SignalSimulation {
    
    constructor() {
        this.isSearching = false;
        this.searchDuration = 5000; // 5 seconds
        this.signalStates = ['weak', 'medium', 'strong'];
        this.currentState = 0;
        this.searchInterval = null;
    }
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
    }
    
    updateSignalState() {
        const state = this.signalStates[this.currentState];
        const container = els.pulsatingCircle.parentElement;
        
        // Remove previous signal classes
        container.classList.remove('signal-weak', 'signal-medium', 'signal-strong');
        container.classList.add(`signal-${state}`);
        
        // Update signal text
        const messages = {
            weak: 'far...',
            medium: 'getting closer...',
            strong: 'right there!'
        };
        els.signalText.textContent = messages[state];
        
        // Update circle content
        const icons = {
            weak: '📡',
            medium: '📶',
            strong: '🎯'
        };
        els.pulsatingCircle.textContent = icons[state];
    }
    
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
    }
    
    resetSignal() {
        const container = els.pulsatingCircle.parentElement;
        container.classList.remove('signal-weak', 'signal-medium', 'signal-strong');
        els.pulsatingCircle.textContent = '📍';
        els.signalText.textContent = 'Ready to search';
    }
}