// Enhanced Doctor View - Interactive JavaScript with Advanced UI Components
// Authentication System for Doctor Page Only

// Enhanced FAB (Floating Action Button) System
class FloatingActionButton {
  constructor() {
    this.fabMain = document.getElementById('fabMain');
    this.fabMenu = document.getElementById('fabMenu');
    this.fabBackdrop = document.getElementById('fabBackdrop');
    this.fabIcon = document.getElementById('fabIcon');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    this.fabMain.addEventListener('click', () => this.toggle());
    this.fabBackdrop.addEventListener('click', () => this.close());
    
    // Handle FAB option clicks
    document.querySelectorAll('.fab-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleAction(action);
        this.close();
      });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.fabMenu.classList.add('active');
    this.fabBackdrop.classList.add('active');
    this.fabMain.classList.add('active');
    this.fabIcon.className = 'fas fa-times';
  }
  
  close() {
    this.isOpen = false;
    this.fabMenu.classList.remove('active');
    this.fabBackdrop.classList.remove('active');
    this.fabMain.classList.remove('active');
    this.fabIcon.className = 'fas fa-plus';
  }
  
  handleAction(action) {
    switch(action) {
      case 'emergency':
        notificationSystem.showEmergency('Emergency Alert', 'Emergency protocol activated for current patient');
        break;
      case 'prescription':
        notificationSystem.showSuccess('Quick Prescription', 'Opening prescription form...');
        setTimeout(() => document.getElementById('addPrescription').click(), 500);
        break;
      case 'notes':
        notificationSystem.showInfo('Add Notes', 'Opening notes section...');
        setTimeout(() => {
          const notesTab = document.querySelector('[data-tab="notes"]');
          if (notesTab) notesTab.click();
        }, 500);
        break;
      case 'appointment':
        notificationSystem.showInfo('Schedule Appointment', 'Opening appointment scheduler...');
        break;
      case 'search':
        quickSearch.open();
        break;
    }
  }
}

// Enhanced Quick Search System
class QuickSearch {
  constructor() {
    this.overlay = document.getElementById('searchOverlay');
    this.input = document.getElementById('quickSearchInput');
    this.results = document.getElementById('searchResults');
    this.closeBtn = document.getElementById('searchClose');
    this.filters = document.querySelectorAll('.filter-btn');
    this.currentFilter = 'all';
    
    this.init();
  }
  
  init() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    
    this.input.addEventListener('input', (e) => this.handleSearch(e.target.value));
    
    this.filters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        this.filters.forEach(f => f.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.handleSearch(this.input.value);
      });
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open() {
    this.overlay.classList.add('active');
    setTimeout(() => this.input.focus(), 300);
  }
  
  close() {
    this.overlay.classList.remove('active');
    this.input.value = '';
    this.results.innerHTML = '';
  }
  
  handleSearch(query) {
    if (query.length < 2) {
      this.results.innerHTML = '';
      return;
    }
    
    // Simulate search results
    const mockResults = this.getMockResults(query, this.currentFilter);
    this.displayResults(mockResults);
  }
  
  getMockResults(query, filter) {
    const allResults = [
      { type: 'patient', name: 'Rajesh Kumar', detail: 'Construction Worker, ID: KL-MW-2024-1234', icon: 'fa-user' },
      { type: 'patient', name: 'Priya Sharma', detail: 'Factory Worker, ID: KL-MW-2024-1235', icon: 'fa-user' },
      { type: 'condition', name: 'Hypertension', detail: 'High blood pressure condition', icon: 'fa-heartbeat' },
      { type: 'condition', name: 'Diabetes Type 2', detail: 'Blood sugar management', icon: 'fa-tint' },
      { type: 'medication', name: 'Lisinopril', detail: 'ACE inhibitor for blood pressure', icon: 'fa-pills' },
      { type: 'medication', name: 'Metformin', detail: 'Diabetes medication', icon: 'fa-pills' }
    ];
    
    return allResults.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
                          item.detail.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'all' || 
                           (filter === 'patients' && item.type === 'patient') ||
                           (filter === 'conditions' && item.type === 'condition') ||
                           (filter === 'medications' && item.type === 'medication');
      return matchesQuery && matchesFilter;
    });
  }
  
  displayResults(results) {
    if (results.length === 0) {
      this.results.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }
    
    this.results.innerHTML = results.map(result => `
      <div class="search-result-item" onclick="quickSearch.selectResult('${result.type}', '${result.name}')">
        <div class="search-result-icon">
          <i class="fas ${result.icon}"></i>
        </div>
        <div class="search-result-content">
          <div class="search-result-name">${result.name}</div>
          <div class="search-result-detail">${result.detail}</div>
        </div>
      </div>
    `).join('');
  }
  
  selectResult(type, name) {
    notificationSystem.showSuccess('Selected', `Selected ${type}: ${name}`);
    this.close();
  }
}

// Enhanced Analytics and Charts System
class HealthAnalytics {
  constructor() {
    this.charts = {};
    this.init();
  }
  
  init() {
    this.initVitalSignsChart();
    this.initHealthScoreGauge();
    this.initMedicalTimeline();
    this.setupTimeframeSelector();
  }
  
  initVitalSignsChart() {
    const ctx = document.getElementById('vitalSignsChart');
    if (!ctx) return;
    
    const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(46, 139, 87, 0.8)');
    gradient1.addColorStop(1, 'rgba(46, 139, 87, 0.1)');
    
    const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
    gradient2.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
    
    const gradient3 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient3.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
    gradient3.addColorStop(1, 'rgba(245, 158, 11, 0.1)');
    
    this.charts.vitalSigns = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Blood Pressure (Systolic)',
          data: [120, 125, 118, 122, 128, 124],
          borderColor: '#2E8B57',
          backgroundColor: gradient1,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#2E8B57',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 6
        }, {
          label: 'Heart Rate',
          data: [72, 75, 70, 73, 78, 74],
          borderColor: '#ef4444',
          backgroundColor: gradient2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 6
        }, {
          label: 'Temperature (°F)',
          data: [98.6, 98.8, 98.4, 98.7, 99.1, 98.9],
          borderColor: '#f59e0b',
          backgroundColor: gradient3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(46, 139, 87, 0.1)',
              borderColor: 'rgba(46, 139, 87, 0.2)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                weight: '500'
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(46, 139, 87, 0.1)',
              borderColor: 'rgba(46, 139, 87, 0.2)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                weight: '500'
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'easeInOutCubic',
            from: 1,
            to: 0,
            loop: false
          }
        }
      }
    });
  }
  
  initHealthScoreGauge() {
    const ctx = document.getElementById('healthScoreGauge');
    if (!ctx) return;
    
    const score = 78;
    const maxScore = 100;
    
    this.charts.healthScore = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [score, maxScore - score],
          backgroundColor: [
            '#2E8B57',
            'rgba(46, 139, 87, 0.1)'
          ],
          borderWidth: 0,
          cutout: '75%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        animation: {
          animateRotate: true,
          duration: 2000,
          easing: 'easeOutCubic'
        }
      }
    });
  }
  
  initMedicalTimeline() {
    const timeline = document.getElementById('medicalTimeline');
    if (!timeline) return;
    
    const timelineData = [
      {
        type: 'diagnosis',
        title: 'Hypertension Diagnosis',
        description: 'Diagnosed with stage 1 hypertension. Blood pressure consistently elevated.',
        date: '2024-08-15',
        icon: 'fa-stethoscope'
      },
      {
        type: 'prescription',
        title: 'Medication Prescribed',
        description: 'Prescribed Lisinopril 10mg daily for blood pressure management.',
        date: '2024-08-15',
        icon: 'fa-pills'
      },
      {
        type: 'test',
        title: 'Blood Work Results',
        description: 'Complete metabolic panel shows normal kidney function.',
        date: '2024-08-10',
        icon: 'fa-flask'
      },
      {
        type: 'appointment',
        title: 'Follow-up Scheduled',
        description: 'Monthly check-up scheduled to monitor blood pressure trends.',
        date: '2024-08-05',
        icon: 'fa-calendar-check'
      },
      {
        type: 'diagnosis',
        title: 'Initial Consultation',
        description: 'Patient reported frequent headaches and dizziness. Initial assessment completed.',
        date: '2024-07-28',
        icon: 'fa-user-md'
      }
    ];
    
    timeline.innerHTML = timelineData.map(item => `
      <div class="timeline-item">
        <div class="timeline-icon ${item.type}">
          <i class="fas ${item.icon}"></i>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-description">${item.description}</div>
          <div class="timeline-date">${new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</div>
        </div>
      </div>
    `).join('');
  }
  
  setupTimeframeSelector() {
    const selector = document.getElementById('analyticsTimeframe');
    if (!selector) return;
    
    selector.addEventListener('change', (e) => {
      this.updateChartsForTimeframe(e.target.value);
      notificationSystem.showInfo('Analytics Updated', `Switched to ${e.target.options[e.target.selectedIndex].text} view`);
    });
  }
  
  updateChartsForTimeframe(timeframe) {
    // Update chart data based on timeframe
    const vitalChart = this.charts.vitalSigns;
    if (vitalChart) {
      const dataMap = {
        week: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          bp: [122, 120, 125, 118, 124, 119, 121],
          hr: [74, 72, 76, 71, 75, 73, 74],
          temp: [98.7, 98.6, 98.9, 98.5, 98.8, 98.6, 98.7]
        },
        month: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          bp: [120, 125, 118, 124],
          hr: [72, 75, 70, 74],
          temp: [98.6, 98.8, 98.4, 98.9]
        },
        quarter: {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          bp: [125, 120, 122],
          hr: [75, 72, 73],
          temp: [98.8, 98.6, 98.7]
        },
        year: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          bp: [123, 121, 119, 122],
          hr: [74, 73, 71, 73],
          temp: [98.7, 98.6, 98.5, 98.7]
        }
      };
      
      const data = dataMap[timeframe];
      vitalChart.data.labels = data.labels;
      vitalChart.data.datasets[0].data = data.bp;
      vitalChart.data.datasets[1].data = data.hr;
      vitalChart.data.datasets[2].data = data.temp;
      vitalChart.update('active');
    }
  }
}

// Enhanced Notification System
class NotificationSystem {
  constructor() {
    this.container = document.getElementById('notificationContainer');
    this.system = document.getElementById('notificationSystem');
    this.list = document.getElementById('notificationList');
    this.closeBtn = document.getElementById('notificationClose');
    this.clearAllBtn = document.getElementById('clearAllNotifications');
    this.notifications = [];
    
    this.init();
  }
  
  init() {
    this.closeBtn.addEventListener('click', () => this.hideSystem());
    this.clearAllBtn.addEventListener('click', () => this.clearAll());
    
    // Show initial notifications
    this.addInitialNotifications();
  }
  
  show(type, title, message, duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">
          <i class="fas ${this.getIcon(type)}"></i>
        </div>
        <div class="notification-title">${title}</div>
        <button class="notification-close" onclick="this.closest('.notification').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notification-message">${message}</div>
      <div class="notification-progress">
        <div class="notification-progress-fill" style="animation-duration: ${duration}ms"></div>
      </div>
    `;

    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }
  
  showSuccess(title, message) {
    this.show('success', title, message);
    this.addToSystem('success', title, message);
  }
  
  showInfo(title, message) {
    this.show('info', title, message);
    this.addToSystem('info', title, message);
  }
  
  showWarning(title, message) {
    this.show('warning', title, message);
    this.addToSystem('info', title, message);
  }
  
  showEmergency(title, message) {
    this.show('error', title, message);
    this.addToSystem('emergency', title, message);
  }
  
  addToSystem(type, title, message) {
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    notificationItem.innerHTML = `
      <div class="notification-icon ${type}">
        <i class="fas ${this.getIcon(type)}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
        <div class="notification-time">${timeString}</div>
      </div>
    `;
    
    this.list.insertBefore(notificationItem, this.list.firstChild);
  }
  
  showSystem() {
    this.system.classList.add('active');
  }
  
  hideSystem() {
    this.system.classList.remove('active');
  }
  
  clearAll() {
    this.list.innerHTML = '';
    notificationSystem.showInfo('Cleared', 'All notifications cleared');
  }
  
  addInitialNotifications() {
    this.addToSystem('info', 'System Ready', 'Doctor dashboard loaded successfully');
    this.addToSystem('info', 'Patient Loaded', 'Rajesh Kumar\'s medical records loaded');
  }

  getIcon(type) {
    const icons = {
      success: 'fa-check',
      warning: 'fa-exclamation-triangle',
      error: 'fa-times-circle',
      emergency: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
  }

  remove(notification) {
    notification.classList.add('slide-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
      this.notifications = this.notifications.filter(n => n !== notification);
    }, 300);
  }

  clear() {
    this.notifications.forEach(notification => this.remove(notification));
  }
}

// Enhanced Progress System
class ProgressSystem {
  constructor() {
    this.overlay = document.getElementById('progressOverlay');
    this.title = document.getElementById('progressTitle');
    this.description = document.getElementById('progressDescription');
    this.fill = document.getElementById('progressFill');
    this.percentage = document.getElementById('progressPercentage');
    this.currentProgress = 0;
  }

  show(title, description) {
    this.title.textContent = title;
    this.description.textContent = description;
    this.overlay.style.display = 'flex';
    this.setProgress(0);
  }

  setProgress(percent) {
    this.currentProgress = Math.max(0, Math.min(100, percent));
    this.fill.style.width = `${this.currentProgress}%`;
    this.percentage.textContent = `${Math.round(this.currentProgress)}%`;
  }

  incrementProgress(amount = 10) {
    this.setProgress(this.currentProgress + amount);
  }

  hide() {
    this.overlay.style.animation = 'progressOverlayEnter 0.3s ease-in reverse';
    setTimeout(() => {
      this.overlay.style.display = 'none';
      this.overlay.style.animation = '';
    }, 300);
  }

  async simulateProgress(steps) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      this.setProgress((i + 1) * (100 / steps.length));
      this.description.textContent = step;
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }
  }
}

// Global instances
const notifications = new NotificationSystem();
const progress = new ProgressSystem();

class AuthenticationManager {
  constructor() {
    // No credential restrictions - accept any input
    this.isAuthenticated = false;
    
    this.init();
  }
  
  init() {
    // Show auth modal immediately when page loads
    this.showAuthModal();
    this.bindAuthEvents();
  }
  
  showAuthModal() {
    const authOverlay = document.getElementById('authOverlay');
    authOverlay.style.display = 'flex';
    
    // Hide main content initially
    document.body.style.overflow = 'hidden';
    
    // Focus on ID input
    setTimeout(() => {
      document.getElementById('authId').focus();
    }, 500);
  }
  
  hideAuthModal() {
    const authOverlay = document.getElementById('authOverlay');
    authOverlay.style.animation = 'authFadeIn 0.3s ease reverse';
    
    setTimeout(() => {
      authOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
  
  bindAuthEvents() {
    const authForm = document.getElementById('authForm');
    const verifyBtn = document.getElementById('verifyBtn');
    
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.verifyCredentials();
    });
    
    // Enter key support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.isAuthenticated) {
        e.preventDefault();
        this.verifyCredentials();
      }
    });
    
    // Real-time validation
    const inputs = authForm.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateInput(input));
    });
  }
  
  validateInput(input) {
    const field = input.closest('.auth-field');
    
    // Accept any input as valid
    if (input.value.trim() !== '') {
      field.classList.add('valid');
      field.classList.remove('invalid');
      return true;
    } else {
      field.classList.remove('valid', 'invalid');
      return false;
    }
  }
  
  verifyCredentials() {
    const idInput = document.getElementById('authId');
    const passwordInput = document.getElementById('authPassword');
    const authForm = document.getElementById('authForm');
    const authLoading = document.getElementById('authLoading');
    const verifyBtn = document.getElementById('verifyBtn');
    
    const enteredId = idInput.value.trim();
    const enteredPassword = passwordInput.value.trim();
    
    // Check if both fields have values
    if (!enteredId || !enteredPassword) {
      this.showAuthError('Please enter both ID and password.');
      return;
    }
    
    // Add button loading state
    verifyBtn.style.transform = 'scale(0.95)';
    verifyBtn.innerHTML = `
      <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      Verifying...
    `;
    
    // Show loading state with enhanced styling
    setTimeout(() => {
      authForm.style.display = 'none';
      authLoading.style.display = 'block';
      authLoading.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="color: #22c55e; font-weight: 500; animation: typingDots 1.5s infinite;">Verifying credentials<span class="dots"></span></p>
      `;
      
      // Add typing dots animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes typingDots {
          0%, 20% { }
          40% { }
          60% { }
          80%, 100% { }
        }
        .dots::after {
          content: '';
          animation: dots 1.5s infinite;
        }
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
      `;
      document.head.appendChild(style);
    }, 300);
    
    // Accept any credentials - reduced delay for better UX
    setTimeout(() => {
      this.handleSuccessfulAuth(enteredId);
    }, 800); // Reduced from 1500ms to 800ms
  }
  
  async handleSuccessfulAuth(userId) {
    this.isAuthenticated = true;
    
    // Show success message
    const authLoading = document.getElementById('authLoading');
    authLoading.innerHTML = `
      <div class="success-animation">
        <i class="fas fa-check-circle" style="color: #22c55e; font-size: 48px; margin-bottom: 16px; animation: successPulse 0.6s ease-out;"></i>
      </div>
      <h3 style="color: #22c55e; margin-bottom: 8px;">Authentication Successful!</h3>
      <p>Welcome, Dr. ${userId}. Initializing dashboard...</p>
    `;
    
    // Add success animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes successPulse {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // Reduced wait time for success animation
    await new Promise(resolve => setTimeout(resolve, 1200)); // Reduced from 2000ms
    
    // Hide auth modal
    this.hideAuthModal();
    
    // Show progress overlay with simplified loading steps
    progress.show('Loading Health Dashboard', 'Preparing your medical workspace...');
    
    const loadingSteps = [
      'Authenticating credentials...',
      'Loading patient database...',
      'Initializing dashboard...',
      'Ready!'
    ]; // Reduced from 7 steps to 4
    
    await progress.simulateProgress(loadingSteps);
    
    // Initialize dashboard
    await this.initializeDashboard();
    
    // Hide progress and show success notification
    progress.hide();
    notifications.show('success', 'Dashboard Ready', 'Your medical dashboard is ready for use.', 3000); // Reduced notification time
  }
  
  showAuthError(message) {
    // Remove existing error
    const existingError = document.querySelector('.auth-error');
    if (existingError) existingError.remove();
    
    // Create error message with improved styling
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.style.cssText = `
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
      border: 2px solid #ef4444;
      color: #dc2626;
      padding: 16px;
      border-radius: 12px;
      margin: 16px 0;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
      animation: errorSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(8px);
    `;
    
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle" style="color: #ef4444; font-size: 18px;"></i>
      <span>${message}</span>
    `;
    
    // Add improved error animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes errorSlideIn {
        0% { 
          transform: translateY(-10px) scale(0.95); 
          opacity: 0; 
        }
        100% { 
          transform: translateY(0) scale(1); 
          opacity: 1; 
        }
      }
    `;
    document.head.appendChild(style);
    
    // Insert error before actions
    const authActions = document.querySelector('.auth-actions');
    authActions.parentNode.insertBefore(errorDiv, authActions);
    
    // Add shake effect to form
    const authForm = document.getElementById('authForm');
    authForm.style.animation = 'formShake 0.5s ease';
    
    // Remove error after 4 seconds (increased time)
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.style.animation = 'errorSlideOut 0.3s ease forwards';
        setTimeout(() => errorDiv.remove(), 300);
      }
    }, 4000);
  }
  
  async initializeDashboard() {
    // Initialize the main dashboard with enhanced feedback
    if (typeof DoctorDashboard !== 'undefined') {
      window.doctorDashboard = new DoctorDashboard();
      
      // Show welcome notification
      await new Promise(resolve => setTimeout(resolve, 500));
      notifications.show('info', 'Welcome Doctor!', 'Dashboard initialized successfully. All systems are operational.', 3000);
      
      // Add periodic notifications for demo
      setTimeout(() => {
        notifications.show('warning', 'Health Alert', 'Patient vitals require attention in Room 204.', 6000);
      }, 8000);
      
      setTimeout(() => {
        notifications.show('success', 'Lab Results', 'New blood test results available for Patient ID: WRK001.', 5000);
      }, 15000);
    }
  }
}

// Password visibility toggle function
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('authPassword');
  const eyeIcon = document.getElementById('passwordEye');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.className = 'fas fa-eye-slash';
  } else {
    passwordInput.type = 'password';
    eyeIcon.className = 'fas fa-eye';
  }
}

// Forgot password function
function showForgotPassword() {
  alert('For access assistance, please contact:\n\nSystem Administrator\nEmail: admin@healthcare.com\nPhone: +91-1234567890\n\nAny ID and password combination will work for demo purposes.');
}

class DoctorDashboard {
  constructor() {
    this.currentTab = 'prescriptions';
    this.isLoading = false;
    this.patientData = {
      name: 'Rajesh Kumar',
      age: 31,
      gender: 'Male',
      bloodGroup: 'O+',
      workerId: 'KL-MW-2024-1234',
      occupation: 'Construction Worker',
      allergies: ['Penicillin'],
      emergencyContact: '+91-98765 43210',
      medicalHistory: [
        { condition: 'Diabetes', type: 'diabetes', icon: '💙' },
        { condition: 'Tuberculosis', type: 'tuberculosis', icon: '🫁' },
        { condition: 'Hypertension', type: 'hypertension', icon: '💓' }
      ],
      treatments: [
        { drug: 'Metformin', dosage: '500mg', duration: '3 months', doctor: 'Dr. Sharma' },
        { drug: 'Amlodipine', dosage: '5mg', duration: '6 months', doctor: 'Dr. Patel' },
        { drug: 'Insulin', dosage: '10 units', duration: 'Ongoing', doctor: 'Dr. Kumar' }
      ],
      vaccinations: [
        { name: 'Tetanus', status: 'completed', date: '2024-01-15' },
        { name: 'COVID Booster', status: 'due', date: '2025-09-20' },
        { name: 'Hepatitis B', status: 'not-taken', date: null },
        { name: 'Influenza', status: 'completed', date: '2024-10-01' }
      ],
      prescriptions: [
        { id: 1, title: 'Prescription #001', date: '2025-09-10', type: 'PDF', medicines: ['Metformin 500mg', 'Vitamin D3'] },
        { id: 2, title: 'Prescription #002', date: '2025-08-15', type: 'PDF', medicines: ['Amlodipine 5mg'] },
        { id: 3, title: 'Emergency Rx', date: '2025-07-22', type: 'Image', medicines: ['Paracetamol 500mg'] }
      ],
      notes: [
        { date: '2025-09-10', title: 'Regular Checkup', content: 'Patient showing good progress with diabetes management. Blood sugar levels stable.' },
        { date: '2025-08-15', title: 'Blood Pressure Review', content: 'BP slightly elevated. Adjusted Amlodipine dosage. Recommended lifestyle changes.' },
        { date: '2025-07-22', title: 'Emergency Visit', content: 'Patient complained of severe headache. Prescribed pain relief. Advised rest.' }
      ],
      labReports: [
        { id: 1, title: 'Blood Sugar Test', date: '2025-09-05', type: 'PDF', result: 'Normal' },
        { id: 2, title: 'Lipid Profile', date: '2025-08-20', type: 'PDF', result: 'Elevated' },
        { id: 3, title: 'Chest X-Ray', date: '2025-07-15', type: 'Image', result: 'Clear' }
      ],
      visits: [
        { date: '2025-09-10', doctor: 'Dr. Sharma', type: 'Regular Checkup', notes: 'Diabetes management review' },
        { date: '2025-08-15', doctor: 'Dr. Patel', type: 'Consultation', notes: 'Blood pressure adjustment' },
        { date: '2025-07-22', doctor: 'Dr. Kumar', type: 'Emergency', notes: 'Headache treatment' }
      ]
    };
    
    this.init();
  }

  init() {
    this.showLoadingState();
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      this.renderPatientInfo();
      this.renderMedicalHistory();
      this.renderTreatments();
      this.renderVaccinations();
      this.renderTabContent();
      this.bindEvents();
      this.hideLoadingState();
      this.showWelcomeMessage();
    }, 800);
  }

  showLoadingState() {
    const elements = [
      '.patient-sidebar',
      '.health-summary',
      '.tabbed-panel'
    ];
    
    elements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('loading-pulse');
      }
    });
  }

  hideLoadingState() {
    document.querySelectorAll('.loading-pulse').forEach(el => {
      el.classList.remove('loading-pulse');
    });
  }

  showWelcomeMessage() {
    this.showNotification(
      `Welcome! Viewing ${this.patientData.name}'s medical record`, 
      'success'
    );
  }

  renderPatientInfo() {
    // Update emergency bar
    document.getElementById('bloodGroup').textContent = this.patientData.bloodGroup;
    document.getElementById('allergyInfo').textContent = this.patientData.allergies.join(', ');
    document.getElementById('emergencyPhone').textContent = this.patientData.emergencyContact;

    // Update sidebar
    document.getElementById('patientName').textContent = this.patientData.name;
    document.getElementById('patientAgeGender').textContent = `${this.patientData.age} years, ${this.patientData.gender}`;
    document.getElementById('workerId').textContent = this.patientData.workerId;
    document.getElementById('occupation').textContent = this.patientData.occupation;
  }

  renderMedicalHistory() {
    const container = document.getElementById('medicalHistory');
    container.innerHTML = this.patientData.medicalHistory.map(condition => `
      <div class="condition-pill ${condition.type}">
        <span class="condition-icon">${condition.icon}</span>
        <span>${condition.condition}</span>
      </div>
    `).join('');
  }

  renderTreatments() {
    const tbody = document.querySelector('#treatmentsTable tbody');
    tbody.innerHTML = this.patientData.treatments.map(treatment => `
      <tr>
        <td>${treatment.drug}</td>
        <td>${treatment.dosage}</td>
        <td>${treatment.duration}</td>
        <td>${treatment.doctor}</td>
      </tr>
    `).join('');
  }

  renderVaccinations() {
    const container = document.getElementById('vaccinationList');
    const completedCount = this.patientData.vaccinations.filter(v => v.status === 'completed').length;
    const totalCount = this.patientData.vaccinations.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    // Update progress bar
    document.getElementById('vaccinationProgress').style.setProperty('--progress', `${percentage}%`);
    document.querySelector('.progress-text').textContent = `${percentage}% Complete`;

    // Render vaccination list
    container.innerHTML = this.patientData.vaccinations.map(vaccination => {
      const statusConfig = {
        completed: { icon: 'fas fa-check-circle', class: 'completed' },
        due: { icon: 'fas fa-clock', class: 'due' },
        'not-taken': { icon: 'fas fa-times-circle', class: 'not-taken' }
      };

      const config = statusConfig[vaccination.status];
      return `
        <div class="vaccination-item ${config.class}">
          <span>${vaccination.name}</span>
          <div class="vaccination-status">
            <i class="status-icon ${config.class} ${config.icon}"></i>
            <span>${vaccination.status === 'completed' ? 'Completed' : 
                       vaccination.status === 'due' ? 'Due Soon' : 'Not Taken'}</span>
            ${vaccination.date ? `<span class="vaccination-date">${vaccination.date}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  renderTabContent() {
    this.renderPrescriptions();
    this.renderNotes();
    this.renderReports();
    this.renderVisits();
  }

  renderPrescriptions() {
    const container = document.getElementById('prescriptionsGrid');
    container.innerHTML = this.patientData.prescriptions.map(prescription => `
      <div class="prescription-card" data-id="${prescription.id}">
        <div class="card-thumbnail">
          <i class="thumbnail-icon ${prescription.type === 'PDF' ? 'fas fa-file-pdf' : 'fas fa-image'}"></i>
        </div>
        <div class="card-title">${prescription.title}</div>
        <div class="card-date">${prescription.date}</div>
        <div class="prescription-medicines">
          ${prescription.medicines.map(med => `<small>${med}</small>`).join('<br>')}
        </div>
      </div>
    `).join('');
  }

  renderNotes() {
    const container = document.getElementById('notesTimeline');
    container.innerHTML = this.patientData.notes.map(note => `
      <div class="timeline-item">
        <div class="timeline-date">${note.date}</div>
        <div class="timeline-title">${note.title}</div>
        <div class="timeline-content">${note.content}</div>
      </div>
    `).join('');
  }

  renderReports() {
    const container = document.getElementById('reportsGrid');
    container.innerHTML = this.patientData.labReports.map(report => `
      <div class="report-card" data-id="${report.id}">
        <div class="card-thumbnail">
          <i class="thumbnail-icon ${report.type === 'PDF' ? 'fas fa-file-pdf' : 'fas fa-image'}"></i>
        </div>
        <div class="card-title">${report.title}</div>
        <div class="card-date">${report.date}</div>
        <div class="report-result">Result: ${report.result}</div>
      </div>
    `).join('');
  }

  renderVisits() {
    const container = document.getElementById('visitsTimeline');
    container.innerHTML = this.patientData.visits.map(visit => `
      <div class="timeline-item">
        <div class="timeline-date">${visit.date}</div>
        <div class="timeline-title">${visit.type} - ${visit.doctor}</div>
        <div class="timeline-content">${visit.notes}</div>
      </div>
    `).join('');
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Action buttons
    document.getElementById('addPrescription').addEventListener('click', () => this.openModal('Add Prescription'));
    document.getElementById('recordDiagnosis').addEventListener('click', () => this.openModal('Record Diagnosis'));
    document.getElementById('setReminder').addEventListener('click', () => this.openModal('Set Reminder'));
    document.getElementById('flagCase').addEventListener('click', () => this.openModal('Flag Case'));

    // Modal controls
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('modalCancel').addEventListener('click', () => this.closeModal());
    document.getElementById('modalSave').addEventListener('click', () => this.saveModal());

    // QR Code click
    document.querySelector('.qr-placeholder').addEventListener('click', () => {
      alert('QR Code Scanner would open here');
    });

    // Prescription/Report card clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.prescription-card')) {
        const id = e.target.closest('.prescription-card').dataset.id;
        this.openPrescriptionDetail(id);
      }
      if (e.target.closest('.report-card')) {
        const id = e.target.closest('.report-card').dataset.id;
        this.openReportDetail(id);
      }
    });
  }

  switchTab(tabName) {
    // Add loading effect during tab switch
    const currentPanel = document.querySelector('.tab-panel.active');
    if (currentPanel) {
      currentPanel.style.opacity = '0.5';
      currentPanel.style.transform = 'translateY(10px)';
    }

    setTimeout(() => {
      // Update tab buttons with smooth transition
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 100);
      });
      
      const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
      activeBtn.classList.add('active');
      activeBtn.style.transform = 'scale(1.05)';
      setTimeout(() => activeBtn.style.transform = '', 200);

      // Update tab panels with smooth transition
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
        panel.style.opacity = '';
        panel.style.transform = '';
      });
      
      const newPanel = document.getElementById(`${tabName}-panel`);
      newPanel.classList.add('active');
      newPanel.style.opacity = '0';
      newPanel.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        newPanel.style.transition = 'all 0.3s ease';
        newPanel.style.opacity = '1';
        newPanel.style.transform = 'translateY(0)';
      }, 50);

      this.currentTab = tabName;
      this.showNotification(`Switched to ${tabName} view`, 'info');
    }, 150);
  }

  openModal(title) {
    document.getElementById('modalTitle').textContent = title;
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = modalOverlay.querySelector('.modal');
    
    // Set modal content
    const content = this.getModalContent(title);
    document.getElementById('modalContent').innerHTML = content;
    
    // Show modal with enhanced animation
    modalOverlay.classList.add('active');
    modal.style.transform = 'scale(0.7)';
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      modal.style.transform = 'scale(1)';
      modal.style.opacity = '1';
    }, 50);
    
    // Focus first input for accessibility
    setTimeout(() => {
      const firstInput = modal.querySelector('input, textarea, select');
      if (firstInput) {
        firstInput.focus();
      }
    }, 350);
  }

  getModalContent(title) {
    switch (title) {
      case 'Add Prescription':
        return `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <label>
              <strong>Medicine Name:</strong>
              <input type="text" id="medicineName" placeholder="Enter medicine name" style="width: 100%; padding: 8px; margin-top: 4px;">
            </label>
            <label>
              <strong>Dosage:</strong>
              <input type="text" id="dosage" placeholder="e.g., 500mg" style="width: 100%; padding: 8px; margin-top: 4px;">
            </label>
            <label>
              <strong>Duration:</strong>
              <input type="text" id="duration" placeholder="e.g., 7 days" style="width: 100%; padding: 8px; margin-top: 4px;">
            </label>
            <label>
              <strong>Instructions:</strong>
              <textarea id="instructions" placeholder="Special instructions..." style="width: 100%; padding: 8px; margin-top: 4px; height: 80px;"></textarea>
            </label>
          </div>
        `;
      case 'Record Diagnosis':
        return `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <label>
              <strong>Diagnosis:</strong>
              <input type="text" id="diagnosis" placeholder="Enter diagnosis" style="width: 100%; padding: 8px; margin-top: 4px;">
            </label>
            <label>
              <strong>Notes:</strong>
              <textarea id="diagnosisNotes" placeholder="Detailed notes..." style="width: 100%; padding: 8px; margin-top: 4px; height: 120px;"></textarea>
            </label>
          </div>
        `;
      case 'Set Reminder':
        return `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <label>
              <strong>Reminder Type:</strong>
              <select id="reminderType" style="width: 100%; padding: 8px; margin-top: 4px;">
                <option value="medication">Medication</option>
                <option value="checkup">Follow-up Checkup</option>
                <option value="test">Lab Test</option>
              </select>
            </label>
            <label>
              <strong>Date & Time:</strong>
              <input type="datetime-local" id="reminderDateTime" style="width: 100%; padding: 8px; margin-top: 4px;">
            </label>
            <label>
              <strong>Notes:</strong>
              <textarea id="reminderNotes" placeholder="Additional notes..." style="width: 100%; padding: 8px; margin-top: 4px; height: 80px;"></textarea>
            </label>
          </div>
        `;
      case 'Flag Case':
        return `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <label>
              <strong>Flag Reason:</strong>
              <select id="flagReason" style="width: 100%; padding: 8px; margin-top: 4px;">
                <option value="critical">Critical Condition</option>
                <option value="infectious">Infectious Disease</option>
                <option value="emergency">Emergency Case</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              <strong>Authority to Notify:</strong>
              <select id="authority" style="width: 100%; padding: 8px; margin-top: 4px;">
                <option value="health-dept">Health Department</option>
                <option value="labor-dept">Labor Department</option>
                <option value="emergency">Emergency Services</option>
              </select>
            </label>
            <label>
              <strong>Details:</strong>
              <textarea id="flagDetails" placeholder="Provide detailed information..." style="width: 100%; padding: 8px; margin-top: 4px; height: 120px;"></textarea>
            </label>
          </div>
        `;
      default:
        return '<p>Modal content</p>';
    }
  }

  closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = modalOverlay.querySelector('.modal');
    
    // Enhanced close animation
    modal.style.transition = 'all 0.2s ease';
    modal.style.transform = 'scale(0.9)';
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modalOverlay.classList.remove('active');
      modal.style.transform = '';
      modal.style.opacity = '';
      modal.style.transition = '';
    }, 200);
  }

  saveModal() {
    const title = document.getElementById('modalTitle').textContent;
    const saveBtn = document.getElementById('modalSave');
    
    // Show loading state
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      let success = false;
      let message = '';
      
      // Enhanced validation and saving based on modal type
      switch (title) {
        case 'Add Prescription':
          const medicine = document.getElementById('medicineName')?.value.trim();
          const dosage = document.getElementById('dosage')?.value.trim();
          if (medicine && dosage) {
            success = true;
            message = `✅ Prescription added: ${medicine} ${dosage}`;
            // Add to patient data (simulate)
            this.patientData.prescriptions.unshift({
              id: Date.now(),
              title: `Prescription #${String(Date.now()).slice(-3)}`,
              date: new Date().toLocaleDateString('en-IN'),
              type: 'PDF',
              medicines: [medicine + ' ' + dosage]
            });
            this.renderPrescriptions();
          } else {
            message = '⚠️ Please fill in medicine name and dosage';
          }
          break;
          
        case 'Record Diagnosis':
          const diagnosis = document.getElementById('diagnosis')?.value.trim();
          if (diagnosis) {
            success = true;
            message = `✅ Diagnosis recorded: ${diagnosis}`;
          } else {
            message = '⚠️ Please enter a diagnosis';
          }
          break;
          
        case 'Set Reminder':
          const reminderType = document.getElementById('reminderType')?.value;
          const dateTime = document.getElementById('reminderDateTime')?.value;
          if (dateTime) {
            success = true;
            message = `⏰ Reminder set for ${reminderType}`;
          } else {
            message = '⚠️ Please select a date and time';
          }
          break;
          
        case 'Flag Case':
          const flagReason = document.getElementById('flagReason')?.value;
          const authority = document.getElementById('authority')?.value;
          success = true;
          message = `🚨 Case flagged to ${authority} for ${flagReason}`;
          break;
          
        default:
          success = true;
          message = '✅ Action completed successfully';
      }
      
      // Reset button
      saveBtn.innerHTML = 'Save';
      saveBtn.disabled = false;
      
      // Show result
      this.showNotification(message, success ? 'success' : 'warning');
      
      if (success) {
        this.closeModal();
      }
    }, 1000);
  }

  openPrescriptionDetail(id) {
    const prescription = this.patientData.prescriptions.find(p => p.id == id);
    if (prescription) {
      alert(`Opening prescription: ${prescription.title}\nDate: ${prescription.date}\nMedicines: ${prescription.medicines.join(', ')}`);
    }
  }

  openReportDetail(id) {
    const report = this.patientData.labReports.find(r => r.id == id);
    if (report) {
      alert(`Opening report: ${report.title}\nDate: ${report.date}\nResult: ${report.result}`);
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create enhanced notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <i class="fas ${this.getNotificationIcon(type)}" style="font-size: 18px;"></i>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; font-size: 16px; cursor: pointer; opacity: 0.7; padding: 4px;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);

    // Enhanced auto-dismiss with smooth animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 4000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      warning: 'fa-exclamation-triangle',
      error: 'fa-times-circle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Start with authentication - dashboard will be initialized after successful auth
  window.authManager = new AuthenticationManager();
  
  // Initialize new enhanced systems
  window.fab = new FloatingActionButton();
  window.quickSearch = new QuickSearch();
  window.notificationSystem = new NotificationSystem();
  window.healthAnalytics = new HealthAnalytics();
  
  // Add notification bell to header
  const headerActions = document.querySelector('.header-actions');
  if (headerActions) {
    const notificationBell = document.createElement('button');
    notificationBell.className = 'notification-bell';
    notificationBell.innerHTML = '<i class="fas fa-bell"></i><span class="notification-badge">3</span>';
    notificationBell.title = 'Notifications';
    notificationBell.style.cssText = `
      width: 40px; height: 40px; background: rgba(255,255,255,0.15); 
      border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; 
      color: white; cursor: pointer; display: flex; align-items: center; 
      justify-content: center; transition: all 0.3s; position: relative;
      backdrop-filter: blur(20px);
    `;
    
    // Notification badge styling
    const badge = notificationBell.querySelector('.notification-badge');
    badge.style.cssText = `
      position: absolute; top: -5px; right: -5px; background: #ef4444; 
      color: white; border-radius: 50%; width: 20px; height: 20px; 
      font-size: 11px; font-weight: bold; display: flex; 
      align-items: center; justify-content: center; border: 2px solid white;
    `;
    
    notificationBell.addEventListener('click', () => {
      notificationSystem.showSystem();
    });
    
    notificationBell.addEventListener('mouseenter', () => {
      notificationBell.style.background = 'rgba(255,255,255,0.25)';
      notificationBell.style.transform = 'scale(1.05)';
    });
    
    notificationBell.addEventListener('mouseleave', () => {
      notificationBell.style.background = 'rgba(255,255,255,0.15)';
      notificationBell.style.transform = 'scale(1)';
    });
    
    headerActions.insertBefore(notificationBell, headerActions.lastElementChild);
  }
});

// Add smooth scrolling for better UX
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'p':
        e.preventDefault();
        document.getElementById('addPrescription').click();
        break;
      case 'd':
        e.preventDefault();
        document.getElementById('recordDiagnosis').click();
        break;
      case 'r':
        e.preventDefault();
        document.getElementById('setReminder').click();
        break;
    }
  }
  
  // ESC to close modal
  if (e.key === 'Escape') {
    const modal = document.getElementById('modalOverlay');
    if (modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  }
});
