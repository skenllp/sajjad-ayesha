// ===== MAIN JS =====
(function() {
  'use strict';

  var CFG = window.WEDDING_CONFIG || {};

  // ===== BACKGROUND MUSIC =====
  function initMusic() {
    var audio     = document.getElementById('bg-music');
    var muteBtn   = document.getElementById('mute-btn');
    var iconSound = document.getElementById('icon-sound');
    var iconMuted = document.getElementById('icon-muted');
    if (!audio || !muteBtn) return;

    var musicCfg = CFG.music || {};
    audio.volume = musicCfg.volume != null ? musicCfg.volume : 0.45;
    var started = false;

    function setMutedState(muted) {
      if (muted) {
        audio.pause();
        iconSound.style.display = 'none';
        iconMuted.style.display = '';
        muteBtn.classList.add('muted');
        muteBtn.setAttribute('aria-label', 'Unmute music');
      } else {
        audio.play().catch(function(){});
        iconSound.style.display = '';
        iconMuted.style.display = 'none';
        muteBtn.classList.remove('muted');
        muteBtn.setAttribute('aria-label', 'Mute music');
      }
    }

    // Try immediate autoplay
    window.addEventListener('load', function() {
      audio.play()
        .then(function() { started = true; })
        .catch(function(){});
    });

    function startOnInteraction() {
      if (!started) {
        audio.play().catch(function(){});
        started = true;
      }
    }

    document.addEventListener('click',      startOnInteraction, { once: true });
    document.addEventListener('scroll',     startOnInteraction, { once: true });
    document.addEventListener('touchstart', startOnInteraction, { once: true });

    muteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      startOnInteraction();
      setMutedState(!audio.paused);
    });
  }

  // ===== OPENING GATE (click-to-enter) =====
  function initGate() {
    var gate     = document.getElementById('gate');
    var enterBtn = document.getElementById('gate-enter');
    if (!gate || !enterBtn) return;

    var opened = false;

    // Prevent scroll and touch events while gate is active
    function preventScroll(e) {
      if (!opened && document.body.classList.contains('gate-active')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Add scroll prevention listeners
    document.addEventListener('scroll', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });

    function openGate() {
      if (opened) return;
      opened = true;

      gate.classList.add('gate-closing');
      document.body.classList.remove('gate-active');
      document.body.classList.add('page-loaded');
      
      // Restore scroll on body
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';

      // Remove scroll prevention listeners
      document.removeEventListener('scroll', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);

      window.setTimeout(function() {
        gate.classList.add('gate-hidden');
        gate.setAttribute('aria-hidden', 'true');
      }, 1100);
    }

    enterBtn.addEventListener('click', openGate);
    enterBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGate();
      }
    });
  }

  // ===== MOBILE NAV TOGGLE =====
  function initMobileNav() {
    var burger   = document.querySelector('.nav-burger');
    var navLinks = document.querySelector('.nav-links');
    if (!burger || !navLinks) return;

    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  // ===== INTERSECTION OBSERVER FOR SECTION TRACKING =====
  function initSectionTracking() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;

    var sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function(s) { sectionObserver.observe(s); });
  }

  // ===== LIGHTBOX (gallery) =====
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lbImg    = document.getElementById('lightbox-img');
    var lbClose  = document.getElementById('lightbox-close');
    if (!lightbox || !lbImg) return;

    document.querySelectorAll('.gallery-item img').forEach(function(img) {
      img.addEventListener('click', function() {
        lbImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ===== WISHES WALL WITH FIREBASE =====
  function initWishesWall() {
    var form = document.getElementById('wishesForm');
    var wishesDisplay = document.getElementById('wishesDisplay');
    var wishesList = document.getElementById('wishesList');
    var wishesCount = document.getElementById('wishesCount');
    var viewMoreContainer = document.getElementById('viewMoreContainer');
    var viewMoreBtn = document.getElementById('viewMoreBtn');

    if (!form || !wishesDisplay || !wishesList) return;

    var displayLimit = 5;
    var allWishes = [];
    var showingAll = false;
    var database = null;

    // Check if Firebase is available
    try {
      database = firebase.database();
    } catch (e) {
      console.warn('Firebase not configured. Using localStorage fallback.');
    }

    // Format date
    function formatDate(timestamp) {
      var date = new Date(timestamp);
      var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      var day = date.getDate();
      var month = months[date.getMonth()];
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return day + ' ' + month + ' AT ' + hours + ':' + minutes + ' ' + ampm;
    }

    // Get avatar color based on name
    function getAvatarColor(name) {
      var colors = [
        'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
        'linear-gradient(135deg, #C8385C 0%, #7A1230 100%)',
        'linear-gradient(135deg, #D4A017 0%, #8F6608 100%)',
        'linear-gradient(135deg, #3D6B99 0%, #1F4468 100%)',
        'linear-gradient(135deg, #9C2F52 0%, #C9527A 100%)'
      ];
      var index = name.charCodeAt(0) % colors.length;
      return colors[index];
    }

    // Create wish HTML
    function createWishHTML(wish) {
      var initial = wish.name.charAt(0).toUpperCase();
      var avatarColor = getAvatarColor(wish.name);
      
      var div = document.createElement('div');
      div.className = 'wish-item';
      div.setAttribute('data-aos', 'fade-up');
      
      div.innerHTML = 
        '<div class="wish-avatar" style="background: ' + avatarColor + ';">' +
          '<span>' + initial + '</span>' +
        '</div>' +
        '<div class="wish-content">' +
          '<div class="wish-author">' + escapeHtml(wish.name) + '</div>' +
          '<div class="wish-message">' + escapeHtml(wish.message) + '</div>' +
          '<div class="wish-time">' + formatDate(wish.timestamp) + '</div>' +
        '</div>';
      
      return div;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Display wishes
    function displayWishes() {
      wishesList.innerHTML = '';
      
      if (allWishes.length === 0) {
        wishesDisplay.style.display = 'none';
        return;
      }

      wishesDisplay.style.display = 'block';
      wishesCount.textContent = allWishes.length;

      var displayCount = showingAll ? allWishes.length : Math.min(displayLimit, allWishes.length);
      var wishesToShow = allWishes.slice(0, displayCount);

      wishesToShow.forEach(function(wish) {
        var el = createWishHTML(wish);
        wishesList.appendChild(el);
        // Hook into the fade-up scroll animation, or reveal immediately
        // as a fallback if the animation script hasn't loaded yet.
        if (typeof window.observeAOS === 'function') {
          window.observeAOS(el);
        } else {
          el.classList.add('aos-animate');
        }
      });

      // Show/hide "View More" button
      if (allWishes.length > displayLimit && !showingAll) {
        viewMoreContainer.style.display = 'block';
      } else {
        viewMoreContainer.style.display = 'none';
      }
    }

    // Load wishes from Firebase
    function loadWishesFromFirebase() {
      if (!database) return;

      var wishesRef = database.ref('wishes');
      
      wishesRef.on('value', function(snapshot) {
        allWishes = [];
        var data = snapshot.val();
        
        if (data) {
          Object.keys(data).forEach(function(key) {
            allWishes.push(data[key]);
          });
          
          // Sort by timestamp (newest first)
          allWishes.sort(function(a, b) {
            return b.timestamp - a.timestamp;
          });
        }
        
        displayWishes();
      });
    }

    // Save wish to Firebase
    function saveWishToFirebase(wish, callback) {
      if (!database) {
        callback(false);
        return;
      }

      var wishesRef = database.ref('wishes');
      var newWishRef = wishesRef.push();
      
      newWishRef.set(wish, function(error) {
        if (error) {
          console.error('Error saving wish:', error);
          callback(false);
        } else {
          callback(true);
        }
      });
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var nameInput = document.getElementById('wishesName');
      var messageInput = document.getElementById('wishesMessage');

      var name = nameInput.value.trim();
      var message = messageInput.value.trim();

      if (!name || !message) {
        alert('Please fill in both your name and message.');
        return;
      }

      if (message.length > 500) {
        alert('Message is too long. Please keep it under 500 characters.');
        return;
      }

      var wish = {
        name: name,
        message: message,
        timestamp: Date.now()
      };

      var btn = form.querySelector('.wishes-submit-btn');
      var originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
      btn.disabled = true;

      saveWishToFirebase(wish, function(success) {
        if (success) {
          // Clear form
          nameInput.value = '';
          messageInput.value = '';

          // Show success message
          btn.innerHTML = '<i class="fas fa-check"></i> WISH SENT!';

          setTimeout(function() {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 2000);

          // Scroll to wishes display
          setTimeout(function() {
            wishesDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
        } else {
          alert('Unable to save your wish. Please check your internet connection and try again.');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      });
    });

    // View More button
    if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', function() {
        showingAll = true;
        displayWishes();
      });
    }

    // Initialize
    if (database) {
      loadWishesFromFirebase();
    } else {
      wishesDisplay.style.display = 'none';
    }
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    initMusic();
    initGate();
    initMobileNav();
    initSectionTracking();
    initLightbox();
    initWishesWall();
  });
})();