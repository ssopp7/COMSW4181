// Navigation State
let currentPage = 'home';

// DOM Elements
const tocToggle = document.getElementById('toc-toggle');
const tocNav = document.getElementById('toc-nav');
const logoHome = document.getElementById('logo-home');
const allPages = document.querySelectorAll('.page');
const allTocLinks = document.querySelectorAll('.toc-link');
const allSectionBtns = document.querySelectorAll('.toc-section-btn');
const allSubsectionBtns = document.querySelectorAll('.toc-subsection-btn');

// Initialize the application
function init() {
    setupEventListeners();
    showPage('home');
    console.log('PixelEd Navigation System Initialized');
}

// Setup Event Listeners
function setupEventListeners() {
    // TOC Toggle Button
    tocToggle.addEventListener('click', toggleTOC);
    
    // Logo Click - Return to Home
    logoHome.addEventListener('click', () => {
        navigateToPage('home');
        closeTOC();
    });
    
    // TOC Links
    allTocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('data-page');
            navigateToPage(pageName);
            closeTOC();
        });
    });
    
    // Section Toggle Buttons
    allSectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('data-section');
            toggleSection(sectionId, btn);
        });
    });
    
    // Subsection Toggle Buttons
    allSubsectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subsectionId = btn.getAttribute('data-subsection');
            toggleSubsection(subsectionId, btn);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Close TOC when clicking outside
    document.addEventListener('click', (e) => {
        if (tocNav.classList.contains('active') && 
            !tocNav.contains(e.target) && 
            !tocToggle.contains(e.target)) {
            closeTOC();
        }
    });
}

// Toggle Table of Contents
function toggleTOC() {
    tocToggle.classList.toggle('active');
    tocNav.classList.toggle('active');
}

// Close Table of Contents
function closeTOC() {
    tocToggle.classList.remove('active');
    tocNav.classList.remove('active');
}

// Toggle Section (Module)
function toggleSection(sectionId, button) {
    const section = document.getElementById(sectionId);
    
    if (section) {
        const isActive = section.classList.contains('active');
        
        // Close all other sections
        document.querySelectorAll('.toc-subsection').forEach(s => {
            if (s.id !== sectionId) {
                s.classList.remove('active');
            }
        });
        
        // Close all section buttons
        allSectionBtns.forEach(btn => {
            if (btn !== button) {
                btn.classList.remove('active');
            }
        });
        
        // Toggle current section
        section.classList.toggle('active');
        button.classList.toggle('active');
    }
}

// Toggle Subsection
function toggleSubsection(subsectionId, button) {
    const subsection = document.getElementById(subsectionId);
    
    if (subsection) {
        subsection.classList.toggle('active');
        button.classList.toggle('active');
    }
}

// Navigate to Page
function navigateToPage(pageName) {
    if (pageName === currentPage) return;
    
    // Hide all pages
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Update active link in TOC
        updateActiveTOCLink(pageName);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update URL hash without scrolling
        history.pushState({ page: pageName }, '', `#${pageName}`);
    }
}

// Show Page (for initialization)
function showPage(pageName) {
    // Hide all pages
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        updateActiveTOCLink(pageName);
    }
}

// Update Active TOC Link
function updateActiveTOCLink(pageName) {
    // Remove active class from all links
    allTocLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current link
    const activeLink = document.querySelector(`.toc-link[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        
        // Expand parent sections if needed
        expandParentSections(activeLink);
    }
}

// Expand Parent Sections
function expandParentSections(link) {
    let parent = link.parentElement;
    
    while (parent) {
        // Check if parent is a subsection
        if (parent.classList.contains('toc-subsection')) {
            parent.classList.add('active');
            
            // Find and activate the corresponding button
            const sectionId = parent.id;
            const sectionBtn = document.querySelector(`[data-section="${sectionId}"]`);
            if (sectionBtn) {
                sectionBtn.classList.add('active');
            }
        }
        
        // Check if parent is a subsubsection
        if (parent.classList.contains('toc-subsubsection')) {
            parent.classList.add('active');
            
            // Find and activate the corresponding button
            const subsectionId = parent.id;
            const subsectionBtn = document.querySelector(`[data-subsection="${subsectionId}"]`);
            if (subsectionBtn) {
                subsectionBtn.classList.add('active');
            }
        }
        
        parent = parent.parentElement;
    }
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // ESC to close TOC
    if (e.key === 'Escape' && tocNav.classList.contains('active')) {
        closeTOC();
    }
    
    // Ctrl/Cmd + K to toggle TOC
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleTOC();
    }
    
    // Ctrl/Cmd + H to go home
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        navigateToPage('home');
        closeTOC();
    }
}

// Handle Browser Back/Forward Buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        showPage(e.state.page);
    } else {
        // Get page from URL hash
        const hash = window.location.hash.substring(1);
        if (hash) {
            showPage(hash);
        } else {
            showPage('home');
        }
    }
});

// Handle Initial URL Hash
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateToPage(hash);
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Console Welcome Message
console.log('%c🎓 PixelEd - Pixel Tracking Education Platform', 'font-size: 18px; font-weight: bold; color: #000000;');
console.log('%cKeyboard Shortcuts:', 'font-weight: bold; margin-top: 10px;');
console.log('  • Ctrl/Cmd + K: Toggle Table of Contents');
console.log('  • Ctrl/Cmd + H: Go to Home');
console.log('  • ESC: Close Table of Contents');

// Next Section Button Navigation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('next-section-btn') || e.target.closest('.next-section-btn')) {
        e.preventDefault();
        const btn = e.target.classList.contains('next-section-btn') ? e.target : e.target.closest('.next-section-btn');
        const nextPage = btn.getAttribute('data-page');
        if (nextPage) {
            navigateToPage(nextPage);
        }
    }
});
