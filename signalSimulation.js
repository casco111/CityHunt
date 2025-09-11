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
            strong: 20,    // within 20 meters
            medium: 50,    // within 50 meters
            weak: 200      // within 200 meters
        };
    }
    startSearch() {
        if (this.isSearching) return;
        this.isSearching = true;
        els.btnGetDestination.disabled = true;
        els.btnGetDestination.querySelector('.btn-text').textContent = 'Searching...';
        
        // Start location tracking
        // On iOS/Safari, requesting once on user gesture helps trigger the prompt
        this.checkSecureContext();
        this.requestInitialPosition()
            .catch(() => {
                // If initial read fails, continue with fallback behavior
                this.fallbackToDefaultSignal();
            })
            .finally(() => {
                this.startLocationTracking();
            });
        
        // Start with weak signal
        this.currentState = 0;
        this.updateSignalState();
        
        // Progress through signal states with location-based updates
        this.searchInterval = setInterval(() => {
            this.updateSignalBasedOnLocation();
        }, 1000); // Update every second
        //this.openLocation();
        
    }

    startLocationTracking() {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser');
            this.fallbackToDefaultSignal();
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 30000,
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
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                let message = 'Error getting location';
                if (error && typeof error.code === 'number') {
                    if (error.code === 1) message = 'Location permission denied';
                    if (error.code === 2) message = 'Location unavailable';
                    if (error.code === 3) message = 'Location timeout';
                }
                if (isIOS && !this.isSecureOrigin()) {
                    message += ' (iOS requires HTTPS or localhost)';
                }
                console.error(message, error);
                // Fallback to default signal progression if location fails
                this.fallbackToDefaultSignal();
            },
            options
        );
    }

    requestInitialPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject(new Error('Geolocation not supported'));
            }
            const options = {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log('Initial location:', this.currentLocation);
                    resolve(position);
                },
                (error) => {
                    reject(error);
                },
                options
            );
        });
    }

    isSecureOrigin() {
        if (location.protocol === 'https:') return true;
        const host = location.hostname;
        return host === 'localhost' || host === '127.0.0.1' || host === '::1';
    }

    checkSecureContext() {
        const isSecure = this.isSecureOrigin();
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (!isSecure && isIOS) {
            console.warn('iOS requires HTTPS/localhost for geolocation. Current origin is not secure.');
            alert('On iPhone, location only works over HTTPS or localhost. Please open this page via HTTPS.');
        }
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