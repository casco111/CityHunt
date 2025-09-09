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
            strong: 100,    // within 100 meters
            medium: 500,    // within 500 meters
            weak: 2000      // within 2 kilometers
        };
    }
    startSearch() {
        if (this.isSearching) return;
        this.isSearching = true;
        els.btnGetDestination.disabled = true;
        els.btnGetDestination.querySelector('.btn-text').textContent = 'Searching...';
        
        this.openLocation();
        // Start location tracking
        this.startLocationTracking();
        
        // Start with weak signal
        this.currentState = 0;
        this.updateSignalState();
        
        // Progress through signal states with location-based updates
        this.searchInterval = setInterval(() => {
            this.updateSignalBasedOnLocation();
        }, 1000); // Update every second

        // Complete search after duration
        setTimeout(() => {
            this.completeSearch();
        }, this.searchDuration);
    }

    startLocationTracking() {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        this.locationWatchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log('Location updated:', this.currentLocation);
            },
            (error) => {
                console.error('Error getting location:', error);
                // Fallback to default signal progression if location fails
                this.fallbackToDefaultSignal();
            },
            options
        );
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

        let signalState;
        if (distance <= this.distanceThresholds.strong) {
            signalState = 'strong';
        } else if (distance <= this.distanceThresholds.medium) {
            signalState = 'medium';
        } else if (distance <= this.distanceThresholds.weak) {
            signalState = 'weak';
        } else {
            signalState = 'very-weak';
        }

        this.updateSignalStateByDistance(signalState, distance);
    }

    updateSignalStateByDistance(signalState, distance) {
        const container = els.pulsatingCircle.parentElement;
        
        // Remove previous signal classes
        container.classList.remove('signal-weak', 'signal-medium', 'signal-strong', 'signal-very-weak');
        container.classList.add(`signal-${signalState}`);
        
        // Update signal text with distance
        const distanceText = distance < 1000 ? 
            `${Math.round(distance)}m away` : 
            `${(distance / 1000).toFixed(1)}km away`;
            
        const messages = {
            'very-weak': `Very far... (${distanceText})`,
            'weak': `Far... (${distanceText})`,
            'medium': `Getting closer... (${distanceText})`,
            'strong': `Right there! (${distanceText})`
        };
        els.signalText.textContent = messages[signalState];
        
        // Update circle content
        const icons = {
            'very-weak': '📡',
            'weak': '📡',
            'medium': '📶',
            'strong': '🎯'
        };
        els.pulsatingCircle.textContent = icons[signalState];
    }

    fallbackToDefaultSignal() {
        // Fallback to time-based signal progression if location fails
        this.currentState = 0;
        this.updateSignalState();
        
        const fallbackInterval = setInterval(() => {
            this.currentState++;
            if (this.currentState < this.signalStates.length) {
                this.updateSignalState();
            } else {
                clearInterval(fallbackInterval);
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
        
        // Stop location tracking
        if (this.locationWatchId) {
            navigator.geolocation.clearWatch(this.locationWatchId);
            this.locationWatchId = null;
        }
        
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
        container.classList.remove('signal-weak', 'signal-medium', 'signal-strong', 'signal-very-weak');
        els.pulsatingCircle.textContent = '📍';
        els.signalText.textContent = 'Ready to search';
    }
}