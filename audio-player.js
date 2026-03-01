// Persistent Background Audio Player
(function() {
  const AUDIO_URL = 'public/audio.mp3';
  const STORAGE_KEY = 'bgAudioState';
  const TIME_KEY = 'bgAudioTime';
  
  let audio = null;
  let isInitialized = false;
  let musicButton = null;

  function updateButtonState(isPlaying) {
    if (!musicButton) {
      musicButton = document.getElementById('music-control');
    }
    
    if (musicButton) {
      if (isPlaying) {
        musicButton.classList.add('playing');
        musicButton.classList.remove('paused');
        musicButton.querySelector('.music-icon').textContent = '🎵';
      } else {
        musicButton.classList.remove('playing');
        musicButton.classList.add('paused');
        musicButton.querySelector('.music-icon').textContent = '⏸️';
      }
    }
  }

  function tryAutoPlay() {
    if (!audio) return;
    
    // Force play attempt
    audio.play().then(() => {
      console.log('Audio started successfully');
      sessionStorage.setItem(STORAGE_KEY, 'playing');
      updateButtonState(true);
    }).catch(error => {
      console.log('Browser blocked autoplay, will start on user interaction');
      updateButtonState(false);
      
      // Listen for ANY user interaction to start audio
      const interactions = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
      
      const startAudio = function() {
        if (audio && audio.paused) {
          audio.play().then(() => {
            console.log('Audio started after user interaction');
            sessionStorage.setItem(STORAGE_KEY, 'playing');
            updateButtonState(true);
            // Remove all listeners after successful play
            interactions.forEach(event => {
              document.removeEventListener(event, startAudio);
            });
          }).catch(err => {
            console.error('Failed to play:', err);
          });
        }
      };
      
      // Add listeners for all interaction types
      interactions.forEach(event => {
        document.addEventListener(event, startAudio, { once: true });
      });
    });
  }

  function initAudio() {
    if (isInitialized) return;
    
    // Create audio element
    audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.5;
    
    // Restore previous playback time
    const savedTime = sessionStorage.getItem(TIME_KEY);
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }
    
    // Save time periodically
    audio.addEventListener('timeupdate', function() {
      sessionStorage.setItem(TIME_KEY, audio.currentTime.toString());
    });
    
    // Update button on play/pause
    audio.addEventListener('play', function() {
      updateButtonState(true);
      sessionStorage.setItem(STORAGE_KEY, 'playing');
    });
    
    audio.addEventListener('pause', function() {
      updateButtonState(false);
      sessionStorage.setItem(STORAGE_KEY, 'paused');
    });
    
    // Setup music control button
    musicButton = document.getElementById('music-control');
    if (musicButton) {
      musicButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      });
    }
    
    // Save state before page unload
    window.addEventListener('beforeunload', function() {
      if (audio) {
        sessionStorage.setItem(TIME_KEY, audio.currentTime.toString());
        if (!audio.paused) {
          sessionStorage.setItem(STORAGE_KEY, 'playing');
        }
      }
    });
    
    // Check if user previously paused
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    
    // Only skip autoplay if user explicitly paused
    if (savedState === 'paused') {
      updateButtonState(false);
    } else {
      // Always try to autoplay on fresh load or if it was playing
      tryAutoPlay();
    }
    
    isInitialized = true;
  }
  
  // Initialize immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudio);
  } else {
    initAudio();
  }
  
  // Expose control functions
  window.bgAudio = {
    play: function() {
      if (audio) audio.play();
    },
    pause: function() {
      if (audio) audio.pause();
    },
    setVolume: function(vol) {
      if (audio) audio.volume = Math.max(0, Math.min(1, vol));
    }
  };
})();
