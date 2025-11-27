// Tutorial System
class TutorialSystem {
    constructor(game) {
        this.game = game;
        this.currentStep = 0;
        this.tutorialActive = false;
        this.tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
        this.scrollHandler = null;
        this.currentHighlightedElement = null;
        
        this.steps = [
            {
                title: "Welcome to Pixel Detective Game! 🎓",
                text: "Learn how tracking pixels secretly collect your data while browsing websites. This tutorial will show you each section step-by-step and teach you how to identify and block these invisible trackers.",
                icon: "🎓",
                highlight: null,
                position: "center"
            },
            {
                title: "The Shopping Website 🛍",
                text: "This is what you see as a user - a normal shopping website with products. It looks innocent, but hidden tracking pixels are embedded in the code. Click on products to browse, but remember: every click is being tracked!",
                icon: "🛍",
                highlight: ".left-panel",
                position: "right"
            },
            {
                title: "The Hidden HTML Code 💻",
                text: "Here's the real HTML source code of the website. Hidden somewhere in this code are 3 TRACKING PIXELS - invisible 1x1 pixel images and scripts. Normal users never see this code, but it's running in the background collecting data about you!",
                icon: "💻",
                highlight: ".code-section",
                position: "left"
            },
            {
                title: "Can You Find the Trackers? 🔍",
                text: "Look carefully! Tracking pixels are usually <img> tags or <script> tags with suspicious URLs (analytics.com, adnetwork.com, databroker.com). They have width='1' height='1' and style='display:none' to be invisible. Click on any line you think is a tracking pixel!",
                icon: "🔍",
                highlight: ".code-display",
                position: "left"
            },
            {
                title: "Network Requests Monitor 🌐",
                text: "This terminal shows live NETWORK REQUESTS - when tracking pixels 'phone home' to send your data. Each GREEN line is a request carrying your information to a tracking company's server. You can see the URLs and data being transmitted!",
                icon: "🌐",
                highlight: ".terminal-section",
                position: "left"
            },
            {
                title: "Your Private Data 📊",
                text: "This shows exactly what data is being collected: IP address, browser type, operating system, screen size, location, and browsing behavior. All of this sensitive information is sent to third parties without explicit consent!",
                icon: "📊",
                highlight: ".data-section",
                position: "left"
            },
            {
                title: "Method 1: Delete Tracking Code ❌",
                text: "You can stop tracking by DELETING the tracking code! Click on any code line you think is a tracking pixel. If you're correct, it will be deleted! If you're wrong, you'll get a hint to help you find the real trackers. Try finding and clicking a tracking pixel now!",
                icon: "❌",
                highlight: ".code-section",
                position: "left",
                action: "waitForCodeDelete"
            },
            {
                title: "Method 2: Block Network Requests 🚫",
                text: "Another way is to BLOCK network requests! When you see a request appear in the terminal (GREEN text), click the [BLOCK] link next to it. This simulates blocking tracking domains. The game will start soon - try both methods to block all 3 trackers within 45 seconds!",
                icon: "🚫",
                highlight: ".terminal-section",
                position: "left",
                action: "waitForNetworkBlock",
                isLastStep: true
            }
        ];
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.overlay = document.getElementById('tutorialOverlay');
        this.modal = document.getElementById('tutorialModal');
        this.spotlight = document.querySelector('.tutorial-spotlight');
        this.stepElement = document.getElementById('tutorialStep');
        this.totalElement = document.getElementById('tutorialTotal');
        this.iconElement = document.getElementById('tutorialIcon');
        this.titleElement = document.getElementById('tutorialTitle');
        this.textElement = document.getElementById('tutorialText');
        this.prevBtn = document.getElementById('tutorialPrev');
        this.nextBtn = document.getElementById('tutorialNext');
        this.skipBtn = document.getElementById('skipTutorial');
    }
    
    attachEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.prevBtn.addEventListener('click', () => this.previousStep());
        this.skipBtn.addEventListener('click', () => this.skipTutorial());
    }
    
    start() {
        if (this.tutorialCompleted) {
            return;
        }
        
        this.tutorialActive = true;
        this.currentStep = 0;
        this.showStep(0);
        this.overlay.classList.remove('hidden');
        this.modal.classList.remove('hidden');
        this.game.startBtn.disabled = true;
    }
    
    showStep(stepIndex) {
        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;
        
        this.stepElement.textContent = `Step ${stepIndex + 1}`;
        this.totalElement.textContent = `of ${this.steps.length}`;
        this.iconElement.textContent = step.icon;
        this.titleElement.textContent = step.title;
        this.textElement.textContent = step.text;
        
        this.prevBtn.style.display = stepIndex > 0 ? 'block' : 'none';
        this.nextBtn.style.display = step.action ? 'none' : 'block';
        
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        this.positionTutorial(step);
        
        if (step.highlight) {
            this.scrollHandler = () => this.updateSpotlightPosition();
            window.addEventListener('scroll', this.scrollHandler);
        }
        
        if (step.action) {
            this.handleStepAction(step.action);
        }
    }
    
    positionTutorial(step) {
        if (step.highlight) {
            const element = document.querySelector(step.highlight);
            if (element) {
                this.currentHighlightedElement = element;
                const rect = element.getBoundingClientRect();
                
                this.spotlight.style.left = rect.left - 10 + 'px';
                this.spotlight.style.top = rect.top - 10 + 'px';
                this.spotlight.style.width = rect.width + 20 + 'px';
                this.spotlight.style.height = rect.height + 20 + 'px';
                
                element.classList.add('tutorial-highlight');
                this.highlightSection(element);
                this.scrollToCenter(element);
                this.positionModalSmart(step.position, rect);
            }
        } else {
            this.currentHighlightedElement = null;
            this.spotlight.style.width = '0';
            this.spotlight.style.height = '0';
            this.modal.style.left = '50%';
            this.modal.style.top = '50%';
            this.modal.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    updateSpotlightPosition() {
        if (this.currentHighlightedElement) {
            const rect = this.currentHighlightedElement.getBoundingClientRect();
            this.spotlight.style.left = rect.left - 10 + 'px';
            this.spotlight.style.top = rect.top - 10 + 'px';
            this.spotlight.style.width = rect.width + 20 + 'px';
            this.spotlight.style.height = rect.height + 20 + 'px';
        }
    }
    
    highlightSection(element) {
        document.querySelectorAll('.learning-highlight').forEach(el => {
            el.classList.remove('learning-highlight');
        });
        
        const sections = [
            document.querySelector('.instructions'),
            document.querySelector('.left-panel'),
            document.querySelector('.code-section'),
            document.querySelector('.terminal-section'),
            document.querySelector('.data-section')
        ].filter(Boolean);
        
        for (const section of sections) {
            if (section === element || section.contains(element)) {
                section.classList.add('learning-highlight');
                break;
            }
        }
    }
    
    scrollToCenter(element) {
        const rect = element.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
        window.scrollTo({ top: middle, behavior: 'smooth' });
    }
    
    positionModalSmart(preferredPosition, elementRect) {
        const modal = this.modal;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalWidth = 600;
        const modalHeight = modal.offsetHeight || 400;
        const padding = 30;
        const margin = 20;
        
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const isLeftSide = elementCenterX < viewportWidth / 2;
        
        let left, top;
        
        if (preferredPosition === 'right' && isLeftSide) {
            left = elementRect.right + padding;
            if (left + modalWidth + margin > viewportWidth) {
                left = elementRect.left - modalWidth - padding;
            }
        } else if (preferredPosition === 'left' && !isLeftSide) {
            left = elementRect.left - modalWidth - padding;
            if (left < margin) {
                left = elementRect.right + padding;
            }
        } else {
            modal.style.left = '50%';
            modal.style.top = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        top = elementRect.top;
        if (top + modalHeight > viewportHeight - margin) {
            top = Math.max(margin, viewportHeight - modalHeight - margin);
        }
        if (top < margin) top = margin;
        
        modal.style.left = Math.max(margin, Math.min(left, viewportWidth - modalWidth - margin)) + 'px';
        modal.style.top = top + 'px';
        modal.style.transform = 'none';
    }
    
    handleStepAction(action) {
        if (action === 'waitForCodeDelete') {
            const codeLines = document.querySelectorAll('.code-line');
            const clickHandler = (e) => {
                const trackerId = e.target.getAttribute('data-tracker');
                
                if (trackerId) {
                    // Correct! They clicked a tracking pixel line
                    codeLines.forEach(line => line.removeEventListener('click', clickHandler));
                    setTimeout(() => this.nextStep(), 1000);
                } else {
                    // Wrong line! Show error modal
                    this.game.showErrorModal();
                }
            };
            codeLines.forEach(line => line.addEventListener('click', clickHandler));
        } else if (action === 'waitForNetworkBlock') {
            const terminal = document.getElementById('terminal');
            const clickHandler = (e) => {
                if (e.target.classList.contains('block-link')) {
                    terminal.removeEventListener('click', clickHandler);
                    setTimeout(() => this.nextStep(), 1000);
                }
            };
            terminal.addEventListener('click', clickHandler);
            
            setTimeout(() => {
                if (this.game.trackers[0] && !this.game.trackers[0].blocked) {
                    this.game.addNetworkRequest(this.game.trackers[0], 'tutorial', 'demo-data');
                }
            }, 500);
        }
    }
    
    nextStep() {
        const currentStep = this.steps[this.currentStep];
        if (currentStep.highlight) {
            const element = document.querySelector(currentStep.highlight);
            if (element) element.classList.remove('tutorial-highlight');
        }
        
        if (currentStep.isLastStep) {
            this.completeTutorialAndStartGame();
        } else if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }
    
    completeTutorialAndStartGame() {
        this.tutorialActive = false;
        this.tutorialCompleted = true;
        localStorage.setItem('tutorialCompleted', 'true');
        
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        this.currentHighlightedElement = null;
        
        document.querySelectorAll('.tutorial-highlight, .learning-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight', 'learning-highlight');
        });
        
        this.overlay.classList.add('hidden');
        this.modal.classList.add('hidden');
        this.game.startBtn.disabled = false;
        
        alert('🎉 Tutorial Complete!\n\n✓ You learned how tracking pixels work\n✓ You know how to identify tracking code\n✓ You know how to block network requests\n\nThe game will now start!\nYou have 45 seconds to find and block all 3 hidden trackers.\n\n💡 Tip: Look for suspicious <img> or <script> tags!');
        
        setTimeout(() => this.game.startGame(), 500);
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            const currentStep = this.steps[this.currentStep];
            if (currentStep.highlight) {
                const element = document.querySelector(currentStep.highlight);
                if (element) element.classList.remove('tutorial-highlight');
            }
            this.showStep(this.currentStep - 1);
        }
    }
    
    skipTutorial() {
        if (confirm('Skip the tutorial?\n\nYou can restart it anytime by clicking the "🎓 Redo Tutorial" button at the top of the page.')) {
            this.completeTutorial();
        }
    }
    
    completeTutorial() {
        this.tutorialActive = false;
        this.tutorialCompleted = true;
        localStorage.setItem('tutorialCompleted', 'true');
        
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
        
        this.currentHighlightedElement = null;
        
        document.querySelectorAll('.tutorial-highlight, .learning-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight', 'learning-highlight');
        });
        
        this.overlay.classList.add('hidden');
        this.modal.classList.add('hidden');
        this.game.startBtn.disabled = false;
    }
    
    reset() {
        localStorage.removeItem('tutorialCompleted');
        this.tutorialCompleted = false;
        this.start();
    }
}

// Tracker Simulator Game
class TrackerSimulator {
    constructor() {
        this.timeLimit = 45;
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
            { id: 1, name: 'analytics.com', company: 'Analytics Tracker', blocked: false, codeDeleted: false, line: 6 },
            { id: 2, name: 'adnetwork.com', company: 'Ad Network', blocked: false, codeDeleted: false, line: 10 },
            { id: 3, name: 'databroker.com', company: 'Data Broker', blocked: false, codeDeleted: false, line: 12 }
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
        
        // Make all code lines clickable
        document.querySelectorAll('.code-line').forEach(line => {
            line.addEventListener('click', () => {
                if (this.gameActive) {
                    this.handleCodeLineClick(line);
                }
            });
        });
        
        document.querySelectorAll('.btn-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productName = productCard.querySelector('h4').textContent;
                const productPrice = productCard.getAttribute('data-price');
                const productIcon = productCard.getAttribute('data-icon');
                this.showDetailPage(productName, productPrice, productIcon);
            });
        });
        
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showMainPage());
        }
    }
    
    handleCodeLineClick(codeLine) {
        const trackerId = codeLine.getAttribute('data-tracker');
        
        if (trackerId) {
            // This is a tracking pixel line
            const id = parseInt(trackerId);
            const tracker = this.trackers.find(t => t.id === id);
            
            if (tracker && !tracker.codeDeleted) {
                this.deleteCode(id, codeLine);
            }
        } else {
            // This is NOT a tracking pixel - show error message
            this.showErrorModal();
        }
    }
    
    showErrorModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'error-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="error-modal">
                <div class="error-modal-icon">❌</div>
                <h3>Not a Tracking Pixel!</h3>
                <p>This is regular HTML code, not a tracking pixel.</p>
                <p><strong>Hint:</strong> Look for &lt;img&gt; or &lt;script&gt; tags with suspicious URLs like analytics.com, adnetwork.com, or databroker.com</p>
                <button class="error-modal-btn" onclick="this.closest('.error-modal-overlay').remove()">Continue Searching</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modalOverlay.parentElement) {
                modalOverlay.remove();
            }
        }, 5000);
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
        
        this.trackers.forEach(tracker => {
            tracker.blocked = false;
            tracker.codeDeleted = false;
        });
        
        document.querySelectorAll('.tracking-line').forEach(line => {
            line.classList.remove('deleted');
        });
        
        this.terminal.innerHTML = '<div class="terminal-line">$ Network monitoring active...</div>';
        
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
        this.dataLeakInterval = setInterval(() => {
            if (this.gameActive) {
                const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted).length;
                this.dataLeaked += activeTrackers * 0.5;
                this.updateUI();
            }
        }, 1000);
    }
    
    startNetworkRequests() {
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
        }, 2000);
    }
    
    addNetworkRequest(tracker, action = 'pageview', data = '') {
        const requestLine = document.createElement('div');
        requestLine.className = 'terminal-line request';
        requestLine.setAttribute('data-tracker', tracker.id);
        
        let url = `https://${tracker.name}/track?user=12345&action=${action}`;
        if (data) url += `&data=${encodeURIComponent(data)}`;
        url += `&time=${Date.now()}`;
        
        requestLine.innerHTML = `→ GET ${url} <span class="block-link" onclick="game.blockRequest(${tracker.id})">[ BLOCK ]</span>`;
        
        this.terminal.appendChild(requestLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    showDetailPage(productName, productPrice, productIcon) {
        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('detailPage').style.display = 'block';
        
        document.getElementById('detailIcon').textContent = productIcon;
        document.getElementById('detailName').textContent = productName;
        document.getElementById('detailPrice').textContent = productPrice;
        
        if (this.gameActive) {
            const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted);
            activeTrackers.forEach(tracker => {
                this.addNetworkRequest(tracker, 'product_view', productName);
            });
        }
    }
    
    showMainPage() {
        document.getElementById('mainPage').style.display = 'block';
        document.getElementById('detailPage').style.display = 'none';
        
        if (this.gameActive) {
            const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted);
            activeTrackers.forEach(tracker => {
                this.addNetworkRequest(tracker, 'homepage', '');
            });
        }
    }
    
    blockRequest(trackerId) {
        if (!this.gameActive) return;
        
        const tracker = this.trackers.find(t => t.id === trackerId);
        if (!tracker || tracker.blocked || tracker.codeDeleted) return;
        
        tracker.blocked = true;
        this.trackersBlocked++;
        
        const requestLines = this.terminal.querySelectorAll(`[data-tracker="${trackerId}"]`);
        requestLines.forEach(line => {
            line.classList.remove('request');
            line.classList.add('blocked');
            const blockLink = line.querySelector('.block-link');
            if (blockLink) blockLink.remove();
        });
        
        const successLine = document.createElement('div');
        successLine.className = 'terminal-line success';
        successLine.textContent = `✓ BLOCKED: ${tracker.company} requests stopped!`;
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
        tracker.blocked = true;
        this.trackersBlocked++;
        
        codeLine.classList.add('deleted');
        
        const successLine = document.createElement('div');
        successLine.className = 'terminal-line success';
        successLine.textContent = `✓ CODE DELETED: ${tracker.company} removed from HTML!`;
        this.terminal.appendChild(successLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        
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
        
        const unblockedTrackers = this.totalTrackers - this.trackersBlocked;
        
        // Add terminal message
        const finalLine = document.createElement('div');
        finalLine.className = 'terminal-line';
        finalLine.style.color = won ? '#00ff00' : '#ff0000';
        finalLine.style.fontWeight = 'bold';
        finalLine.textContent = won ? '$ All trackers blocked!' : `$ ${unblockedTrackers} tracker(s) still active`;
        this.terminal.appendChild(finalLine);
        
        // Show result as popup modal
        this.showResultModal(won, unblockedTrackers);
    }
    
    showResultModal(won, unblockedTrackers) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'error-modal-overlay';
        
        if (won) {
            modalOverlay.innerHTML = `
                <div class="error-modal" style="border-color: #00ff00;">
                    <div class="error-modal-icon">🎉</div>
                    <h3 style="color: #00aa00;">Mission Accomplished!</h3>
                    <p>You found and blocked all 3 trackers with <strong>${this.timeRemaining}s</strong> remaining!</p>
                    <p>Data Leaked: <strong>${this.dataLeaked.toFixed(1)} KB</strong></p>
                    <div style="margin-top: 1.5rem; font-size: 0.9em; line-height: 1.6; text-align: left; background: #f0fff0; padding: 1rem; border: 2px solid #00aa00;">
                        <strong>🔒 Protect Yourself:</strong><br>
                        • Use uBlock Origin or Privacy Badger<br>
                        • Enable tracking protection in your browser<br>
                        • Clear cookies and disable third-party cookies
                    </div>
                    <button class="error-modal-btn" onclick="this.closest('.error-modal-overlay').remove()">Close</button>
                </div>
            `;
        } else {
            modalOverlay.innerHTML = `
                <div class="error-modal">
                    <div class="error-modal-icon">⏰</div>
                    <h3>Time's Up!</h3>
                    <p>You blocked <strong>${this.trackersBlocked}/${this.totalTrackers}</strong> trackers</p>
                    <p>Data Leaked: <strong style="color: #ff0000;">${this.dataLeaked.toFixed(1)} KB</strong></p>
                    <div style="margin-top: 1.5rem; font-size: 0.9em; line-height: 1.6; text-align: left; background: #fff0f0; padding: 1rem; border: 2px solid #ff0000;">
                        <strong>⚠ What Happened:</strong><br>
                        • ${unblockedTrackers} tracker(s) collected your data<br>
                        • Your IP, location, and behavior were shared<br>
                        • This happens on most websites you visit!
                    </div>
                    <button class="error-modal-btn" onclick="this.closest('.error-modal-overlay').remove()">Try Again</button>
                </div>
            `;
        }
        
        document.body.appendChild(modalOverlay);
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
        
        this.trackers.forEach(tracker => {
            tracker.blocked = false;
            tracker.codeDeleted = false;
        });
        
        document.querySelectorAll('.tracking-line').forEach(line => {
            line.classList.remove('deleted');
        });
        
        this.terminal.innerHTML = '<div class="terminal-line">$ Network monitoring active...</div><div class="terminal-line">$ Waiting for activity...</div>';
        
        this.updateUI();
    }
}

let game, tutorial;

document.addEventListener('DOMContentLoaded', () => {
    game = new TrackerSimulator();
    tutorial = new TutorialSystem(game);
    
    setTimeout(() => tutorial.start(), 500);
    
    // Redo Tutorial button
    document.getElementById('redoTutorialBtn').addEventListener('click', () => {
        tutorial.reset();
    });
    
    console.log('%c🔒 Pixel Detective Game', 'color: #000; font-size: 18px; font-weight: bold;');
    console.log('%cLearn how tracking pixels work and how to block them!', 'color: #666; font-size: 12px;');
});

window.game = null;
window.tutorial = null;
document.addEventListener('DOMContentLoaded', () => {
    window.game = game;
    window.tutorial = tutorial;
    
    // Smooth animation for main instruction collapse (like TOC)
    const instructionCollapse = document.getElementById('instructionCollapse');
    const instructionContent = instructionCollapse.querySelector('.instruction-content');
    
    instructionCollapse.addEventListener('toggle', function() {
        if (this.open) {
            // Opening - animate from 0 to full height
            instructionContent.style.maxHeight = '0px';
            instructionContent.style.overflow = 'hidden';
            instructionContent.style.transition = 'max-height 0.4s ease';
            
            // Force reflow
            instructionContent.offsetHeight;
            
            // Set to actual height
            const actualHeight = instructionContent.scrollHeight;
            instructionContent.style.maxHeight = actualHeight + 'px';
            
            // After animation, remove max-height to allow dynamic content
            setTimeout(() => {
                if (this.open) {
                    instructionContent.style.maxHeight = 'none';
                }
            }, 400);
        } else {
            // Closing - animate from full height to 0
            const actualHeight = instructionContent.scrollHeight;
            instructionContent.style.maxHeight = actualHeight + 'px';
            instructionContent.style.overflow = 'hidden';
            instructionContent.style.transition = 'max-height 0.4s ease';
            
            // Force reflow
            instructionContent.offsetHeight;
            
            instructionContent.style.maxHeight = '0px';
        }
    });
    
    // Accordion behavior for instruction sections with smooth animation
    const instructionSections = document.querySelectorAll('.instruction-section');
    instructionSections.forEach(section => {
        const sectionContent = section.querySelector('.section-content');
        
        section.addEventListener('toggle', function() {
            if (this.open) {
                // Close all other sections
                instructionSections.forEach(otherSection => {
                    if (otherSection !== this && otherSection.open) {
                        otherSection.open = false;
                    }
                });
                
                // Animate opening
                sectionContent.style.maxHeight = '0px';
                sectionContent.style.overflow = 'hidden';
                sectionContent.style.transition = 'max-height 0.3s ease';
                
                // Force reflow
                sectionContent.offsetHeight;
                
                const actualHeight = sectionContent.scrollHeight;
                sectionContent.style.maxHeight = actualHeight + 'px';
                
                setTimeout(() => {
                    if (this.open) {
                        sectionContent.style.maxHeight = 'none';
                    }
                }, 300);
            } else {
                // Animate closing
                const actualHeight = sectionContent.scrollHeight;
                sectionContent.style.maxHeight = actualHeight + 'px';
                sectionContent.style.overflow = 'hidden';
                sectionContent.style.transition = 'max-height 0.3s ease';
                
                // Force reflow
                sectionContent.offsetHeight;
                
                sectionContent.style.maxHeight = '0px';
            }
        });
    });
    
    // Auto-collapse instructions on Start Game or Reset
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    startBtn.addEventListener('click', () => {
        if (instructionCollapse.open) {
            instructionCollapse.open = false;
        }
    });
    
    resetBtn.addEventListener('click', () => {
        if (instructionCollapse.open) {
            instructionCollapse.open = false;
        }
    });
});
