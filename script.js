// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Generate time options for custom timer
    generateTimeOptions();
    
    // Timer functionality
    let timerInterval;
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let isPaused = false;
    
    // Timer option clicks
    const timerOptions = document.querySelectorAll('.timer-option:not(#customTimer)');
    timerOptions.forEach(option => {
        option.addEventListener('click', function() {
            const time = parseInt(this.getAttribute('data-time'));
            const unit = this.getAttribute('data-unit');
            
            if (unit === 'minutes') {
                totalSeconds = time * 60;
            } else if (unit === 'hours') {
                totalSeconds = time * 60 * 60;
            } else if (unit === 'seconds') {
                totalSeconds = time;
            }
            
            remainingSeconds = totalSeconds;
            startTimer();
        });
    });
    
    // Custom timer form toggle
    const customTimer = document.getElementById('customTimer');
    const customTimerForm = document.getElementById('customTimerForm');
    
    customTimer.addEventListener('click', function() {
        if (customTimerForm.style.display === 'none') {
            customTimerForm.style.display = 'block';
        } else {
            customTimerForm.style.display = 'none';
        }
    });
    
    // Start custom timer
    const startCustomTimer = document.getElementById('startCustomTimer');
    startCustomTimer.addEventListener('click', function() {
        const hours = parseInt(document.getElementById('hours').value);
        const minutes = parseInt(document.getElementById('minutes').value);
        const seconds = parseInt(document.getElementById('seconds').value);
        
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSeconds <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'সময় নির্বাচন করুন',
                text: 'অনুগ্রহ করে কমপক্ষে ১ সেকেন্ড সময় নির্বাচন করুন',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#4CAF50'
            });
            return;
        }
        
        remainingSeconds = totalSeconds;
        startTimer();
    });
    
    // Timer controls
    const pauseTimer = document.getElementById('pauseTimer');
    const resumeTimer = document.getElementById('resumeTimer');
    const resetTimer = document.getElementById('resetTimer');
    const exitTimer = document.getElementById('exitTimer');
    
    pauseTimer.addEventListener('click', function() {
        isPaused = true;
        clearInterval(timerInterval);
        pauseTimer.style.display = 'none';
        resumeTimer.style.display = 'inline-flex';
        document.getElementById('timerMessage').textContent = 'টাইমার বিরতি দেওয়া হয়েছে';
    });
    
    resumeTimer.addEventListener('click', function() {
        isPaused = false;
        pauseTimer.style.display = 'inline-flex';
        resumeTimer.style.display = 'none';
        document.getElementById('timerMessage').textContent = '';
        timerInterval = setInterval(updateTimer, 1000);
    });
    
    resetTimer.addEventListener('click', function() {
        clearInterval(timerInterval);
        remainingSeconds = totalSeconds;
        updateTimerDisplay();
        pauseTimer.style.display = 'inline-flex';
        resumeTimer.style.display = 'none';
        document.getElementById('timerMessage').textContent = 'টাইমার রিসেট করা হয়েছে';
        setTimeout(() => {
            document.getElementById('timerMessage').textContent = '';
        }, 2000);
    });
    
    exitTimer.addEventListener('click', function() {
        clearInterval(timerInterval);
        document.getElementById('fullscreenTimer').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Start timer function
    function startTimer() {
        document.getElementById('fullscreenTimer').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateTimerDisplay();
        
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        
        // Reset pause/resume buttons
        pauseTimer.style.display = 'inline-flex';
        resumeTimer.style.display = 'none';
        document.getElementById('timerMessage').textContent = '';
    }
    
    // Update timer function
    function updateTimer() {
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timerMessage').textContent = 'সময় শেষ!';
            
            // Play notification sound (if available)
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            
            // Show completion notification
            Swal.fire({
                icon: 'success',
                title: 'সময় শেষ!',
                text: 'আপনার টাইমার সম্পন্ন হয়েছে',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#4CAF50'
            });
            
            return;
        }
        
        remainingSeconds--;
        updateTimerDisplay();
    }
    
    // Update timer display function
    function updateTimerDisplay() {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        
        const displayTime = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timerTime').textContent = displayTime;
        
        // Update progress circle
        const circle = document.querySelector('.progress-ring__circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        const offset = circumference - (remainingSeconds / totalSeconds) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    // Generate time options for custom timer
    function generateTimeOptions() {
        const hoursSelect = document.getElementById('hours');
        const minutesSelect = document.getElementById('minutes');
        const secondsSelect = document.getElementById('seconds');
        
        // Generate hours options (0-23)
        for (let i = 0; i <= 23; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            hoursSelect.appendChild(option);
        }
        
        // Generate minutes options (0-59)
        for (let i = 0; i <= 59; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            minutesSelect.appendChild(option);
        }
        
        // Generate seconds options (0-59)
        for (let i = 0; i <= 59; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            secondsSelect.appendChild(option);
        }
        
        // Set default values
        hoursSelect.value = 0;
        minutesSelect.value = 5;
        secondsSelect.value = 0;
    }
    
    // Scroll progress bar
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        document.getElementById('progressBar').style.width = scrollPercent + '%';
        
        // Back to top button visibility
        const backToTop = document.getElementById('backToTop');
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    // Back to top functionality
    document.getElementById('backToTop').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Set current year in footer
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('#currentYear');
yearElements.forEach(el => {
    if (el) el.textContent = currentYear;
});