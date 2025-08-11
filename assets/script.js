/**
 * Portfolio Website JavaScript
 * Handles section navigation and accessibility features
 */

class PortfolioApp {
  constructor() {
    this.currentSection = 'intro';
    this.sections = {
      intro: document.getElementById('intro-section'),
      bio: document.getElementById('bio-section')
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleImageErrors();
    this.announcePageLoad();
  }

  bindEvents() {
    // Bio navigation button
    const bioNavButton = document.getElementById('bio-nav-button');
    if (bioNavButton) {
      bioNavButton.addEventListener('click', () => this.showSection('bio'));
      bioNavButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showSection('bio');
        }
      });
    }

    // Home navigation (clicking on main content or logo)
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
      homeButton.addEventListener('click', () => this.showSection('intro'));
      homeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showSection('intro');
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.showSection('intro');
      }
    });
  }

  showSection(sectionName) {
    // Hide all sections
    Object.values(this.sections).forEach(section => {
      if (section) {
        section.classList.add('hidden');
        section.setAttribute('aria-hidden', 'true');
      }
    });

    // Show target section
    const targetSection = this.sections[sectionName];
    if (targetSection) {
      targetSection.classList.remove('hidden');
      targetSection.setAttribute('aria-hidden', 'false');
      
      // Update current section
      this.currentSection = sectionName;
      
      // Announce section change to screen readers
      this.announceSection(sectionName);
      
      // Focus management
      this.manageFocus(targetSection);
    }
  }

  manageFocus(section) {
    // Find the first focusable element in the section
    const focusable = section.querySelector('h1, h2, h3, button, a, [tabindex]:not([tabindex="-1"])');
    if (focusable) {
      focusable.focus();
    }
  }

  announceSection(sectionName) {
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
      const messages = {
        intro: 'Showing main introduction section',
        bio: 'Showing about me section'
      };
      announcer.textContent = messages[sectionName] || `Showing ${sectionName} section`;
    }
  }

  announcePageLoad() {
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
      announcer.textContent = 'Portfolio website loaded. Navigate using the menu or keyboard shortcuts.';
    }
  }

  handleImageErrors() {
    const images = document.querySelectorAll('img[data-fallback]');
    images.forEach(img => {
      img.addEventListener('error', () => {
        const fallback = img.getAttribute('data-fallback');
        if (fallback && img.src !== fallback) {
          img.src = fallback;
          img.alt = 'Fallback image';
        }
      });
    });

    // Handle the flower image specifically
    const flowerImg = document.querySelector('img[src*="placehold.co"]');
    if (flowerImg) {
      flowerImg.addEventListener('error', () => {
        if (flowerImg.src.includes('placehold.co')) {
          flowerImg.src = 'flower.jpg';
        }
      });
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}