// Tracker Simulator Game
class TrackerSimulator {
    constructor() {
        this.timeLimit = 45; // seconds
        this.timeRemaining = this.timeLimit;
        this.trackersBlocked = 0;
        this.totalTrackers = 3;
        this.gameActive = false;
        this.timerInterval = null;
        this.dataLeakInterval = null;
        this.requestInterval = null;
        this.timeOnSiteCounter = 0;
        this.dataLeaked = 0;
        
        this.trackers = [
            { id: 1, name: 'analytics.com', company: 'Analytics Tracker', blocked: false, codeDeleted: false },
            { id: 2, name: 'adnetwork.com', company: 'Ad Network', blocked: false, codeDeleted: false },
            { id: 3, name: 'databroker.com', company: 'Data Broker', blocked: false, codeDeleted: false }
        ];
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.blockedElement = document.getElementById('blocked');
        this.dataLeakedElement = document.getElementById('dataLeaked');
        this.timeOnSiteElement = document.getElementById('timeOnSite');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.gameResult = document.getElementById('gameResult');
        this.terminal = document.getElementById('terminal');
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        // Delete buttons for code lines
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codeLine = e.target.closest('.tracking-line');
                const trackerId = parseInt(codeLine.getAttribute('data-tracker'));
                this.deleteCode(trackerId, codeLine);
            });
        });
        
        // Product interaction tracking - show detail page
        document.querySelectorAll('.btn-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productName = productCard.querySelector('h4').textContent;
                const productPrice = productCard.getAttribute('data-price');
                const productIcon = productCard.getAttribute('data-icon');
                this.showDetailPage(productName, productPrice, productIcon);
            });
        });
        
        // Back button functionality
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showMainPage());
        }
    }
    
    startGame() {
        if (this.gameActive) return;
        
        this.gameActive = true;
        this.timeRemaining = this.timeLimit;
        this.trackersBlocked = 0;
        this.dataLeaked = 0;
        this.timeOnSiteCounter = 0;
        this.gameResult.classList.add('hidden');
        this.startBtn.disabled = true;
        
        // Reset trackers
        this.trackers.forEach(tracker => {
            tracker.blocked = false;
            tracker.codeDeleted = false;
        });
        
        // Reset UI
        document.querySelectorAll('.tracking-line').forEach(line => {
            line.classList.remove('deleted');
        });
        
        // Clear terminal
        this.terminal.innerHTML = '<div class="terminal-line">$ Monitoring network traffic...</div>';
        
        this.updateUI();
        this.startTimer();
        this.startDataLeak();
        this.startNetworkRequests();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.timeOnSiteCounter++;
            this.updateUI();
            
            if (this.timeRemaining <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }
    
    startDataLeak() {
        // Simulate data being collected over time
        this.dataLeakInterval = setInterval(() => {
            if (this.gameActive) {
                const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted).length;
                this.dataLeaked += activeTrackers * 0.5; // 0.5 KB per tracker per second
                this.updateUI();
            }
        }, 1000);
    }
    
    startNetworkRequests() {
        // Simulate network requests appearing in terminal
        let requestCount = 0;
        this.requestInterval = setInterval(() => {
            if (this.gameActive) {
                const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted);
                
                if (activeTrackers.length > 0 && requestCount < 20) {
                    const tracker = activeTrackers[Math.floor(Math.random() * activeTrackers.length)];
                    this.addNetworkRequest(tracker);
                    requestCount++;
                }
            }
        }, 2000); // New request every 2 seconds
    }
    
    addNetworkRequest(tracker, action = 'pageview', data = '') {
        const requestLine = document.createElement('div');
        requestLine.className = 'terminal-line request';
        requestLine.setAttribute('data-tracker', tracker.id);
        
        let url = `https://${tracker.name}/track?user=12345&action=${action}`;
        if (data) {
            url += `&data=${encodeURIComponent(data)}`;
        }
        url += `&time=${Date.now()}`;
        
        requestLine.innerHTML = `
            → GET ${url}
            <span class="block-link" onclick="game.blockRequest(${tracker.id})">[ BLOCK ]</span>
        `;
        
        this.terminal.appendChild(requestLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    showDetailPage(productName, productPrice, productIcon) {
        // Hide main page, show detail page
        const mainPage = document.getElementById('mainPage');
        const detailPage = document.getElementById('detailPage');
        
        mainPage.style.display = 'none';
        detailPage.style.display = 'block';
        
        // Update detail page content
        document.getElementById('detailIcon').textContent = productIcon;
        document.getElementById('detailName').textContent = productName;
        document.getElementById('detailPrice').textContent = productPrice;
        
        // Customize description based on product
        const descriptions = {
            'Smartphone Pro': 'Experience cutting-edge technology with our latest flagship smartphone. Features a stunning display, powerful processor, and advanced camera system.',
            'Laptop Ultra': 'Power through your workday with this ultra-portable laptop. Combining performance with portability for the modern professional.',
            'Smart Watch': 'Stay connected and track your fitness goals with our advanced smartwatch. Monitor your health, receive notifications, and more.',
            'Wireless Headphones': 'Immerse yourself in premium sound quality with our wireless headphones. Active noise cancellation and all-day battery life.'
        };
        
        const specs = {
            'Smartphone Pro': [
                '6.7" OLED Display',
                '256GB Storage',
                '5G Connectivity',
                '48MP Triple Camera System',
                'All-day battery life'
            ],
            'Laptop Ultra': [
                '15.6" 4K Display',
                'Intel Core i7 Processor',
                '16GB RAM, 512GB SSD',
                'NVIDIA Graphics',
                'Up to 12 hours battery'
            ],
            'Smart Watch': [
                'Heart Rate Monitor',
                'GPS Tracking',
                'Water Resistant',
                '7-day battery life',
                'Sleep tracking'
            ],
            'Wireless Headphones': [
                'Active Noise Cancellation',
                'Premium Audio Quality',
                '30-hour battery life',
                'Bluetooth 5.0',
                'Comfortable design'
            ]
        };
        
        document.getElementById('detailDescription').textContent = descriptions[productName] || 'High-quality product with excellent features and performance.';
        
        const specsList = document.getElementById('detailSpecs');
        specsList.innerHTML = '';
        (specs[productName] || ['Premium quality', 'Latest technology', 'Warranty included']).forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsList.appendChild(li);
        });
        
        // Send tracking requests silently (no popup)
        if (this.gameActive) {
            const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted);
            activeTrackers.forEach(tracker => {
                this.addNetworkRequest(tracker, 'click', productName);
            });
        }
    }
    
    showMainPage() {
        // Show main page, hide detail page
        const mainPage = document.getElementById('mainPage');
        const detailPage = document.getElementById('detailPage');
        
        mainPage.style.display = 'block';
        detailPage.style.display = 'none';
        
        // Send tracking request for returning to main page
        if (this.gameActive) {
            const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted);
            activeTrackers.forEach(tracker => {
                this.addNetworkRequest(tracker, 'pageview', 'main-page');
            });
        }
    }
    
    blockRequest(trackerId) {
        if (!this.gameActive) return;
        
        const tracker = this.trackers.find(t => t.id === trackerId);
        if (!tracker || tracker.blocked || tracker.codeDeleted) return;
        
        tracker.blocked = true;
        this.trackersBlocked++;
        
        // Update terminal to show blocked requests
        const requestLines = this.terminal.querySelectorAll(`[data-tracker="${trackerId}"]`);
        requestLines.forEach(line => {
            line.classList.remove('request');
            line.classList.add('blocked');
            const blockLink = line.querySelector('.block-link');
            if (blockLink) blockLink.remove();
        });
        
        // Add success message
        const successLine = document.createElement('div');
        successLine.className = 'terminal-line success';
        successLine.textContent = `✓ BLOCKED: All requests to ${tracker.name} have been blocked!`;
        this.terminal.appendChild(successLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        
        this.updateUI();
        this.checkWinCondition();
    }
    
    deleteCode(trackerId, codeLine) {
        if (!this.gameActive) return;
        
        const tracker = this.trackers.find(t => t.id === trackerId);
        if (!tracker || tracker.codeDeleted) return;
        
        tracker.codeDeleted = true;
        tracker.blocked = true; // Deleting code also stops tracking
        this.trackersBlocked++;
        
        // Update code display
        codeLine.classList.add('deleted');
        
        // Update terminal
        const successLine = document.createElement('div');
        successLine.className = 'terminal-line success';
        successLine.textContent = `✓ CODE DELETED: ${tracker.company} tracking pixel removed from HTML!`;
        this.terminal.appendChild(successLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        
        // Mark existing requests as blocked
        const requestLines = this.terminal.querySelectorAll(`[data-tracker="${trackerId}"]`);
        requestLines.forEach(line => {
            if (line.classList.contains('request')) {
                line.classList.remove('request');
                line.classList.add('blocked');
                const blockLink = line.querySelector('.block-link');
                if (blockLink) blockLink.remove();
            }
        });
        
        this.updateUI();
        this.checkWinCondition();
    }
    
    updateUI() {
        this.timerElement.textContent = `${this.timeRemaining}s`;
        this.blockedElement.textContent = `${this.trackersBlocked}/${this.totalTrackers}`;
        this.dataLeakedElement.textContent = `${this.dataLeaked.toFixed(1)} KB`;
        this.timeOnSiteElement.textContent = `${this.timeOnSiteCounter}s`;
        
        // Change timer color based on time remaining
        if (this.timeRemaining <= 15) {
            this.timerElement.style.color = '#f44336';
        } else if (this.timeRemaining <= 30) {
            this.timerElement.style.color = '#ff9800';
        } else {
            this.timerElement.style.color = '#667eea';
        }
        
        // Change data leaked color
        if (this.dataLeaked > 20) {
            this.dataLeakedElement.style.color = '#f44336';
        } else if (this.dataLeaked > 10) {
            this.dataLeakedElement.style.color = '#ff9800';
        } else {
            this.dataLeakedElement.style.color = '#667eea';
        }
    }
    
    checkWinCondition() {
        if (this.trackersBlocked >= this.totalTrackers) {
            this.endGame(true);
        }
    }
    
    endGame(won) {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        clearInterval(this.dataLeakInterval);
        clearInterval(this.requestInterval);
        this.startBtn.disabled = false;
        
        this.gameResult.classList.remove('hidden', 'win', 'lose');
        
        if (won) {
            this.gameResult.classList.add('win');
            this.gameResult.innerHTML = `
                <div style="font-size: 1.5em; margin-bottom: 15px;">🎉 Mission Accomplished! 🎉</div>
                <div style="font-size: 1em; margin-bottom: 10px;">
                    You successfully blocked all 3 trackers with ${this.timeRemaining} seconds remaining!
                </div>
                <div style="font-size: 0.9em; margin-bottom: 10px;">
                    📊 Data Leaked: <strong>${this.dataLeaked.toFixed(1)} KB</strong>
                </div>
                <div style="font-size: 0.85em; opacity: 0.95; line-height: 1.6; margin-top: 15px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                    <strong>🔒 In Real Life:</strong><br>
                    • Use browser extensions like <strong>uBlock Origin</strong> or <strong>Privacy Badger</strong><br>
                    • Enable <strong>tracking protection</strong> in your browser settings<br>
                    • Use <strong>Firefox</strong> or <strong>Brave</strong> browsers with built-in protection<br>
                    • Clear cookies regularly and disable third-party cookies
                </div>
            `;
        } else {
            const unblockedTrackers = this.totalTrackers - this.trackersBlocked;
            this.gameResult.classList.add('lose');
            this.gameResult.innerHTML = `
                <div style="font-size: 1.5em; margin-bottom: 15px;">⏰ Time's Up! ⏰</div>
                <div style="font-size: 1em; margin-bottom: 10px;">
                    You blocked ${this.trackersBlocked}/${this.totalTrackers} trackers
                </div>
                <div style="font-size: 0.9em; margin-bottom: 10px;">
                    📊 Data Leaked: <strong style="color: #ffeb3b;">${this.dataLeaked.toFixed(1)} KB</strong>
                </div>
                <div style="font-size: 0.85em; opacity: 0.95; line-height: 1.6; margin-top: 15px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                    <strong>⚠️ What Happened:</strong><br>
                    • ${unblockedTrackers} tracker(s) collected your browsing data<br>
                    • Your IP, location, browser info were shared with third parties<br>
                    • This data can be used for targeted advertising and profiling<br>
                    • In real life, this happens on most websites you visit!
                </div>
            `;
        }
        
        // Add final terminal message
        const finalLine = document.createElement('div');
        finalLine.className = 'terminal-line';
        finalLine.style.color = won ? '#4caf50' : '#f44336';
        finalLine.style.fontWeight = 'bold';
        finalLine.textContent = won ? 
            '$ Game Over - All trackers blocked!' : 
            `$ Game Over - ${unblockedTrackers} tracker(s) still active`;
        this.terminal.appendChild(finalLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    resetGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        clearInterval(this.dataLeakInterval);
        clearInterval(this.requestInterval);
        
        this.timeRemaining = this.timeLimit;
        this.trackersBlocked = 0;
        this.dataLeaked = 0;
        this.timeOnSiteCounter = 0;
        this.startBtn.disabled = false;
        this.gameResult.classList.add('hidden');
        
        // Reset trackers
        this.trackers.forEach(tracker => {
            tracker.blocked = false;
            tracker.codeDeleted = false;
        });
        
        // Reset code display
        document.querySelectorAll('.tracking-line').forEach(line => {
            line.classList.remove('deleted');
        });
        
        // Clear terminal
        this.terminal.innerHTML = `
            <div class="terminal-line">$ Monitoring network traffic...</div>
            <div class="terminal-line">$ Waiting for activity...</div>
        `;
        
        this.updateUI();
    }
}

// Initialize game
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new TrackerSimulator();
    
    // Add educational console messages
    console.log('%c🔒 Privacy Education Simulator', 'color: #667eea; font-size: 18px; font-weight: bold;');
    console.log('%c', 'font-size: 12px;');
    console.log('%cThis simulator demonstrates how websites track you:', 'color: #333; font-size: 14px; font-weight: bold;');
    console.log('%c1. Tracking pixels (1x1 invisible images) load in the background', 'color: #666; font-size: 12px;');
    console.log('%c2. They send network requests to third-party servers', 'color: #666; font-size: 12px;');
    console.log('%c3. Your personal data (IP, location, behavior) is collected', 'color: #666; font-size: 12px;');
    console.log('%c4. This data is shared, sold, and used for advertising', 'color: #666; font-size: 12px;');
    console.log('%c', 'font-size: 12px;');
    console.log('%c🛡️ Protect yourself:', 'color: #4caf50; font-size: 14px; font-weight: bold;');
    console.log('%c• Use uBlock Origin, Privacy Badger, or Ghostery', 'color: #666; font-size: 12px;');
    console.log('%c• Enable Enhanced Tracking Protection in Firefox', 'color: #666; font-size: 12px;');
    console.log('%c• Use privacy-focused browsers like Brave', 'color: #666; font-size: 12px;');
    console.log('%c• Clear cookies and disable third-party cookies', 'color: #666; font-size: 12px;');
    console.log('%c• Consider using a VPN to hide your IP address', 'color: #666; font-size: 12px;');
});

// Make blockRequest available globally for inline onclick
window.game = null;
document.addEventListener('DOMContentLoaded', () => {
    window.game = game;
});
