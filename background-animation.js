/**
 * Canvas-based background animation system
 * Replaces CPU-intensive CSS animations with GPU-accelerated Canvas
 */

class BackgroundAnimation {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.startTime = Date.now();
    
    // Animation parameters
    this.gradientTime = 0;
    this.blob1 = {
      x: -100,
      y: -100,
      baseX: -100,
      baseY: -100,
      width: 450,
      height: 450,
      color: 'rgba(170, 180, 200, 0.5)',
      time: 0,
      duration: 20000, // 20s
      alternate: true
    };
    
    this.blob2 = {
      x: 0, // Will be set based on viewport
      y: 0, // Will be set based on viewport  
      baseX: 0,
      baseY: 0,
      width: 550,
      height: 550,
      color: 'rgba(60, 140, 130, 0.6)',
      time: 0,
      duration: 25000, // 25s
      alternate: false // reverse direction
    };
  }

  init() {
    this.createCanvas();
    this.resize();
    this.setupEventListeners();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    
    this.ctx = this.canvas.getContext('2d');
    
    // Insert canvas as first child of body to be behind everything
    document.body.insertBefore(this.canvas, document.body.firstChild);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    // Update blob2 position (bottom-right)
    this.blob2.baseX = rect.width - 150;
    this.blob2.baseY = rect.height - 150;
    this.blob2.x = this.blob2.baseX;
    this.blob2.y = this.blob2.baseY;
  }

  createGradient(time) {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Create animated gradient
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    
    // Animate gradient position (similar to CSS background-position)
    const offset = Math.sin(time * 0.0004) * 0.5 + 0.5; // 0 to 1
    
    gradient.addColorStop(0, '#ffdabe');
    gradient.addColorStop(0.3 + offset * 0.1, '#ffc0cb');
    gradient.addColorStop(0.6 + offset * 0.1, '#e6e6fa');
    gradient.addColorStop(1, '#add8e6');
    
    return gradient;
  }

  drawBlobWithBlur(blob, currentTime) {
    const progress = (currentTime % blob.duration) / blob.duration;
    let t = blob.alternate ? progress : 1 - progress;
    
    // Smooth easing
    t = t * t * (3 - 2 * t); // smoothstep
    
    // Calculate position
    const offsetX = 20 * t;
    const offsetY = -30 * t;
    const scale = 1 + 0.1 * t;
    
    const x = blob.baseX + offsetX;
    const y = blob.baseY + offsetY;
    
    // Create simplified blur effect using fewer passes for better performance
    const blurPasses = 4;
    const blurRadius = 30;
    
    this.ctx.save();
    this.ctx.globalAlpha = 0.5 / blurPasses;
    
    for (let i = 0; i < blurPasses; i++) {
      const angle = (i / blurPasses) * Math.PI * 2;
      const blurOffsetX = Math.cos(angle) * blurRadius * (i / (blurPasses - 1));
      const blurOffsetY = Math.sin(angle) * blurRadius * (i / (blurPasses - 1));
      
      this.ctx.save();
      
      // Apply transform
      this.ctx.translate(x + blob.width/2 + blurOffsetX, y + blob.height/2 + blurOffsetY);
      this.ctx.scale(scale, scale);
      this.ctx.translate(-blob.width/2, -blob.height/2);
      
      // Create blob shape
      this.ctx.beginPath();
      
      const centerX = blob.width / 2;
      const centerY = blob.height / 2;
      const radiusX = blob.width / 2;
      const radiusY = blob.height / 2;
      const variation = Math.sin(currentTime * 0.001 + (blob.alternate ? 0 : Math.PI)) * 0.2;
      
      // Create organic blob shape
      this.ctx.ellipse(
        centerX, 
        centerY, 
        radiusX * (1 + variation), 
        radiusY * (1 - variation * 0.5), 
        variation * 0.3, 0, 2 * Math.PI
      );
      
      this.ctx.fillStyle = blob.color;
      this.ctx.fill();
      
      this.ctx.restore();
    }
    
    this.ctx.restore();
  }

  animate() {
    const currentTime = Date.now() - this.startTime;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw animated gradient background
    this.ctx.fillStyle = this.createGradient(currentTime);
    this.ctx.fillRect(0, 0, width, height);
    
    // Draw blobs with blur effect
    this.drawBlobWithBlur(this.blob1, currentTime);
    this.drawBlobWithBlur(this.blob2, currentTime);
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.backgroundAnimation = new BackgroundAnimation();
  window.backgroundAnimation.init();
});