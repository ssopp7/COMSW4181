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
        this.currentView = 'main'; // 'main' or 'detail'
        this.currentProduct = null;
        
        this.trackers = [
            { 
                id: 1, 
                name: 'analytics.com', 
                company: 'Analytics Tracker', 
                blocked: false, 
                codeDeleted: false,
                code: '<img src="https://analytics.com/track.gif?user=12345&session=' + Date.now() + '" width="1" height="1" style="display:none" />'
            },
            { 
                id: 2, 
                name: 'adnetwork.com', 
                company: 'Ad Network', 
                blocked: false, 
                codeDeleted: false,
                code: '<script src="https://adnetwork.com/pixel.js?id=12345&ref=shopeasy"></script>'
            },
            { 
                id: 3, 
                name: 'databroker.com', 
                company: 'Data Broker', 
                blocked: false, 
                codeDeleted: false,
                code: '<img src="https://databroker.com/collect?id=12345&t=' + Date.now() + '" width="1" height="1" alt="" />'
            }
        ];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateHTMLDisplay();
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
        this.htmlCode = document.getElementById('htmlCode');
        this.codeDisplay = document.getElementById('codeDisplay');
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
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
    
    generateCurrentHTML() {
        // Get the current shopping website HTML
        const shoppingWebsite = document.getElementById('shoppingWebsite');
        let html = shoppingWebsite.innerHTML;
        
        // Clean up the HTML for display (remove extra whitespace, format nicely)
        html = this.formatHTML(html);
        
        return html;
    }
    
    formatHTML(html) {
        // Simple HTML formatter to make it more readable
        let formatted = html;
        
        // Remove excessive whitespace
        formatted = formatted.replace(/\s+/g, ' ').trim();
        
        // Add line breaks for readability
        formatted = formatted.replace(/></g, '>\n<');
        
        // Basic indentation with line length consideration
        const lines = formatted.split('\n');
        let indentLevel = 0;
        const indentedLines = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            
            // Decrease indent for closing tags
            if (trimmed.startsWith('</')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            const indent = '  '.repeat(indentLevel);
            
            // Break long lines (especially for long attribute strings)
            let formattedLine = trimmed;
            if (formattedLine.length > 60 && formattedLine.includes('http')) {
                // Break after common attributes to improve readability
                formattedLine = formattedLine
                    .replace(/(\s+src=)/g, '\n' + indent + '  src=')
                    .replace(/(\s+width=)/g, '\n' + indent + '  width=')
                    .replace(/(\s+height=)/g, '\n' + indent + '  height=')
                    .replace(/(\s+style=)/g, '\n' + indent + '  style=')
                    .replace(/(\s+class=)/g, '\n' + indent + '  class=')
                    .replace(/(\s+id=)/g, '\n' + indent + '  id=')
                    .replace(/(\s+data-)/g, '\n' + indent + '  data-');
                
                // If first line after break, add base indent
                const parts = formattedLine.split('\n');
                if (parts.length > 1) {
                    formattedLine = parts[0] + '\n' + parts.slice(1).join('\n');
                }
            }
            
            // Increase indent for opening tags (but not self-closing)
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !this.isSelfClosing(trimmed)) {
                indentLevel++;
            }
            
            return indent + formattedLine;
        }).filter(line => line.length > 0);
        
        return indentedLines.join('\n');
    }
    
    isSelfClosing(tag) {
        const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
        for (const scTag of selfClosingTags) {
            if (tag.match(new RegExp(`<${scTag}[\\s>]`, 'i'))) {
                return true;
            }
        }
        return false;
    }
    
    updateHTMLDisplay() {
        let html = this.generateCurrentHTML();
        
        // Inject tracking pixels into the HTML if game is active
        if (this.gameActive) {
            html = this.injectTrackingPixels(html);
        }
        
        // Escape HTML for display
        const escaped = this.escapeHTML(html);
        
        // Display the HTML
        this.htmlCode.innerHTML = escaped;
        
        // After displaying, attach click handlers to tracking lines
        if (this.gameActive) {
            this.attachTrackingLineHandlers();
        }
    }
    
    injectTrackingPixels(html) {
        // Find a good place to inject the tracking pixels (before </body> or at the end)
        // We'll inject them in different places to make them less obvious
        const lines = html.split('\n');
        
        // Insert trackers at strategic positions
        const positions = this.findInjectionPositions(lines);
        
        // Insert trackers from bottom to top to maintain line numbers
        const sortedPositions = positions.sort((a, b) => b - a);
        
        this.trackers.forEach((tracker, index) => {
            if (!tracker.codeDeleted && sortedPositions[index] !== undefined) {
                const pos = sortedPositions[index];
                const indent = this.getIndentLevel(lines[pos]);
                lines.splice(pos + 1, 0, indent + tracker.code);
            }
        });
        
        return lines.join('\n');
    }
    
    findInjectionPositions(lines) {
        // Find good positions to inject tracking code
        const positions = [];
        
        // Look for closing div tags, end of sections, etc.
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.includes('</div>') || line.includes('</section>') || line.includes('</body>')) {
                if (positions.length < 3) {
                    positions.push(i);
                }
            }
        }
        
        // If we didn't find enough positions, add some at the end
        while (positions.length < 3) {
            positions.push(lines.length - 1);
        }
        
        return positions;
    }
    
    getIndentLevel(line) {
        const match = line.match(/^(\s*)/);
        return match ? match[1] : '';
    }
    
    escapeHTML(html) {
        const lines = html.split('\n');
        const escapedLines = lines.map((line, index) => {
            let escaped = line.replace(/&/g, '&amp;')
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;')
                             .replace(/"/g, '&quot;')
                             .replace(/'/g, '&#039;');
            
            // Check if this line contains a tracker
            const trackerIndex = this.findTrackerInLine(line);
            if (trackerIndex !== -1 && !this.trackers[trackerIndex].codeDeleted) {
                // Wrap this line in a span with a data attribute
                escaped = `<span class="code-line-clickable" data-tracker="${trackerIndex}" data-line="${index}">${escaped}</span>`;
            } else if (trackerIndex !== -1 && this.trackers[trackerIndex].codeDeleted) {
                // Mark as deleted
                escaped = `<span class="code-line-deleted" data-line="${index}">${escaped}</span>`;
            } else {
                // Regular line
                escaped = `<span class="code-line-normal" data-line="${index}">${escaped}</span>`;
            }
            
            return escaped;
        });
        
        return escapedLines.join('\n');
    }
    
    findTrackerInLine(line) {
        for (let i = 0; i < this.trackers.length; i++) {
            if (line.includes(this.trackers[i].code)) {
                return i;
            }
        }
        return -1;
    }
    
    attachTrackingLineHandlers() {
        // Add click handlers to tracking lines
        const clickableLines = this.htmlCode.querySelectorAll('.code-line-clickable');
        clickableLines.forEach(line => {
            line.style.cursor = 'pointer';
            line.addEventListener('click', (e) => {
                const trackerId = parseInt(e.target.getAttribute('data-tracker'));
                this.deleteCode(trackerId);
            });
            
            // Add hover effect
            line.addEventListener('mouseenter', (e) => {
                e.target.style.backgroundColor = 'rgba(255, 87, 34, 0.2)';
            });
            line.addEventListener('mouseleave', (e) => {
                e.target.style.backgroundColor = 'transparent';
            });
        });
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
        
        // Clear terminal
        this.terminal.innerHTML = '<div class="terminal-line">$ Monitoring network traffic...</div>';
        
        // Update HTML display with trackers
        this.updateHTMLDisplay();
        
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
        
        requestLine.innerHTML = `→ GET ${url}`;
        
        this.terminal.appendChild(requestLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    showDetailPage(productName, productPrice, productIcon) {
        // Hide main page, show detail page
        const mainPage = document.getElementById('mainPage');
        const detailPage = document.getElementById('detailPage');
        
        mainPage.style.display = 'none';
        detailPage.style.display = 'block';
        
        this.currentView = 'detail';
        this.currentProduct = productName;
        
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
        
        // Update HTML display
        setTimeout(() => this.updateHTMLDisplay(), 100);
        
        // Send tracking requests
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
        
        this.currentView = 'main';
        this.currentProduct = null;
        
        // Update HTML display
        setTimeout(() => this.updateHTMLDisplay(), 100);
        
        // Send tracking request for returning to main page
        if (this.gameActive) {
            const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted);
            activeTrackers.forEach(tracker => {
                this.addNetworkRequest(tracker, 'pageview', 'main-page');
            });
        }
    }
    
    deleteCode(trackerId) {
        if (!this.gameActive) return;
        
        const tracker = this.trackers.find(t => t.id === trackerId + 1); // trackerId is 0-indexed in array
        if (!tracker || tracker.codeDeleted) return;
        
        tracker.codeDeleted = true;
        tracker.blocked = true; // Deleting code also stops tracking
        this.trackersBlocked++;
        
        // Update HTML display
        this.updateHTMLDisplay();
        
        // Update terminal
        const successLine = document.createElement('div');
        successLine.className = 'terminal-line success';
        successLine.textContent = `✓ CODE DELETED: ${tracker.company} tracking pixel removed from HTML!`;
        this.terminal.appendChild(successLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        
        // Mark existing requests as blocked
        const requestLines = this.terminal.querySelectorAll(`[data-tracker="${tracker.id}"]`);
        requestLines.forEach(line => {
            if (line.classList.contains('request')) {
                line.classList.remove('request');
                line.classList.add('blocked');
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
        
        // Clear terminal
        this.terminal.innerHTML = `
            <div class="terminal-line">$ Monitoring network traffic...</div>
            <div class="terminal-line">$ Waiting for activity...</div>
        `;
        
        // Reset HTML display
        this.updateHTMLDisplay();
        
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

// Make game available globally
window.game = null;
document.addEventListener('DOMContentLoaded', () => {
    window.game = game;
});
