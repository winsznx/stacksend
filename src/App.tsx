import { useEffect, useState, useCallback } from 'react';
import { RecipientTable } from './components/RecipientTable';
import { WalletConnect } from './components/WalletConnect';
import { NetworkToggle } from './components/NetworkToggle';
import { PlanSelector } from './components/PlanSelector';
import { TelegramLinkWidget } from './components/TelegramLinkWidget';
import { ActivityFeed } from './components/ActivityFeed';
import { useAuth } from './hooks/useAuth';
import { getContractAddress } from './utils/constants';
import { FiSun, FiMoon, FiLogOut, FiHome } from 'react-icons/fi';
import { MdLayers } from 'react-icons/md';

function App() {
  const [theme, setTheme] = useState('light');
  const [maxRecipients, setMaxRecipients] = useState(5);
  const [showLanding, setShowLanding] = useState(true);
  const { isAuthenticated, stxAddress, disconnect, network } = useAuth();
  const isDark = theme === 'dark';

  // Determine contract address based on network
  const isMainnet = network?.chainId !== 2147483648; // testnet chainId
  const contractAddress = getContractAddress(isMainnet);

  const applyTheme = useCallback((newTheme: string) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme management
  useEffect(() => {
    const saved = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(saved);
    applyTheme(saved);
  }, [applyTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleEnterApp = useCallback(() => {
    setShowLanding(false);
  }, []);

  const handleGoToLanding = useCallback(() => {
    setShowLanding(true);
  }, []);

  // Scroll to top when entering the app
  useEffect(() => {
    if (!showLanding && isAuthenticated) {
      window.scrollTo(0, 0);
    }
  }, [showLanding, isAuthenticated]);

  // Show landing page if explicitly requested (manual user control)
  if (showLanding) {
    return <WalletConnect onEnterApp={handleEnterApp} />;
  }

  // Render main app - user clicked "Go to App"
  return (
    <div key="main-app" className={"min-h-screen relative overflow-hidden"} style={{ backgroundColor: isDark ? 'var(--bg-primary)' : '#fafafa', color: 'var(--text-primary)' }}>
      {/* Enhanced CSS with Gaming Effects */}
      <style>{`
        .gaming-font {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          letter-spacing: 0.02em;
          font-weight: 600;
        }

        /* Animated Grid Background */
        .grid-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        .grid-background-light {
          background-image:
            linear-gradient(0deg, transparent 24%, rgba(249, 115, 22, 0.08) 25%, rgba(249, 115, 22, 0.08) 26%, transparent 27%, transparent 74%, rgba(249, 115, 22, 0.08) 75%, rgba(249, 115, 22, 0.08) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(249, 115, 22, 0.08) 25%, rgba(249, 115, 22, 0.08) 26%, transparent 27%, transparent 74%, rgba(249, 115, 22, 0.08) 75%, rgba(249, 115, 22, 0.08) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
          background-position: 0 0, 25px 25px;
          animation: gridShift 30s linear infinite;
        }

        .grid-background-dark {
          background-image:
            linear-gradient(0deg, transparent 24%, rgba(249, 115, 22, 0.12) 25%, rgba(249, 115, 22, 0.12) 26%, transparent 27%, transparent 74%, rgba(249, 115, 22, 0.12) 75%, rgba(249, 115, 22, 0.12) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(249, 115, 22, 0.12) 25%, rgba(249, 115, 22, 0.12) 26%, transparent 27%, transparent 74%, rgba(249, 115, 22, 0.12) 75%, rgba(249, 115, 22, 0.12) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
          background-position: 0 0, 25px 25px;
          animation: gridShift 30s linear infinite;
        }

        @keyframes gridShift {
          0% {
            background-position: 0 0, 25px 25px;
          }
          100% {
            background-position: 50px 50px, 75px 75px;
          }
        }

        /* Moving Glowing Border Container */
        .glowing-border-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        /* Top border glow - moves left to right */
        .glowing-border-top {
          position: absolute;
          top: 0;
          left: 0;
          height: 2px;
          width: 40%;
          background: linear-gradient(90deg, transparent, #f97316, transparent);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.6);
          animation: borderTopMove 3s ease-in-out infinite;
          z-index: 2;
        }

        /* Right border glow - moves top to bottom */
        .glowing-border-right {
          position: absolute;
          right: 0;
          top: 0;
          width: 2px;
          height: 40%;
          background: linear-gradient(180deg, transparent, #f97316, transparent);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.6);
          animation: borderRightMove 3s ease-in-out infinite;
          animation-delay: 0.75s;
          z-index: 2;
        }

        /* Bottom border glow - moves right to left */
        .glowing-border-bottom {
          position: absolute;
          bottom: 0;
          right: 0;
          height: 2px;
          width: 40%;
          background: linear-gradient(90deg, transparent, #f97316, transparent);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.6);
          animation: borderBottomMove 3s ease-in-out infinite;
          animation-delay: 1.5s;
          z-index: 2;
        }

        /* Left border glow - moves bottom to top */
        .glowing-border-left {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 2px;
          height: 40%;
          background: linear-gradient(180deg, transparent, #f97316, transparent);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.6);
          animation: borderLeftMove 3s ease-in-out infinite;
          animation-delay: 2.25s;
          z-index: 2;
        }

        /* Top border animation - left to right */
        @keyframes borderTopMove {
          0% {
            left: -40%;
          }
          50% {
            left: 50%;
          }
          100% {
            left: 100%;
          }
        }

        /* Right border animation - top to bottom */
        @keyframes borderRightMove {
          0% {
            top: -40%;
          }
          50% {
            top: 50%;
          }
          100% {
            top: 100%;
          }
        }

        /* Bottom border animation - right to left */
        @keyframes borderBottomMove {
          0% {
            right: -40%;
          }
          50% {
            right: 50%;
          }
          100% {
            right: 100%;
          }
        }

        /* Left border animation - bottom to top */
        @keyframes borderLeftMove {
          0% {
            bottom: -40%;
          }
          50% {
            bottom: 50%;
          }
          100% {
            bottom: 100%;
          }
        }
      `}</style>

      {/* Grid Background */}
      <div className={`grid-background ${isDark ? 'grid-background-dark' : 'grid-background-light'}`}></div>

      {/* Header with Enhanced Styling */}
      <header
        className={"sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 relative"}
        style={{
          backgroundColor: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: 'var(--border-color)',
          boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className={"max-w-6xl mx-auto px-3 sm:px-6 lg:px-8"}>
          <div className={"flex items-center justify-between h-14 sm:h-16"}>
            {/* Logo & Title with Gaming Font */}
            <div className={"flex items-center gap-2 sm:gap-3 min-w-0"}>
              <div className={"w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0"}>
                <MdLayers aria-hidden="true" className={"w-4 h-4 sm:w-5 sm:h-5 text-white"} />
              </div>
              <div className={"min-w-0"}>
                <h1
                  className={"text-base sm:text-lg font-bold truncate gaming-font"}
                  style={{ color: 'var(--text-primary)' }}
                >
                  Stack<span style={{ color: '#f97316' }}>Send</span>
                </h1>
                {stxAddress && (
                  <p
                    className={"text-xs font-mono hidden sm:block"}
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stxAddress.slice(0, 6)}...{stxAddress.slice(-4)}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={"flex items-center gap-1 sm:gap-2"}>
              <div className={"hidden sm:flex items-center gap-2"}>
                <NetworkToggle />
                <PlanSelector onPlanChange={setMaxRecipients} />
              </div>

              {/* Home - Go to Landing */}
              <button type="button"
                onClick={handleGoToLanding}
                className={"btn-ghost p-2 rounded-lg transition-all duration-200 hover:scale-110"}
                aria-label="Go to home"
                title="Go to landing page"
              >
                <FiHome aria-hidden="true" className={"w-5 h-5"} />
              </button>

              {/* Theme Toggle */}
              <button type="button"
                onClick={toggleTheme}
                className={"btn-ghost p-2 rounded-lg transition-all duration-200 hover:scale-110"}
                aria-label="Toggle theme"
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <FiSun aria-hidden="true" className={"w-5 h-5 text-yellow-500"} />
                ) : (
                  <FiMoon aria-hidden="true" className={"w-5 h-5 text-blue-500"} />
                )}
              </button>

              {/* Disconnect */}
              <button type="button"
                onClick={() => {
                  disconnect();
                  setShowLanding(true);
                }}
                className={"btn-ghost p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110"}
                aria-label="Disconnect wallet"
                title="Disconnect wallet and go to landing"
              >
                <FiLogOut aria-hidden="true" className={"w-5 h-5"} />
              </button>
            </div>
          </div>

          {/* Mobile-only second row for Network and Plan */}
          <div className={"flex sm:hidden items-center gap-2 pb-2"}>
            <NetworkToggle />
            <PlanSelector onPlanChange={setMaxRecipients} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={"max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10"}>
        {/* Plan Info Card with Glowing Border */}
        <div className={"glowing-border-container mb-6"}>
          <div className={"glowing-border-top"}></div>
          <div className={"glowing-border-right"}></div>
          <div className={"glowing-border-bottom"}></div>
          <div className={"glowing-border-left"}></div>

          <div
            className={"card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid rgba(249, 115, 22, 0.1)',
              borderRadius: '12px'
            }}
          >
            <div className={"flex items-center gap-3 flex-1"}>
              <div
                className={"w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"}
                style={{
                  backgroundColor: 'var(--accent-orange-light)',
                  boxShadow: '0 0 20px rgba(249, 115, 22, 0.1)'
                }}
              >
                <MdLayers aria-hidden="true" className={"w-5 h-5"} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <div>
                <p role="status" aria-live="polite" className={"text-sm font-medium gaming-font"} style={{ color: 'var(--text-primary)' }}>
                  Current Plan Limit
                </p>
                <p className={"text-xs"} style={{ color: 'var(--text-muted)' }}>
                  You can send to up to <strong className={"font-semibold gaming-font"} style={{ color: 'var(--accent-orange)' }}>{maxRecipients}</strong> recipients per transaction
                </p>
              </div>
            </div>
            {/* Status Indicator */}
            <div className={"flex items-center gap-2 px-3 py-2 rounded-lg"} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div className={"w-2 h-2 rounded-full bg-green-500 animate-pulse"}></div>
              <span className={"text-xs font-medium gaming-font"} style={{ color: 'var(--success)' }}>Active</span>
            </div>
          </div>
        </div>

        {/* Recipient Table with Glowing Border */}
        <div className={"glowing-border-container mb-6"}>
          <div className={"glowing-border-top"}></div>
          <div className={"glowing-border-right"}></div>
          <div className={"glowing-border-bottom"}></div>
          <div className={"glowing-border-left"}></div>

          <div className={"card transition-all duration-300"} style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <RecipientTable contractAddress={contractAddress} maxRecipients={maxRecipients} />
          </div>
        </div>

        {/* Telegram Notifications with Glowing Border */}
        <div className={"mt-8 glowing-border-container"}>
          <div className={"glowing-border-top"}></div>
          <div className={"glowing-border-right"}></div>
          <div className={"glowing-border-bottom"}></div>
          <div className={"glowing-border-left"}></div>
          <TelegramLinkWidget walletAddress={stxAddress} />
        </div>

        {/* Activity Feed with Glowing Border */}
        <div className={"mt-8 glowing-border-container"}>
          <div className={"glowing-border-top"}></div>
          <div className={"glowing-border-right"}></div>
          <div className={"glowing-border-bottom"}></div>
          <div className={"glowing-border-left"}></div>
          <ActivityFeed walletAddress={stxAddress} />
        </div>
      </main>

      {/* Footer with Enhanced Styling */}
      <footer
        className={"border-t py-6 mt-auto transition-all duration-300 relative z-10"}
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className={"max-w-6xl mx-auto px-4 text-center"}>
          <p className={"text-sm gaming-font"} style={{ color: 'var(--text-muted)' }}>
            Built on Stacks • Secured by Bitcoin • L2
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;


export type {};
