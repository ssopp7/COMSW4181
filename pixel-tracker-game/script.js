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
                title: "Welcome to Pixel Tracking Simulator! 🎓",
                text: "This interactive tutorial will teach you how websites track you online and how to protect yourself. You'll learn step-by-step how tracking works, going through each section one by one.",
                icon: "🎓",
                highlight: null,
                position: "center",
                action: null,
                nextButton: "Let's Start!"
            },
            {
                title: "Game Instructions 🎯",
                text: "First, let's understand your mission. You'll have 45 seconds to stop tracking by either deleting tracking code or blocking network requests. Let's explore how tracking works step by step.",
                icon: "🎯",
                highlight: ".instructions",
                position: "bottom-forced",
                action: null,
                nextButton: "Next Section"
            },
            {
                title: "The Shopping Website 🛍️",
                text: "This is what you see as a regular user - a normal shopping website. You can click 'View Details' on any product to see more info, and use the back button to return. But behind the scenes, invisible tracking is happening with every interaction!",
                icon: "🛍️",
                highlight: ".left-panel",
                position: "right",
                action: null,
                nextButton: "Next Section"
            },
            {
                title: "The Hidden HTML Code 💻",
                text: "Look at this HTML code section! These highlighted lines are TRACKING PIXELS - invisible 1x1 pixel images and scripts that collect your data. There are 3 different trackers here from different companies.",
                icon: "💻",
                highlight: ".code-section",
                position: "left",
                action: null,
                nextButton: "Next Section"
            },
            {
                title: "Understanding the Trackers 🔍",
                text: "Each tracking line sends data to a different company: Analytics Tracker (measures your behavior), Ad Network (targets ads to you), and Data Broker (sells your info). They all run silently in the background.",
                icon: "🔍",
                highlight: ".tracking-line",
                position: "left",
                action: null,
                nextButton: "Next Section"
            },
            {
                title: "Network Requests 🌐",
                text: "This terminal shows NETWORK REQUESTS - when the tracking pixels 'call home' to send your data. Every line shows a request being sent to a tracking company with your information.",
                icon: "🌐",
                highlight: ".terminal-section",
                position: "left",
                action: null,
                nextButton: "Next Section"
            },
            {
                title: "Your Private Data 📱",
                text: "This shows exactly what data is being collected: your IP address, browser type, location, and browsing behavior. All of this is sent to third parties without your explicit consent!",
                icon: "📱",
                highlight: ".data-section",
                position: "left",
                action: null,
                nextButton: "How Do I Stop This?"
            },
            {
                title: "Method 1: Delete Tracking Code ❌",
                text: "You can stop tracking by deleting the tracking code! Click the red ❌ button next to any tracking line to remove it. This simulates using browser extensions like uBlock Origin. Try it now!",
                icon: "❌",
                highlight: ".code-section",
                position: "left",
                action: "waitForCodeDelete",
                nextButton: null
            },
            {
                title: "Method 2: Block Network Requests 🚫",
                text: "Another way is to block network requests! Look for the [ BLOCK ] link next to any network request in the terminal and click it. This simulates blocking tracking domains. Try it!",
                icon: "🚫",
                highlight: ".terminal-section",
                position: "left",
                action: "waitForNetworkBlock",
                nextButton: null,
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
            return; // Don't show tutorial if already completed
        }
        
        this.tutorialActive = true;
        this.currentStep = 0;
        this.showStep(0);
        this.overlay.classList.remove('hidden');
        this.modal.classList.remove('hidden');
        
        // Disable game controls during tutorial
        this.game.startBtn.disabled = true;
    }
    
    showStep(stepIndex) {
        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;
        
        // Update modal content
        this.stepElement.textContent = `Step ${stepIndex + 1}`;
        this.totalElement.textContent = `of ${this.steps.length}`;
        this.iconElement.textContent = step.icon;
        this.titleElement.textContent = step.title;
        this.textElement.textContent = step.text;
        
        // Update buttons
        this.prevBtn.style.display = stepIndex > 0 ? 'block' : 'none';
        this.nextBtn.textContent = step.nextButton || 'Next →';
        this.nextBtn.style.display = step.action ? 'none' : 'block';
        
        // Remove old scroll handler if exists
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        // Position modal and spotlight
        this.positionTutorial(step);
        
        // Add scroll handler to keep spotlight aligned
        if (step.highlight) {
            this.scrollHandler = () => this.updateSpotlightPosition();
            window.addEventListener('scroll', this.scrollHandler);
        }
        
        // Handle step actions
        if (step.action) {
            this.handleStepAction(step.action);
        }
    }
    
    positionTutorial(step) {
        if (step.highlight) {
            const element = document.querySelector(step.highlight);
            if (element) {
                // Store current highlighted element for scroll updates
                this.currentHighlightedElement = element;
                
                const rect = element.getBoundingClientRect();
                
                // Position spotlight
                this.spotlight.style.left = rect.left - 10 + 'px';
                this.spotlight.style.top = rect.top - 10 + 'px';
                this.spotlight.style.width = rect.width + 20 + 'px';
                this.spotlight.style.height = rect.height + 20 + 'px';
                
                // Highlight element
                element.classList.add('tutorial-highlight');
                
                // Dim other sections (keep dim effect throughout tutorial)
                this.dimOtherSections(element);
                
                // Auto-scroll to center the section
                this.scrollToCenter(element);
                
                // Position modal intelligently based on element location
                this.positionModalSmart(step.position, rect, element);
            }
        } else {
            // Center modal
            this.currentHighlightedElement = null;
            this.spotlight.style.width = '0';
            this.spotlight.style.height = '0';
            this.modal.style.left = '50%';
            this.modal.style.top = '50%';
            this.modal.style.transform = 'translate(-50%, -50%)';
            // Keep dim effect even for centered modal
        }
    }
    
    updateSpotlightPosition() {
        // Update spotlight position on scroll to keep it aligned with the element
        if (this.currentHighlightedElement) {
            const rect = this.currentHighlightedElement.getBoundingClientRect();
            this.spotlight.style.left = rect.left - 10 + 'px';
            this.spotlight.style.top = rect.top - 10 + 'px';
            this.spotlight.style.width = rect.width + 20 + 'px';
            this.spotlight.style.height = rect.height + 20 + 'px';
        }
    }
    
    dimOtherSections(highlightedElement) {
        // Remove previous dimming but keep the dim overlay
        this.clearDimming();
        
        // Find all major sections
        const sections = [
            document.querySelector('.instructions'),
            document.querySelector('.game-stats'),
            document.querySelector('.left-panel'),
            document.querySelector('.code-section'),
            document.querySelector('.terminal-section'),
            document.querySelector('.data-section')
        ].filter(Boolean);
        
        // Find which section contains or is the highlighted element
        let activeSection = null;
        for (const section of sections) {
            if (section === highlightedElement || section.contains(highlightedElement)) {
                activeSection = section;
                break;
            }
        }
        
        // Add bright border highlight to the active section
        if (activeSection) {
            activeSection.classList.add('learning-highlight');
        }
    }
    
    scrollToCenter(element) {
        // Scroll the element to the center of the viewport with smooth behavior
        const rect = element.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
        
        window.scrollTo({
            top: middle,
            behavior: 'smooth'
        });
    }
    
    clearDimming() {
        document.querySelectorAll('.learning-highlight').forEach(el => {
            el.classList.remove('learning-highlight');
        });
    }
    
    positionModalSmart(preferredPosition, elementRect, element) {
        const modal = this.modal;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalWidth = 600; // max-width from CSS
        const modalHeight = modal.offsetHeight || 400; // approximate height
        const padding = 30; // spacing from element
        const margin = 20; // margin from viewport edge
        
        // Determine which side of the screen the element is on
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
        const isLeftSide = elementCenterX < viewportWidth / 2;
        const isTopHalf = elementCenterY < viewportHeight / 2;
        
        let position = preferredPosition;
        let left, top;
        
        // Smart positioning: if element is on left, place modal on right and vice versa
        if (preferredPosition === 'right' || preferredPosition === 'left') {
            if (isLeftSide) {
                // Element on left, try to place modal on right
                left = elementRect.right + padding;
                // Check if modal fits on the right
                if (left + modalWidth + margin > viewportWidth) {
                    // Doesn't fit on right, try above or below
                    position = isTopHalf ? 'bottom' : 'top';
                } else {
                    position = 'right';
                }
            } else {
                // Element on right, try to place modal on left
                left = elementRect.left - modalWidth - padding;
                // Check if modal fits on the left
                if (left < margin) {
                    // Doesn't fit on left, try above or below
                    position = isTopHalf ? 'bottom' : 'top';
                } else {
                    position = 'left';
                }
            }
        }
        
        // Calculate final position based on determined placement
        switch(position) {
            case 'right':
                left = elementRect.right + padding;
                top = elementRect.top;
                // Adjust if modal goes off bottom
                if (top + modalHeight > viewportHeight - margin) {
                    top = Math.max(margin, viewportHeight - modalHeight - margin);
                }
                // Adjust if modal goes off top
                if (top < margin) {
                    top = margin;
                }
                modal.style.left = left + 'px';
                modal.style.top = top + 'px';
                modal.style.transform = 'none';
                break;
                
            case 'left':
                left = elementRect.left - modalWidth - padding;
                top = elementRect.top;
                // Adjust if modal goes off bottom
                if (top + modalHeight > viewportHeight - margin) {
                    top = Math.max(margin, viewportHeight - modalHeight - margin);
                }
                // Adjust if modal goes off top
                if (top < margin) {
                    top = margin;
                }
                modal.style.left = Math.max(margin, left) + 'px';
                modal.style.top = top + 'px';
                modal.style.transform = 'none';
                break;
                
            case 'bottom':
                top = elementRect.bottom + padding;
                // Center horizontally relative to element
                left = elementRect.left + (elementRect.width / 2) - (modalWidth / 2);
                // Adjust if modal goes off right edge
                if (left + modalWidth > viewportWidth - margin) {
                    left = viewportWidth - modalWidth - margin;
                }
                // Adjust if modal goes off left edge
                if (left < margin) {
                    left = margin;
                }
                // Adjust if modal goes off bottom
                if (top + modalHeight > viewportHeight - margin) {
                    // Place above instead
                    top = elementRect.top - modalHeight - padding;
                }
                modal.style.left = left + 'px';
                modal.style.top = Math.max(margin, top) + 'px';
                modal.style.transform = 'none';
                break;
                
            case 'bottom-forced':
                // Force position below the element, no fallback to top
                top = elementRect.bottom + padding;
                // Center horizontally relative to element
                left = elementRect.left + (elementRect.width / 2) - (modalWidth / 2);
                // Adjust if modal goes off right edge
                if (left + modalWidth > viewportWidth - margin) {
                    left = viewportWidth - modalWidth - margin;
                }
                // Adjust if modal goes off left edge
                if (left < margin) {
                    left = margin;
                }
                modal.style.left = left + 'px';
                modal.style.top = top + 'px';
                modal.style.transform = 'none';
                break;
                
            case 'top':
                top = elementRect.top - modalHeight - padding;
                // Center horizontally relative to element
                left = elementRect.left + (elementRect.width / 2) - (modalWidth / 2);
                // Adjust if modal goes off right edge
                if (left + modalWidth > viewportWidth - margin) {
                    left = viewportWidth - modalWidth - margin;
                }
                // Adjust if modal goes off left edge
                if (left < margin) {
                    left = margin;
                }
                // Adjust if modal goes off top
                if (top < margin) {
                    // Place below instead
                    top = elementRect.bottom + padding;
                }
                modal.style.left = left + 'px';
                modal.style.top = Math.max(margin, top) + 'px';
                modal.style.transform = 'none';
                break;
                
            default:
                modal.style.left = '50%';
                modal.style.top = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    handleStepAction(action) {
        switch(action) {
            case 'waitForProductClick':
                this.waitForProductClick();
                break;
            case 'waitForCodeDelete':
                this.waitForCodeDelete();
                break;
            case 'waitForNetworkBlock':
                this.waitForNetworkBlock();
                break;
        }
    }
    
    waitForProductClick() {
        const productButtons = document.querySelectorAll('.btn-product');
        const clickHandler = () => {
            productButtons.forEach(btn => btn.removeEventListener('click', clickHandler));
            setTimeout(() => this.nextStep(), 1000);
        };
        productButtons.forEach(btn => btn.addEventListener('click', clickHandler));
    }
    
    waitForCodeDelete() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const clickHandler = () => {
            deleteButtons.forEach(btn => btn.removeEventListener('click', clickHandler));
            setTimeout(() => this.nextStep(), 1000);
        };
        deleteButtons.forEach(btn => btn.addEventListener('click', clickHandler));
    }
    
    waitForNetworkBlock() {
        // Use event delegation since block links are dynamically added
        const terminal = document.getElementById('terminal');
        const clickHandler = (e) => {
            if (e.target.classList.contains('block-link')) {
                terminal.removeEventListener('click', clickHandler);
                setTimeout(() => this.nextStep(), 1000);
            }
        };
        terminal.addEventListener('click', clickHandler);
        
        // Trigger a network request to show block link
        setTimeout(() => {
            if (this.game.trackers[0] && !this.game.trackers[0].blocked) {
                this.game.addNetworkRequest(this.game.trackers[0], 'tutorial', 'sample-data');
            }
        }, 500);
    }
    
    nextStep() {
        // Remove highlight from current element
        const currentStep = this.steps[this.currentStep];
        if (currentStep.highlight) {
            const element = document.querySelector(currentStep.highlight);
            if (element) {
                element.classList.remove('tutorial-highlight');
            }
        }
        
        // Check if this was the last step
        if (currentStep.isLastStep) {
            this.completeTutorialAndStartGame();
        } else if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.completeTutorial();
        }
    }
    
    completeTutorialAndStartGame() {
        // Show completion message
        alert('🎉 Congratulations! Learning mode is complete!\n\n✅ You now understand:\n• How tracking pixels work\n• How to delete tracking code\n• How to block network requests\n\nThe game will now start. You have 45 seconds to block all 3 trackers!\n\n💡 Tip: Right-click the Reset button anytime to restart the tutorial.');
        
        // Complete tutorial
        this.tutorialActive = false;
        this.tutorialCompleted = true;
        localStorage.setItem('tutorialCompleted', 'true');
        
        // Remove scroll handler
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        // Clear current highlighted element reference
        this.currentHighlightedElement = null;
        
        // Remove any highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Clear any learning highlights
        this.clearDimming();
        
        // Hide tutorial UI
        this.overlay.classList.add('hidden');
        this.modal.classList.add('hidden');
        
        // Enable game controls
        this.game.startBtn.disabled = false;
        
        // Auto-start the game
        setTimeout(() => {
            this.game.startGame();
        }, 500);
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            // Remove highlight from current element
            const currentStep = this.steps[this.currentStep];
            if (currentStep.highlight) {
                const element = document.querySelector(currentStep.highlight);
                if (element) {
                    element.classList.remove('tutorial-highlight');
                }
            }
            this.showStep(this.currentStep - 1);
        }
    }
    
    skipTutorial() {
        if (confirm('Are you sure you want to skip the tutorial? You can always restart it later.')) {
            this.completeTutorial();
        }
    }
    
    completeTutorial() {
        this.tutorialActive = false;
        this.tutorialCompleted = true;
        localStorage.setItem('tutorialCompleted', 'true');
        
        // Remove scroll handler
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        // Clear current highlighted element reference
        this.currentHighlightedElement = null;
        
        // Remove any highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Clear any learning highlights
        this.clearDimming();
        
        // Hide tutorial UI
        this.overlay.classList.add('hidden');
        this.modal.classList.add('hidden');
        
        // Enable game controls
        this.game.startBtn.disabled = false;
        
        // Auto-click start if tutorial was completed (not skipped)
        if (this.currentStep >= this.steps.length - 1) {
            setTimeout(() => {
                alert('Tutorial complete! The game will now start. You have 45 seconds to block all 3 trackers!');
                this.game.startGame();
            }, 500);
        }
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

// Initialize game and tutorial
let game;
let tutorial;
document.addEventListener('DOMContentLoaded', () => {
    game = new TrackerSimulator();
    tutorial = new TutorialSystem(game);
    
    // Start tutorial automatically on first visit
    setTimeout(() => {
        tutorial.start();
    }, 500);
    
    // Add reset tutorial button functionality
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm('Right-click detected! Do you want to restart the tutorial?')) {
            tutorial.reset();
        }
    });
    
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
    console.log('%c', 'font-size: 12px;');
    console.log('%c💡 Tip: Right-click the Reset button to restart the tutorial!', 'color: #667eea; font-size: 12px; font-weight: bold;');
});

// Make game available globally for inline onclick
window.game = null;
window.tutorial = null;
document.addEventListener('DOMContentLoaded', () => {
    window.game = game;
    window.tutorial = tutorial;
});
