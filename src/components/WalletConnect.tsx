import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiArrowRight, FiZap, FiShield, FiUsers, FiSun, FiMoon, FiLogIn } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';
import { MdLayers } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface WalletConnectProps {
    onEnterApp?: () => void;
}

type WalletTypeSelection = 'stacks' | 'bitcoin' | null;

export const WalletConnect: React.FC<WalletConnectProps> = ({ onEnterApp }) => {
    const { authenticate, connectBitcoin, loading, isAuthenticated, stxAddress, btcAddress, walletType, isReownConfigured } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [theme, setTheme] = useState('light');
    const [selectedWalletType, setSelectedWalletType] = useState<WalletTypeSelection>(null);

    useEffect(() => {
        const saved = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(saved);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleConnectStacks = async () => {
        setError(null);
        setIsConnecting(true);
        try {
            await authenticate();
        } catch (err: unknown) {
            console.error('Stacks connection error:', err);
            setError(err?.message || 'Failed to connect Stacks wallet. Please try again.');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleConnectBitcoin = async () => {
        setError(null);
        setIsConnecting(true);
        try {
            await connectBitcoin();
        } catch (err: unknown) {
            console.error('Bitcoin connection error:', err);
            setError(err?.message || 'Failed to connect Bitcoin wallet. Please try again.');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleEnterApp = () => {
        onEnterApp?.();
    };

    const handleBack = () => {
        setSelectedWalletType(null);
        setError(null);
    };

    const isDark = theme === 'dark';

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300"
            style={{
                backgroundColor: isDark ? 'var(--bg-primary)' : '#fafafa'
            }}
        >
            {/* Enhanced CSS with Moving Glowing Border */}
            <style>{`
                .gaming-font {
                    font-family: 'Space Grotesk', 'Inter', sans-serif;
                    letter-spacing: 0.02em;
                    font-weight: 600;
                }
                
                .gaming-font-title {
                    font-family: 'Orbitron', 'Inter', sans-serif;
                    letter-spacing: 0.03em;
                    font-weight: 900;
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
                
                /* Glossy Card Effect */
                .glossy-card {
                    position: relative;
                    overflow: hidden;
                    border-radius: 12px;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                .glossy-card-light {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(244, 244, 245, 0.95) 100%);
                    border: 1.5px solid rgba(249, 115, 22, 0.15);
                    backdrop-filter: blur(8px);
                    box-shadow: 
                        0 4px 6px rgba(0, 0, 0, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8);
                }
                
                .glossy-card-dark {
                    background: linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(39, 39, 42, 0.9) 100%);
                    border: 1.5px solid rgba(249, 115, 22, 0.2);
                    backdrop-filter: blur(8px);
                    box-shadow: 
                        0 4px 6px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }
                
                .glossy-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%);
                    animation: shine 4s infinite;
                    pointer-events: none;
                }
                
                @keyframes shine {
                    0% {
                        transform: translateX(-100%) translateY(-100%) rotate(45deg);
                    }
                    100% {
                        transform: translateX(100%) translateY(100%) rotate(45deg);
                    }
                }
                
                .glossy-card:hover {
                    transform: translateY(-6px);
                }
                
                .glossy-card-light:hover {
                    border-color: rgba(249, 115, 22, 0.35);
                    box-shadow: 
                        0 12px 24px rgba(249, 115, 22, 0.12),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8);
                }
                
                .glossy-card-dark:hover {
                    border-color: rgba(249, 115, 22, 0.4);
                    box-shadow: 
                        0 12px 24px rgba(249, 115, 22, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }
                
                /* Primary Button Styles */
                .glow-button {
                    position: relative;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    font-weight: 600;
                    padding: 0.875rem 1.75rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    box-shadow: 
                        0 4px 15px rgba(249, 115, 22, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    font-family: 'Inter', system-ui, sans-serif;
                    overflow: hidden;
                }
                
                .glow-button::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
                    animation: shine 3s infinite;
                }
                
                .glow-button:hover:not(:disabled) {
                    box-shadow: 
                        0 8px 30px rgba(249, 115, 22, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
                    transform: translateY(-3px) scale(1.02);
                    border-color: rgba(255, 255, 255, 0.4);
                }
                
                .glow-button:active:not(:disabled) {
                    transform: translateY(-1px) scale(0.98);
                }
                
                .glow-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                /* Secondary Button */
                .secondary-button {
                    position: relative;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    padding: 0.875rem 1.75rem;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                
                .secondary-button-light {
                    background: linear-gradient(135deg, rgba(244, 244, 245, 0.95) 0%, rgba(229, 229, 231, 0.95) 100%);
                    border: 1.5px solid rgba(249, 115, 22, 0.2);
                    color: #18181b;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }
                
                .secondary-button-dark {
                    background: linear-gradient(135deg, rgba(39, 39, 42, 0.8) 0%, rgba(24, 24, 27, 0.8) 100%);
                    border: 1.5px solid rgba(249, 115, 22, 0.25);
                    color: #fafafa;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }
                
                .secondary-button:hover {
                    border-color: rgba(249, 115, 22, 0.5);
                    transform: translateY(-2px);
                }
                
                .secondary-button-light:hover {
                    box-shadow: 0 8px 16px rgba(249, 115, 22, 0.15);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(244, 244, 245, 0.95) 100%);
                }
                
                .secondary-button-dark:hover {
                    box-shadow: 0 8px 16px rgba(249, 115, 22, 0.25);
                    background: linear-gradient(135deg, rgba(52, 52, 55, 0.9) 0%, rgba(39, 39, 42, 0.9) 100%);
                }
                
                /* Theme Toggle */
                .theme-toggle {
                    background: transparent;
                    border: 1.5px solid rgba(249, 115, 22, 0.2);
                    color: var(--text-primary);
                    padding: 0.75rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .theme-toggle:hover {
                    border-color: rgba(249, 115, 22, 0.5);
                    box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
                    transform: scale(1.1);
                }
                
                /* Error Box */
                .error-box-light {
                    background: linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.95) 100%);
                    border: 1.5px solid rgba(239, 68, 68, 0.3);
                }
                
                .error-box-dark {
                    background: linear-gradient(135deg, rgba(127, 29, 29, 0.2) 0%, rgba(153, 27, 27, 0.15) 100%);
                    border: 1.5px solid rgba(239, 68, 68, 0.3);
                }
                
                /* Animations */
                .animate-slide-up {
                    animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Neon Text Effect */
                .neon-text-light {
                    background: linear-gradient(90deg, #f97316, #ea580c, #f97316);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .neon-text-dark {
                    background: linear-gradient(90deg, #fb923c, #f97316, #fb923c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                /* Status Indicator */
                .status-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    font-size: 0.875rem;
                }
                
                .status-indicator-light {
                    background: rgba(244, 244, 245, 0.95);
                    border: 1px solid rgba(249, 115, 22, 0.2);
                    color: #18181b;
                }
                
                .status-indicator-dark {
                    background: rgba(39, 39, 42, 0.9);
                    border: 1px solid rgba(249, 115, 22, 0.3);
                    color: #fafafa;
                }
                
                /* Feature Card */
                .feature-card {
                    padding: 1.5rem;
                    border-radius: 12px;
                    text-align: center;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                .feature-card-light {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(244, 244, 245, 0.9) 100%);
                    border: 1.5px solid rgba(249, 115, 22, 0.15);
                }
                
                .feature-card-dark {
                    background: linear-gradient(135deg, rgba(39, 39, 42, 0.8) 0%, rgba(24, 24, 27, 0.8) 100%);
                    border: 1.5px solid rgba(249, 115, 22, 0.2);
                }
                
                .feature-card:hover {
                    transform: translateY(-8px);
                }
                
                .feature-card-light:hover {
                    border-color: rgba(249, 115, 22, 0.35);
                    box-shadow: 0 12px 24px rgba(249, 115, 22, 0.1);
                }
                
                .feature-card-dark:hover {
                    border-color: rgba(249, 115, 22, 0.4);
                    box-shadow: 0 12px 24px rgba(249, 115, 22, 0.15);
                }
                
                /* Icon Background */
                .icon-bg {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%);
                }
                
                /* Responsive */
                @media (max-width: 640px) {
                    .gaming-font-title {
                        font-size: 2.25rem;
                    }
                    
                    .glow-button, .secondary-button {
                        padding: 0.75rem 1.5rem;
                        font-size: 0.875rem;
                    }
                }
            `}</style>

            {/* Grid Background */}
            <div className={`grid-background ${isDark ? 'grid-background-dark' : 'grid-background-light'}`}></div>

            {/* Theme Toggle - Top Right */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 theme-toggle z-20"
                aria-label="Toggle theme"
                aria-pressed={isDark}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDark ? (
                    <FiSun className="w-5 h-5" />
                ) : (
                    <FiMoon className="w-5 h-5" />
                )}
            </button>

            <div className="max-w-2xl w-full text-center animate-slide-up relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl relative group ${
                        isDark 
                            ? 'bg-gradient-to-br from-orange-600 to-orange-700 shadow-orange-500/30' 
                            : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-400/30'
                    }`}>
                        <div className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-gradient-to-t from-transparent via-white/5 to-transparent' : 'bg-gradient-to-t from-transparent via-white/20 to-transparent'}`}></div>
                        <MdLayers className="w-10 h-10 text-white relative z-10" />
                    </div>
                </div>

                {/* Title */}
                <h1 className={`gaming-font-title text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 ${isDark ? 'neon-text-dark' : 'neon-text-light'}`}>
                    Stack<span style={{ color: '#f97316' }}>Send</span>
                </h1>

                {/* Subtitle */}
                <p className={`text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed gaming-font ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Send STX and SIP-010 tokens to multiple recipients in a single transaction.
                </p>

                {/* Main Content Area */}
                {isAuthenticated ? (
                    /* Already Connected - Show Go to App */
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button
                            onClick={handleEnterApp}
                            className="glow-button"
                        >
                            <FiLogIn className="w-5 h-5" />
                            <span>Go to App</span>
                            <FiArrowRight className="w-5 h-5" />
                        </button>
                        <div
                            role="status"
                            aria-live="polite"
                            className={`status-indicator ${isDark ? 'status-indicator-dark' : 'status-indicator-light'}`}
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-mono">
                                {walletType === 'stacks' && stxAddress && `${stxAddress.slice(0, 8)}...${stxAddress.slice(-6)}`}
                                {walletType === 'bitcoin' && btcAddress && `${btcAddress.slice(0, 8)}...${btcAddress.slice(-6)}`}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-orange-500/40">
                                {walletType === 'stacks' ? 'Stacks' : 'Bitcoin'}
                            </span>
                        </div>
                    </div>
                ) : selectedWalletType === null ? (
                    /* Step 1: Wallet Type Selection */
                    <>
                        <p className={`text-base mb-6 gaming-font ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Choose your wallet type to connect
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
                            {/* Stacks Wallet Option */}
                            <div className="glowing-border-container">
                                <div className="glowing-border-top"></div>
                                <div className="glowing-border-right"></div>
                                <div className="glowing-border-bottom"></div>
                                <div className="glowing-border-left"></div>
                                <button
                                    onClick={() => setSelectedWalletType('stacks')}
                                    className={`glossy-card ${isDark ? 'glossy-card-dark' : 'glossy-card-light'} p-6 text-center w-full`}
                                >
                                    <div className="icon-bg">
                                        <MdLayers className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h3 className={`gaming-font font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Stacks Wallet
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Connect with Leather, Xverse, or other Stacks wallets
                                    </p>
                                </button>
                            </div>

                            {/* Bitcoin Wallet Option */}
                            <div className="glowing-border-container">
                                <div className="glowing-border-top"></div>
                                <div className="glowing-border-right"></div>
                                <div className="glowing-border-bottom"></div>
                                <div className="glowing-border-left"></div>
                                <button
                                    onClick={() => setSelectedWalletType('bitcoin')}
                                    disabled={!isReownConfigured}
                                    className={`glossy-card ${isDark ? 'glossy-card-dark' : 'glossy-card-light'} p-6 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <div className="icon-bg">
                                        <SiBitcoin className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h3 className={`gaming-font font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Bitcoin Wallet
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Connect with Leather, Xverse, or other Bitcoin wallets
                                    </p>
                                    {!isReownConfigured && (
                                        <p className="text-xs mt-2 text-red-600 dark:text-red-400">
                                            Configuration required
                                        </p>
                                    )}
                                </button>
                            </div>
                        </div>
                        <a
                            href="https://stacks.co"
                            target="_blank"
                            rel="noreferrer"
                            className={`secondary-button ${isDark ? 'secondary-button-dark' : 'secondary-button-light'}`}
                        >
                            Learn about Stacks
                        </a>
                    </>
                ) : (
                    /* Step 2: Connect Selected Wallet Type */
                    <div className="flex flex-col gap-4 max-w-md mx-auto mb-8">
                        <button
                            onClick={selectedWalletType === 'stacks' ? handleConnectStacks : handleConnectBitcoin}
                            disabled={isConnecting || loading}
                            aria-busy={isConnecting || loading}
                            className="glow-button w-full"
                        >
                            {isConnecting || loading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    {selectedWalletType === 'stacks' ? (
                                        <MdLayers className="w-5 h-5" />
                                    ) : (
                                        <SiBitcoin className="w-5 h-5" />
                                    )}
                                    <span>Connect {selectedWalletType === 'stacks' ? 'Stacks' : 'Bitcoin'} Wallet</span>
                                    <FiArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleBack}
                            className={`secondary-button ${isDark ? 'secondary-button-dark' : 'secondary-button-light'} w-full`}
                        >
                            Back to wallet selection
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className={`${isDark ? 'error-box-dark' : 'error-box-light'} p-4 rounded-xl max-w-md mx-auto mb-8 text-left`}
                    >
                        <p className={`text-sm font-medium gaming-font ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                            {error}
                        </p>
                        <p className={`text-xs mt-2 opacity-80 ${isDark ? 'text-red-200' : 'text-red-600'}`}>
                            {selectedWalletType === 'stacks'
                                ? 'Make sure you have a Stacks wallet installed (e.g., Leather or Xverse).'
                                : 'Make sure you have a Bitcoin wallet installed and Reown is configured.'}
                        </p>
                    </div>
                )}

                {/* Feature Cards */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t ${isDark ? 'border-orange-500/15' : 'border-orange-500/10'}`}>
                    <div className="glowing-border-container">
                        <div className="glowing-border-top"></div>
                        <div className="glowing-border-right"></div>
                        <div className="glowing-border-bottom"></div>
                        <div className="glowing-border-left"></div>
                        <div className={`feature-card ${isDark ? 'feature-card-dark' : 'feature-card-light'}`}>
                            <div className="icon-bg">
                                <FiZap className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className={`gaming-font font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Efficient
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Batch up to 50 transfers in a single transaction
                            </p>
                        </div>
                    </div>

                    <div className="glowing-border-container">
                        <div className="glowing-border-top"></div>
                        <div className="glowing-border-right"></div>
                        <div className="glowing-border-bottom"></div>
                        <div className="glowing-border-left"></div>
                        <div className={`feature-card ${isDark ? 'feature-card-dark' : 'feature-card-light'}`}>
                            <div className="icon-bg">
                                <FiShield className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className={`gaming-font font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Secure
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Powered by Clarity smart contracts
                            </p>
                        </div>
                    </div>

                    <div className="glowing-border-container">
                        <div className="glowing-border-top"></div>
                        <div className="glowing-border-right"></div>
                        <div className="glowing-border-bottom"></div>
                        <div className="glowing-border-left"></div>
                        <div className={`feature-card ${isDark ? 'feature-card-dark' : 'feature-card-light'}`}>
                            <div className="icon-bg">
                                <FiUsers className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className={`gaming-font font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                User Friendly
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Easy copy-paste support for addresses
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`fixed bottom-6 text-sm gaming-font z-10 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Built on Stacks · Secured by Bitcoin
            </div>
        </div>
    );
};
