// Navigation state
let currentView = 'home-view';
let viewHistory = ['home-view'];

// Get DOM elements
const homeBtn = document.getElementById('home-btn');
const backBtn = document.getElementById('back-btn');
const allActionBtns = document.querySelectorAll('.action-btn');
const allViews = document.querySelectorAll('.view');

// Initialize the app
function init() {
    // Show home view by default
    showView('home-view', false);
    
    // Set up event listeners
    homeBtn.addEventListener('click', goHome);
    backBtn.addEventListener('click', goBack);
    
    // Add click listeners to all action buttons
    allActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetView = this.getAttribute('data-view');
            if (targetView) {
                showView(targetView, true);
            }
        });
    });
}

// Show a specific view
function showView(viewId, addToHistory = true) {
    // Hide all views
    allViews.forEach(view => {
        view.classList.remove('active');
    });
    
    // Show the target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        currentView = viewId;
        
        // Add to history if requested
        if (addToHistory) {
            viewHistory.push(viewId);
        }
        
        // Update navigation buttons
        updateNavButtons();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Go back to previous view
function goBack() {
    if (viewHistory.length > 1) {
        // Remove current view from history
        viewHistory.pop();
        
        // Get previous view
        const previousView = viewHistory[viewHistory.length - 1];
        
        // Show previous view without adding to history
        showView(previousView, false);
    }
}

// Go to home view
function goHome() {
    // Clear history and go to home
    viewHistory = ['home-view'];
    showView('home-view', false);
}

// Update navigation button states
function updateNavButtons() {
    // Update Home button
    if (currentView === 'home-view') {
        homeBtn.classList.add('active');
        backBtn.style.display = 'none';
    } else {
        homeBtn.classList.remove('active');
        backBtn.style.display = 'inline-block';
    }
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key or Backspace to go back (when not in input field)
    if ((e.key === 'Escape' || (e.key === 'Backspace' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) && currentView !== 'home-view') {
        e.preventDefault();
        goBack();
    }
    
    // Alt+H to go home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        goHome();
    }
});

// Handle browser back button
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.view) {
        showView(e.state.view, false);
    } else {
        goHome();
    }
});

// Push initial state
history.replaceState({ view: 'home-view' }, '', '');

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add smooth scroll behavior for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Optional: Add loading state for iframes
document.querySelectorAll('.iframe-container iframe').forEach(iframe => {
    iframe.addEventListener('load', function() {
        console.log('Iframe loaded:', this.title);
    });
});

// Console welcome message
console.log('%c🔍 Pixel Tracking Education', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cWelcome to the Pixel Tracking Education web app!', 'color: #764ba2;');
console.log('%cKeyboard shortcuts:', 'font-weight: bold; color: #667eea;');
console.log('  • ESC or Backspace: Go back');
console.log('  • Alt+H: Go to home');
