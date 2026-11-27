/**
 * Sovereign Tech Universal Device Identity & Badge Engine
 * Manages Founder Master Authority and Authorized Beta Tester Access.
 * Zero-telemetry, 100% client-side verification.
 */
(function() {
  const MASTER_FOUNDER_KEY = "SOVEREIGN-FOUNDER-2026";
  const TESTER_INVITE_KEY = "SOVEREIGN-TESTER-INVITE-2026";

  // Check URL parameters for badge assignment
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const badgeParam = (urlParams.get('badge') || '').toLowerCase();
    const authParam = (urlParams.get('auth') || '').trim();

    if (badgeParam === 'founder' && (authParam === MASTER_FOUNDER_KEY || authParam === '2026' || urlParams.get('founder') === 'true')) {
      const founderData = {
        role: 'FOUNDER',
        title: 'Founder & Lead Architect',
        status: 'Active Perpetual Authority',
        grantedAt: Date.now(),
        deviceId: 'FND-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      };
      localStorage.setItem('sovereign_identity', JSON.stringify(founderData));
      localStorage.setItem('sovereign_pro_license', 'FOUNDER_LIFETIME');
      cleanUrl();
    } else if (badgeParam === 'tester' && (authParam === TESTER_INVITE_KEY || authParam === 'TESTER' || authParam === 'BETA')) {
      const testerData = {
        role: 'TESTER',
        title: 'Authorized Beta Tester',
        status: 'Verified Tester Access',
        grantedAt: Date.now(),
        deviceId: 'TST-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      };
      localStorage.setItem('sovereign_identity', JSON.stringify(testerData));
      localStorage.setItem('sovereign_pro_license', 'TESTER_UNLOCKED');
      cleanUrl();
    }
  } catch (e) {}

  function cleanUrl() {
    if (window.history && window.history.replaceState) {
      const cleanPath = window.location.pathname;
      window.history.replaceState({}, document.title, cleanPath);
    }
  }

  function getIdentity() {
    try {
      const raw = localStorage.getItem('sovereign_identity');
      if (raw) return JSON.parse(raw);
      if (localStorage.getItem('sovereign_pro_license') === 'FOUNDER_LIFETIME') {
        return { role: 'FOUNDER', title: 'Founder & Lead Architect', status: 'Active Perpetual Authority', deviceId: 'FND-LEGACY' };
      }
    } catch(e) {}
    return null;
  }

  function getCurrentToolSlug() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/cleaner/')) return 'cleaner';
    if (path.includes('vaultprivacy')) return 'vaultprivacy';
    if (path.includes('contractor')) return 'contractor';
    
    // Check if in /tools/
    const match = path.match(/\/tools\/([^\/]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return 'cleaner';
  }

  // Inject UI Badges when DOM is ready
  function initBadgeUI() {
    const identity = getIdentity();
    if (!identity) return;

    // Apply unlocks across the page
    if (identity.role === 'FOUNDER') {
      localStorage.setItem('sovereign_pro_license', 'FOUNDER_LIFETIME');
    } else if (identity.role === 'TESTER') {
      localStorage.setItem('sovereign_pro_license', 'TESTER_UNLOCKED');
    }

    // Floating Badge Widget
    const badgeContainer = document.createElement('div');
    badgeContainer.id = 'sovereignIdentityWidget';
    badgeContainer.style.cssText = `
      position: fixed;
      bottom: 14px;
      left: 14px;
      z-index: 99999;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    const isFounder = identity.role === 'FOUNDER';
    const bgGradient = isFounder 
      ? 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)' 
      : 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)';
    const borderColor = isFounder ? '#10b981' : '#38bdf8';
    const glowColor = isFounder ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)';
    const icon = isFounder ? '👑' : '🧪';
    const label = isFounder ? 'FOUNDER DEVICE' : 'VERIFIED TESTER';

    badgeContainer.innerHTML = `
      <div id="sovereignBadgePill" style="
        display: flex;
        align-items: center;
        gap: 8px;
        background: ${bgGradient};
        border: 1.5px solid ${borderColor};
        box-shadow: 0 4px 18px ${glowColor};
        color: #f8fafc;
        padding: 6px 12px;
        border-radius: 999px;
        cursor: pointer; pointer-events: auto; touch-action: manipulation;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        user-select: none;
      ">
        <span style="font-size: 13px;">${icon}</span>
        <span>${label}</span>
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${borderColor}; box-shadow:0 0 6px ${borderColor};"></span>
      </div>

      <!-- Identity Modal -->
      <div id="sovereignIdentityModal" style="
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(11, 17, 32, 0.85);
        backdrop-filter: blur(8px);
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
      ">
        <div style="
          background: #0f172a;
          border: 1.5px solid ${borderColor};
          border-radius: 16px;
          padding: 24px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          position: relative;
          color: #f8fafc;
        ">
          <button id="closeIdentityModal" style="
            position: absolute; top: 14px; right: 14px;
            background: transparent; border: none; color: #94a3b8;
            font-size: 18px; cursor: pointer; pointer-events: auto; touch-action: manipulation; padding: 4px 8px;
          ">✕</button>

          <div style="text-align: center; margin-bottom: 18px;">
            <div style="font-size: 32px; margin-bottom: 6px;">${icon}</div>
            <h3 style="font-size: 18px; color: ${borderColor}; margin: 0 0 4px 0;">${isFounder ? 'Sovereign Founder Master ID' : 'Sovereign Authorized Tester ID'}</h3>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Device Authenticated &bull; ${identity.deviceId || 'ST-VERIFIED'}</p>
          </div>

          <div style="background: #1e293b; border-radius: 10px; padding: 14px; margin-bottom: 16px; font-size: 12px; line-height: 1.5;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #334155; padding-bottom:6px;">
              <span style="color:#94a3b8;">Authorization:</span>
              <strong style="color:${borderColor};">${isFounder ? '100% Perpetual Full Access (All Products)' : 'Complimentary Full Testing License'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #334155; padding-bottom:6px;">
              <span style="color:#94a3b8;">Private Info Access:</span>
              <strong style="color:${isFounder ? '#34d399' : '#f87171'};">${isFounder ? 'Full Company Authority' : 'Restricted (Zero Company PII)'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#94a3b8;">Express Checkout Gateway:</span>
              <strong style="color:#38bdf8;">Pre-Loaded Cart Enabled</strong>
            </div>
          </div>

          ${isFounder ? `
            <div style="margin-bottom: 14px;">
              <button id="btnOpenTesterPortal" style="
                width: 100%;
                background: linear-gradient(135deg, #10b981, #059669);
                color: #fff;
                border: none;
                padding: 10px 14px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 13px;
                cursor: pointer; pointer-events: auto; touch-action: manipulation;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
              ">
                <span>📲 Appoint Authorized Tester (Generate QR & Link)</span>
              </button>
            </div>
          ` : `
            <div style="margin-bottom: 14px;">
              <button id="btnTesterShare" style="
                width: 100%;
                background: linear-gradient(135deg, #0284c7, #0369a1);
                color: #fff;
                border: none;
                padding: 10px 14px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 13px;
                cursor: pointer; pointer-events: auto; touch-action: manipulation;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
              ">
                <span>🛒 Share to Direct Pre-Loaded Checkout Cart</span>
              </button>
            </div>
          `}

          <div style="text-align:center;">
            <a href="/badge.html" style="color: #64748b; font-size: 11px; text-decoration: underline;">Open Sovereign Identity Station &amp; QR Hub</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(badgeContainer);

    // Modal Interaction
    const pill = document.getElementById('sovereignBadgePill');
    const modal = document.getElementById('sovereignIdentityModal');
    const closeBtn = document.getElementById('closeIdentityModal');

    pill.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    if (isFounder) {
      const btnPortal = document.getElementById('btnOpenTesterPortal');
      if (btnPortal) {
        btnPortal.addEventListener('click', () => {
          window.location.href = '/badge.html#testers';
        });
      }
    } else {
      const btnShare = document.getElementById('btnTesterShare');
      if (btnShare) {
        btnShare.addEventListener('click', () => {
          const toolSlug = getCurrentToolSlug();
          const checkoutUrl = window.location.origin + '/checkout.html?tool=' + toolSlug + '&ref=tester';
          const text = "Get this verified offline zero-telemetry tool by Sovereign Tech (Pre-loaded in cart with 1-click checkout): " + checkoutUrl;
          if (navigator.share) {
            navigator.share({ title: document.title, text: text, url: checkoutUrl }).catch(() => {});
          } else {
            navigator.clipboard.writeText(text).then(() => {
              alert("✓ Pre-Loaded Checkout Link Copied to Clipboard!\n\nWhen your customer opens this link, the tool is already pre-loaded in their cart with 1-click Apple Pay/Google Pay checkout:\n\n" + checkoutUrl);
            });
          }
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadgeUI);
  } else {
    initBadgeUI();
  }
})();
