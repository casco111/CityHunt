class SignalSimulation {
    
    constructor(questData) {
        this.isSearching = false;
        this.searchDuration = 5000; // 5 seconds
        this.signalStates = ['weak', 'medium', 'strong'];
        this.currentState = 0;
        this.searchInterval = null;
        this.questData = questData;
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

        this.openLocation();
    }
    

    openLocation() {
      

        const { latitude, longitude } = this.questData.location;
        
        // Validate coordinates
        if (!latitude || !longitude) {
            console.warn('Invalid coordinates provided');
            return;
        }

        // Detect if device is iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        let mapsUrl;
        
        if (isIOS) {
            // Use Apple Maps for iOS devices
            mapsUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;
        } else {
            // Use Google Maps for other devices
            mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
        
        // Open the maps URL
        try {
            window.open(mapsUrl, '_blank');
            console.log(`Opening ${isIOS ? 'Apple Maps' : 'Google Maps'} for coordinates: ${latitude}, ${longitude}`);
        } catch (error) {
            console.error('Failed to open maps:', error);
            // Fallback: try to open in the same window
            window.location.href = mapsUrl;
        }
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