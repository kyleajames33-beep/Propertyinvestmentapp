// ============================================
// APP INITIALIZATION & NAVIGATION
// ============================================
(function initApp() {
  const stageConfig = {
    1: { buttonId: 'navStage1', sectionId: 'stage1Section' },
    2: {
      buttonId: 'navStage2',
      sectionId: 'stage2Section',
      onShow: () => {
        if (typeof loadStage2Data === 'function') {
          loadStage2Data();
        }
        if (typeof renderSuburbs === 'function') {
          renderSuburbs();
        }
      }
    },
    3: {
      buttonId: 'navStage3',
      sectionId: 'stage3Section',
      onShow: () => {
        if (typeof loadStage3Data === 'function') {
          loadStage3Data();
        }
      }
    },
    4: {
      buttonId: 'navStage4',
      sectionId: 'stage4Section',
      onShow: () => {
        if (typeof loadStage4Data === 'function') {
          loadStage4Data();
        }
      }
    },
    5: {
      buttonId: 'navStage5',
      sectionId: 'stage5Section',
      onShow: () => {
        if (typeof loadStage5Data === 'function') {
          loadStage5Data();
        }
      }
    },
    6: {
      buttonId: 'navStage6',
      sectionId: 'stage6Section',
      onShow: () => {
        if (typeof loadStage6Data === 'function') {
          loadStage6Data();
        }
      }
    }
  };

  function hideAllStages() {
    Object.values(stageConfig).forEach(cfg => {
      const section = document.getElementById(cfg.sectionId);
      if (section) {
        section.style.display = 'none';
      }
      const button = document.getElementById(cfg.buttonId);
      if (button) {
        button.classList.remove('active');
      }
    });
  }

  function switchToStage(stageNumber = 1) {
    const config = stageConfig[stageNumber] || stageConfig[1];
    if (!config) {
      return;
    }

    hideAllStages();

    const section = document.getElementById(config.sectionId);
    if (section) {
      section.style.display = 'block';
    }

    const button = document.getElementById(config.buttonId);
    if (button) {
      button.classList.add('active');
    }

    if (typeof config.onShow === 'function') {
      config.onShow();
    }
  }

  window.switchToStage = switchToStage;

  document.addEventListener('DOMContentLoaded', () => {
    Object.entries(stageConfig).forEach(([stageNumber, cfg]) => {
      const button = document.getElementById(cfg.buttonId);
      if (button) {
        button.addEventListener('click', () => switchToStage(Number(stageNumber)));
      }
    });

    switchToStage(1);
  });

  // ============================================
  // PWA - SERVICE WORKER REGISTRATION
  // ============================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
          console.log('[PWA] Service Worker registered:', registration.scope);
          setInterval(() => registration.update(), 60000);
        })
        .catch(error => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    });
  }

  // ============================================
  // PWA - INSTALL PROMPT
  // ============================================
  let deferredPrompt;
  let installPromptShown = localStorage.getItem('pwa-install-prompt-shown');

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    if (!installPromptShown) {
      showInstallPrompt();
    }
  });

  function showInstallPrompt() {
    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
      color: white;
      padding: 1rem;
      box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      animation: slideUp 0.3s ease-out;
    `;

    installBanner.innerHTML = `
      <div style="flex: 1;">
        <strong style="display: block; margin-bottom: 0.25rem;">Install Property Investor App</strong>
        <span style="font-size: 0.875rem; opacity: 0.9;">Add to your home screen for quick access</span>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button id="pwa-install-btn" style="
          background: white;
          color: var(--primary-blue);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
        ">Install</button>
        <button id="pwa-dismiss-btn" style="
          background: transparent;
          color: white;
          border: 2px solid white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
        ">Not Now</button>
      </div>
    `;

    document.body.appendChild(installBanner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      if (!deferredPrompt) {
        return;
      }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User response to install prompt:', outcome);
      deferredPrompt = null;
      installBanner.remove();
      localStorage.setItem('pwa-install-prompt-shown', 'true');
      installPromptShown = 'true';
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      installBanner.remove();
      localStorage.setItem('pwa-install-prompt-shown', 'true');
      installPromptShown = 'true';
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed');
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  });
})();
