class SignalSimulation {
    
    constructor(questData) {
        this.isSearching = false;
        this.searchDuration = 5000; // 5 seconds
        this.signalStates = ['weak', 'medium', 'strong'];
        this.currentState = 0;
        this.searchInterval = null;
        this.questData = questData;
        this.currentLocation = null;
        this.locationWatchId = null;
        this.distanceThresholds = {
            strong: 20,    // within 50 meters
            medium: 50,    // within 100 meters
            weak: 200      // within 250 meters
        };
        this.resetSignal();
    }
    async startSearch() {
        if (this.isSearching) return;
        this.isSearching = true;
        els.btnGetDestination.disabled = true;
        els.btnGetDestination.querySelector('.btn-text').textContent = 'Searching...';
        this.updateSignalState();
        //this.openLocation(); ToDo ebnavbke
        const loc = await this.updateLocation();
        if(!loc)return;
        
        // Start with weak signal
        this.currentState = 0;
        
        // Progress through signal states with location-based updates
        this.searchInterval = setInterval(() => {
            this.updateLocation();
            this.updateSignalBasedOnLocation();
        }, 1000); // Update every second
        //this.openLocation();
    }

    async updateLocation() {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser');
            this.fallbackToDefaultSignal();
            return false;
        }
       
        navigator.geolocation.getCurrentPosition(position => {
            this.currentLocation = position.coords;
            console.log(this.currentLocation);
            return true;
        }, error => {
      
            console.log(`Unable to retrieve location${error}`);
            clearInterval(this.searchInterval)
            this.fallbackToDefaultSignal();
            return false;
        });
     
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    }

    updateSignalBasedOnLocation() {
        if (!this.currentLocation || !this.questData.location) {
            return;
        }

        const distance = this.calculateDistance(
            this.currentLocation.latitude,
            this.currentLocation.longitude,
            this.questData.location.latitude,
            this.questData.location.longitude
        );
        console.log(distance)


        if (distance <= this.distanceThresholds.strong) {
            this.completeSearch();
            return;
        } else if (distance <= this.distanceThresholds.medium) {
            this.currentState = 2;
        } else if (distance <= this.distanceThresholds.weak) {
            this.currentState = 1;
        } else {
            this.currentState = 0;
        }
        
        this.updateSignalState();
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
   

    fallbackToDefaultSignal() {
        // Fallback to time-based signal progression if location fails
        alert("Cannot read location")
        this.currentState = 0;
        this.updateSignalState();
        const fallbackInterval = setInterval(() => {
            this.currentState++;
            if (this.currentState < this.signalStates.length) {
                this.updateSignalState();
            } else {
                clearInterval(fallbackInterval);
                this.completeSearch();
            }
        }, this.searchDuration / this.signalStates.length);

       
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
            if (isIOS) {
                // For iOS, use location.href to avoid opening blank tabs
                window.location.href = mapsUrl;
                console.log(`Opening Apple Maps for coordinates: ${latitude}, ${longitude}`);
            } else {
                // For other devices, use window.open
                window.open(mapsUrl, '_blank');
                console.log(`Opening Google Maps for coordinates: ${latitude}, ${longitude}`);
            }
        } catch (error) {
            console.error('Failed to open maps:', error);
            // Fallback: try to open in the same window
            window.location.href = mapsUrl;
        }
    }
    
    completeSearch() {
        clearInterval(this.searchInterval);
        this.isSearching = false;
        
        els.btnGetDestination.disabled = false;
        els.btnGetDestination.classList.add("hidden");
        els.btnStartQuest.classList.remove("hidden");
       
    }
    
    resetSignal() {
        const container = els.pulsatingCircle.parentElement;
        container.classList.remove('signal-weak', 'signal-medium', 'signal-strong', 'signal-very-weak');
        els.pulsatingCircle.textContent = '📍';
        els.signalText.textContent = 'Ready to search';
        els.btnGetDestination.classList.remove("hidden")
        els.btnStartQuest.classList.add("hidden")
        els.btnGetDestination.querySelector('.btn-text').textContent = 'Get Next Destination';

    }

}