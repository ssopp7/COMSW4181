
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
                action: 'waitForProductClick', 
                nextButton: null 
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
        this.nextBtn.textContent = step.nextButton || 'Next →';
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
                
                this.dimOtherSections(element);
                
                this.scrollToCenter(element);
                
                this.positionModalSmart(step.position, rect, element);
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
    
    dimOtherSections(highlightedElement) {
 
        this.clearDimming();
        
    
        const sections = [
            document.querySelector('.instructions'),
            document.querySelector('.game-stats'),
            document.querySelector('.left-panel'),
            document.querySelector('.code-section'),
            document.querySelector('.terminal-section'),
            document.querySelector('.data-section')
        ].filter(Boolean);
        
        let activeSection = null;
        for (const section of sections) {
            if (section === highlightedElement || section.contains(highlightedElement)) {
                activeSection = section;
                break;
            }
        }
        

        if (activeSection) {
            activeSection.classList.add('learning-highlight');
        }
    }
    
    scrollToCenter(element) {

        const rect = element.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
        
        return html;
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
        const modalWidth = 600; 
        const modalHeight = modal.offsetHeight || 400; 
        const padding = 30; 
        const margin = 20; 
        

        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
        const isLeftSide = elementCenterX < viewportWidth / 2;
        const isTopHalf = elementCenterY < viewportHeight / 2;
        
        // Add line breaks for readability
        formatted = formatted.replace(/></g, '>\n<');
        
      
        if (preferredPosition === 'right' || preferredPosition === 'left') {
            if (isLeftSide) {
            
                left = elementRect.right + padding;
         
                if (left + modalWidth + margin > viewportWidth) {
             
                    position = isTopHalf ? 'bottom' : 'top';
                } else {
                    position = 'right';
                }
            } else {
           
                left = elementRect.left - modalWidth - padding;
        
                if (left < margin) {
               
                    position = isTopHalf ? 'bottom' : 'top';
                } else {
                    position = 'left';
                }
            }
        }
        

        switch(position) {
            case 'right':
                left = elementRect.right + padding;
                top = elementRect.top;
               
                if (top + modalHeight > viewportHeight - margin) {
                    top = Math.max(margin, viewportHeight - modalHeight - margin);
                }
             
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
             
                if (top + modalHeight > viewportHeight - margin) {
                    top = Math.max(margin, viewportHeight - modalHeight - margin);
                }
           
                if (top < margin) {
                    top = margin;
                }
                modal.style.left = Math.max(margin, left) + 'px';
                modal.style.top = top + 'px';
                modal.style.transform = 'none';
                break;
                
            case 'bottom':
                top = elementRect.bottom + padding;
    
                left = elementRect.left + (elementRect.width / 2) - (modalWidth / 2);
         
                if (left + modalWidth > viewportWidth - margin) {
                    left = viewportWidth - modalWidth - margin;
                }
               
                if (left < margin) {
                    left = margin;
                }
        
                if (top + modalHeight > viewportHeight - margin) {
            
                    top = elementRect.top - modalHeight - padding;
                }
                modal.style.left = left + 'px';
                modal.style.top = Math.max(margin, top) + 'px';
                modal.style.transform = 'none';
                break;
                
            case 'bottom-forced':
               
                top = elementRect.bottom + padding;
                
                left = elementRect.left + (elementRect.width / 2) - (modalWidth / 2);
                
                if (left + modalWidth > viewportWidth - margin) {
                    left = viewportWidth - modalWidth - margin;
                }
                
                if (left < margin) {
                    left = margin;
                }
                modal.style.left = left + 'px';
                modal.style.top = top + 'px';
                modal.style.transform = 'none';
                break;
                
            case 'top':
                top = elementRect.top - modalHeight - padding;
             
                left = elementRect.left + (elementRect.width / 2) - (modalWidth / 2);
              
                if (left + modalWidth > viewportWidth - margin) {
                    left = viewportWidth - modalWidth - margin;
                }
                
                if (left < margin) {
                    left = margin;
                }
               
                if (top < margin) {
                  
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
                
                break;
            case 'waitForCodeDelete':
                
                break;
            case 'waitForNetworkBlock':
                
                setTimeout(() => {
                    if (this.game.trackers[0] && !this.game.trackers[0].blocked) {
                        this.game.addNetworkRequest(this.game.trackers[0], 'tutorial', 'sample-data');
                    }
                }, 500);
                break;
        }
    }
    
    waitForProductClick() {
        
    }
    
    waitForCodeDelete() {
        
    }
    
    waitForNetworkBlock() {
        
    }
    
    nextStep() {
        
        const currentStep = this.steps[this.currentStep];
        if (currentStep.highlight) {
            const element = document.querySelector(currentStep.highlight);
            if (element) {
                element.classList.remove('tutorial-highlight');
            }
        }
        
        
        if (currentStep.isLastStep) {
            this.completeTutorialAndStartGame();
        } else if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.completeTutorial();
        }
    }
    
    completeTutorialAndStartGame() {
        
        alert('🎉 Congratulations! Learning mode is complete!\n\n✅ You now understand:\n• How tracking pixels work\n• How to delete tracking code\n• How to block network requests\n\nThe game will now start. You have 45 seconds to block all 3 trackers!\n\n💡 Tip: Right-click the Reset button anytime to restart the tutorial.');
        
        
        this.tutorialActive = false;
        this.tutorialCompleted = true;
        localStorage.setItem('tutorialCompleted', 'true');
        
        
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        
        this.currentHighlightedElement = null;
        
        
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        
        this.clearDimming();
        
        
        this.overlay.classList.add('hidden');
        this.modal.classList.add('hidden');
        
        
        this.game.startBtn.disabled = false;
        
        
        setTimeout(() => {
            this.game.startGame();
        }, 500);
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            
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
    
    injectTrackingPixels(html) {
        // Find a good place to inject the tracking pixels (before </body> or at the end)
        // We'll inject them in different places to make them less obvious
        const lines = html.split('\n');
        
        
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        
        this.currentHighlightedElement = null;
        
        
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        
        this.clearDimming();
        
        
        this.overlay.classList.add('hidden');
        this.modal.classList.add('hidden');
        
        
        this.game.startBtn.disabled = false;
        
        
        if (this.currentStep >= this.steps.length - 1) {
            setTimeout(() => {
                alert('Tutorial complete! The game will now start. You have 45 seconds to block all 3 trackers!');
                this.game.startGame();
            }, 500);
        }
        
        return positions;
    }
    
    getIndentLevel(line) {
        const match = line.match(/^(\s*)/);
        return match ? match[1] : '';
    }
}

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
            { id: 1, name: 'analytics.com', company: 'Analytics Tracker', blocked: false, codeDeleted: false },
            { id: 2, name: 'adnetwork.com', company: 'Ad Network', blocked: false, codeDeleted: false },
            { id: 3, name: 'databroker.com', company: 'Data Broker', blocked: false, codeDeleted: false }
        ];
        
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
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codeLine = e.target.closest('.tracking-line');
                const trackerId = parseInt(codeLine.getAttribute('data-tracker'));
                this.deleteCode(trackerId, codeLine);
            });
        });
        
      
        document.querySelectorAll('.btn-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productName = productCard.querySelector('h4').textContent;
                const productPrice = productCard.getAttribute('data-price');
                const productIcon = productCard.getAttribute('data-icon');
                this.showDetailPage(productName, productPrice, productIcon);
                
               
                if (window.tutorial && window.tutorial.tutorialActive && window.tutorial.steps[window.tutorial.currentStep].action === 'waitForProductClick') {
                    setTimeout(() => window.tutorial.nextStep(), 500); 
                }
            });
        });
        
       
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showMainPage());
        }

       
        this.resetBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (window.tutorial) {
                 if (confirm('Right-click detected! Do you want to restart the tutorial?')) {
                     window.tutorial.reset();
                 }
            }
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
        
       
        this.trackers.forEach(tracker => {
            tracker.blocked = false;
            tracker.codeDeleted = false;
        });
        
      
        document.querySelectorAll('.tracking-line').forEach(line => {
            line.classList.remove('deleted');
        });
        
        
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
        if (data) {
            url += `&data=${encodeURIComponent(data)}`;
        }
        url += `&time=${Date.now()}`;
        
        
        requestLine.innerHTML = `
            → GET ${url}
            <span class="block-link" onclick="window.game.blockRequest(${tracker.id})">[ BLOCK ]</span>
        `;
        
        this.terminal.appendChild(requestLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    showDetailPage(productName, productPrice, productIcon) {
        
        const mainPage = document.getElementById('mainPage');
        const detailPage = document.getElementById('detailPage');
        
        mainPage.style.display = 'none';
        detailPage.style.display = 'block';
        
        
        document.getElementById('detailIcon').textContent = productIcon;
        document.getElementById('detailName').textContent = productName;
        document.getElementById('detailPrice').textContent = productPrice;
        
        
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
        
       
        if (this.gameActive) {
            const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted).length;
            activeTrackers.forEach(tracker => {
                this.addNetworkRequest(tracker, 'click', productName);
            });
        }
    }
    
    showMainPage() {
        
        const mainPage = document.getElementById('mainPage');
        const detailPage = document.getElementById('detailPage');
        
        mainPage.style.display = 'block';
        detailPage.style.display = 'none';
        
        
        if (this.gameActive) {
            const activeTrackers = this.trackers.filter(t => !t.blocked && !t.codeDeleted).length;
            activeTrackers.forEach(tracker => {
                this.addNetworkRequest(tracker, 'pageview', 'main-page');
            });
        }
    }
    
    blockRequest(trackerId) {
        if (!this.gameActive && !(window.tutorial && window.tutorial.tutorialActive)) return; 
        
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
        successLine.textContent = `✓ BLOCKED: All requests to ${tracker.name} have been blocked!`;
        this.terminal.appendChild(successLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;

       
        if (window.tutorial && window.tutorial.tutorialActive && window.tutorial.steps[window.tutorial.currentStep].action === 'waitForNetworkBlock') {
            window.tutorial.nextStep();
        }
        
        this.updateUI();
        this.checkWinCondition();
    }
    
    deleteCode(trackerId, codeLine) {
        if (!this.gameActive && !(window.tutorial && window.tutorial.tutorialActive)) return; 
        
        const tracker = this.trackers.find(t => t.id === trackerId + 1); // trackerId is 0-indexed in array
        if (!tracker || tracker.codeDeleted) return;
        
        tracker.codeDeleted = true;
        tracker.blocked = true; 
        this.trackersBlocked++;
        
        
        codeLine.classList.add('deleted');
        
        
        const successLine = document.createElement('div');
        successLine.className = 'terminal-line success';
        successLine.textContent = `✓ CODE DELETED: ${tracker.company} tracking pixel removed from HTML!`;
        this.terminal.appendChild(successLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        
        
        const requestLines = this.terminal.querySelectorAll(`[data-tracker="${trackerId}"]`);
        requestLines.forEach(line => {
            if (line.classList.contains('request')) {
                line.classList.remove('request');
                line.classList.add('blocked');
            }
        });

        
        if (window.tutorial && window.tutorial.tutorialActive && window.tutorial.steps[window.tutorial.currentStep].action === 'waitForCodeDelete') {
            window.tutorial.nextStep();
        }
        
        this.updateUI();
        this.checkWinCondition();
    }
    
    updateUI() {
        this.timerElement.textContent = `${this.timeRemaining}s`;
        this.blockedElement.textContent = `${this.trackersBlocked}/${this.totalTrackers}`;
        this.dataLeakedElement.textContent = `${this.dataLeaked.toFixed(1)} KB`;
        this.timeOnSiteElement.textContent = `${this.timeOnSiteCounter}s`;
        
       
        if (this.timeRemaining <= 15) {
            this.timerElement.style.color = '#f44336';
        } else if (this.timeRemaining <= 30) {
            this.timerElement.style.color = '#ff9800';
        } else {
            this.timerElement.style.color = '#667eea';
        }
        
        
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
                <button onclick="window.location.href='index.html';" class="btn-launch" style="margin-top: 20px;">Return to Home</button>
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
                <button onclick="window.location.href='index.html';" class="btn-launch" style="margin-top: 20px;">Return to Home</button>
            `;
        }
        
        
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
        
        
        this.trackers.forEach(tracker => {
            tracker.blocked = false;
            tracker.codeDeleted = false;
        });
        
        
        document.querySelectorAll('.tracking-line').forEach(line => {
            line.classList.remove('deleted');
        });
        
       
        this.terminal.innerHTML = `
            <div class="terminal-line">$ Monitoring network traffic...</div>
            <div class="terminal-line">$ Waiting for activity...</div>
        `;
        
        // Reset HTML display
        this.updateHTMLDisplay();
        
        this.updateUI();
    }
}


let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new TrackerSimulator();
    window.game = game; 
    tutorial = new TutorialSystem(game);
    window.tutorial = tutorial; 
  
    setTimeout(() => {
        tutorial.start();
    }, 500);
});
