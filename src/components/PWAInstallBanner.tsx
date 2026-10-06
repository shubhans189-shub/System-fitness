import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Copy, ExternalLink, HelpCircle, Compass, QrCode, Sparkles, Github } from 'lucide-react';

interface PWAInstallBannerProps {
  forceOpenGuide?: boolean;
  onCloseGuide?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  forceOpenGuide,
  onCloseGuide,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios' | 'github' | 'qrcode' | 'troubleshoot'>('android');

  const isGuideOpen = forceOpenGuide || showGuide;

  const closeGuide = () => {
    setShowGuide(false);
    if (onCloseGuide) onCloseGuide();
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {});
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&color=00e5ff&bgcolor=050814`;

  return (
    <>
      {!isInstalled && !dismissed && (
        <div
          id="pwa-install-banner"
          className="w-full bg-gradient-to-r from-sky-950/90 via-blue-950/95 to-cyan-950/90 border-b border-cyan-500/30 px-3 sm:px-4 py-2 text-xs sm:text-sm text-cyan-100 flex items-center justify-between shadow-lg backdrop-blur-md z-40"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
            <img
              src="/pwa-192x192.png"
              alt="Solo Leveling App Icon"
              className="w-7 h-7 rounded-lg border border-cyan-400/60 shadow-[0_0_8px_rgba(0,229,255,0.4)] shrink-0 object-cover"
            />
            <div className="truncate text-xs">
              <span className="font-semibold text-white">
                Download Mobile App:
              </span>{' '}
              <span className="text-slate-300 hidden md:inline">
                Install Solo Leveling directly onto your mobile home screen with full offline access.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="install-pwa-button"
              onClick={handleInstallClick}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-[0_0_12px_rgba(0,229,255,0.4)] active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install on Phone</span>
            </button>
            <button
              onClick={() => setShowGuide(true)}
              className="p-1.5 text-cyan-300 hover:text-white transition"
              title="Installation Guide & QR"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="p-1 text-slate-400 hover:text-white transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Universal Installation Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#090d1e] text-slate-100 border border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header with App Icon */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cyan-500/30 bg-cyan-950/30 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="App Icon"
                  className="w-10 h-10 rounded-xl border border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)] object-cover"
                />
                <div>
                  <h3 className="flex items-center gap-1.5 text-white font-system text-base font-black tracking-wider">
                    <span>DOWNLOAD TO MOBILE PHONE</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Standalone Fullscreen App • Works 100% Offline
                  </span>
                </div>
              </div>
              <button
                onClick={closeGuide}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveGuideTab('android')}
                className={`flex-1 py-2 px-2 rounded-lg font-system text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeGuideTab === 'android'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android / Xiaomi</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('ios')}
                className={`flex-1 py-2 px-2 rounded-lg font-system text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeGuideTab === 'ios'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>iPhone (iOS)</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('github')}
                className={`flex-1 py-2 px-2 rounded-lg font-system text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeGuideTab === 'github'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Github className="w-3.5 h-3.5 text-cyan-400" />
                <span>GitHub Way</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('qrcode')}
                className={`flex-1 py-2 px-2 rounded-lg font-system text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeGuideTab === 'qrcode'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('troubleshoot')}
                className={`flex-1 py-2 px-2 rounded-lg font-system text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeGuideTab === 'troubleshoot'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              
              {/* Tab 1: Android & Xiaomi / MI / Samsung */}
              {activeGuideTab === 'android' && (
                <div className="space-y-4">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-500/30 space-y-3">
                    <h4 className="font-system font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                      <span>In Google Chrome on your Phone:</span>
                    </h4>
                    
                    <div className="space-y-2.5 text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          1
                        </span>
                        <span>
                          Open this app link in <strong>Google Chrome</strong> on your phone.
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          2
                        </span>
                        <span>Tap the <strong>three vertical dots (⋮)</strong> at the top-right corner of Chrome.</span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          3
                        </span>
                        <span>
                          Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>
                          The cool <strong>Sung Jin-woo Monarch Icon</strong> will appear on your phone home screen and open full-screen like a regular native app!
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                    <h4 className="font-system font-bold text-slate-200 text-sm">
                      For Xiaomi / Redmi / POCO Mi Browser:
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Tap the <strong>menu icon (☰)</strong> at the bottom right ➔ select <strong>"Add to desktop"</strong> or <strong>"Add bookmark" ➔ "Desktop"</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: iPhone / iPad */}
              {activeGuideTab === 'ios' && (
                <div className="space-y-4">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-500/30 space-y-3">
                    <h4 className="font-system font-bold text-cyan-300 text-sm">
                      Apple iOS Safari Instructions:
                    </h4>
                    
                    <p className="text-slate-300 text-xs">
                      Apple requires using the Safari browser:
                    </p>

                    <div className="space-y-2.5 text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          1
                        </span>
                        <span>Open this page inside <strong>Safari</strong> on your iPhone.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          2
                        </span>
                        <span>Tap the <strong>Share button</strong> (the square with an arrow pointing up at the bottom).</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          3
                        </span>
                        <span>Scroll down the sheet and tap <strong>"Add to Home Screen"</strong>.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: The GitHub Method (Export -> Vercel / Phone) */}
              {activeGuideTab === 'github' && (
                <div className="space-y-4">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-500/30 space-y-3">
                    <h4 className="font-system font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-cyan-400" />
                      <span>The GitHub ➔ Phone Deployment Method</span>
                    </h4>
                    
                    <p className="text-slate-300 text-xs">
                      Follow these 3 simple steps to export your app to GitHub and get your permanent personal link on your phone:
                    </p>

                    <div className="space-y-3 text-slate-300 text-xs">
                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="text-white block font-system">Step 1: Export to GitHub in AI Studio</strong>
                          <span>
                            At the top right of this Google AI Studio screen, click the <strong>"Export"</strong> or <strong>"GitHub"</strong> button. Authorize your GitHub account (<code>shubhans189</code>) and confirm. It creates your repo in seconds!
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="text-white block font-system">Step 2: Connect to Vercel (100% Free & 1-Click)</strong>
                          <span>
                            Go to <strong className="text-cyan-300">vercel.com</strong> (or log in with GitHub) ➔ Click <strong>"Add New" ➔ "Project"</strong> ➔ Select your exported repository ➔ Click <strong>"Deploy"</strong>. Within 60s, Vercel gives you a permanent link (e.g. <code>https://solo-leveling.vercel.app</code>) that never expires!
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          3
                        </span>
                        <div>
                          <strong className="text-white block font-system">Step 3: Open on Phone & Install App</strong>
                          <span>
                            Open your Vercel link in Chrome on your phone ➔ Tap 3 dots (⋮) ➔ Tap <strong>"Install app"</strong> / <strong>"Add to Home screen"</strong>. The app installs directly with the custom Sung Jin-woo icon!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                    <h4 className="font-system font-bold text-slate-200 text-xs">
                      Alternative: Download ZIP Directly on Phone
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      You can also visit <code>github.com/shubhans189/&lt;repo&gt;</code> directly in Chrome on your phone ➔ tap the green <strong>"Code"</strong> button ➔ tap <strong>"Download ZIP"</strong> to save the complete source code directly on your phone!
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Scan QR Code with Phone */}
              {activeGuideTab === 'qrcode' && (
                <div className="space-y-4 flex flex-col items-center text-center">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to open on phone"
                      className="w-44 h-44 rounded-xl object-contain bg-[#050814]"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-system font-bold text-cyan-300 text-sm">
                      Scan with your phone camera
                    </h4>
                    <p className="text-slate-400 text-xs max-w-xs">
                      Point your phone's camera at this QR code to immediately launch the app on your phone, then tap "Add to Home screen"!
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Troubleshooting */}
              {activeGuideTab === 'troubleshoot' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-2">
                    <span className="font-bold text-amber-300 block font-system">
                      #1 Reason: In-App Browser (WhatsApp / Gmail / Instagram)
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      If you opened the link through an in-app viewer, tap the 3 dots at the top right and select <strong>"Open in Chrome"</strong> or <strong>"Open in Safari"</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl space-y-1.5">
                    <span className="font-bold text-cyan-300 block font-system">
                      #2 Offline Capability
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Once added to your home screen, the service worker caches the core app assets so it loads instantly even with no internet connection.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Copy Link Box */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-1.5">
                  Direct Mobile Link (Copy and send to your phone):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition active:scale-95 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-cyan-500/20 bg-slate-950 flex justify-end shrink-0">
              <button
                onClick={closeGuide}
                className="px-5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 font-system font-bold text-xs transition"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
