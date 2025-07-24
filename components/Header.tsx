import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { useCart } from '../contexts/CartContext';
import { useContent } from '../contexts/ContentContext';

interface HeaderProps {
    onCartToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartToggle }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const prevScrollPos = useRef(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { cartItems } = useCart();
    const { currentUser, logout } = useContent();
    const navigate = useNavigate();
    const location = useLocation();

    // Improved scroll handler with better flickering prevention
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isScrollingDown = prevScrollPos.current < currentScrollPos;
            const scrollDifference = Math.abs(currentScrollPos - prevScrollPos.current);

            // Clear any existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Only update header state if there's a significant scroll change
            if (currentScrollPos < 10) {
                // At the top of the page
                setIsVisible(true);
                setIsScrolled(false);
            } else if (scrollDifference > 30) {
                // Significant scroll detected - increase threshold to reduce sensitivity
                if (isScrollingDown && currentScrollPos > 100) {
                    // Only hide when scrolling down and not near the top
                    setIsVisible(false);
                } else if (!isScrollingDown) {
                    // Always show when scrolling up
                    setIsVisible(true);
                }
                setIsScrolled(true);
            }

            // Debounce visibility changes to prevent flickering
            scrollTimeoutRef.current = setTimeout(() => {
                prevScrollPos.current = currentScrollPos;
            }, 200); // Increased debounce time for more stability
        };

        const throttledScroll = throttle(handleScroll, 50); // Reduced frequency for better performance
        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', throttledScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Auto-focus search when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setSearchOpen(false);
    }, [location.pathname]);

    // Escape key handlers
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                setSearchOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Click outside to close mobile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isMenuOpen]);

    // Set CSS custom property for header height
    useEffect(() => {
        // Create a function to update header height
        const updateHeaderHeight = () => {
            if (!headerRef.current) return;

            const headerHeight = headerRef.current.offsetHeight || 0;
            const searchBarHeight = searchOpen ? 80 : 0;
            const totalHeight = headerHeight + searchBarHeight;

            document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
            document.documentElement.style.setProperty('--header-total-height', `${totalHeight}px`);
        };

        // Initial update
        updateHeaderHeight();

        // Setup resize observer
        const resizeObserver = new ResizeObserver(updateHeaderHeight);

        if (headerRef.current) {
            resizeObserver.observe(headerRef.current);
        }

        // Update on window resize as a fallback
        window.addEventListener('resize', updateHeaderHeight, { passive: true });

        // Cleanup function
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeaderHeight);
        };
    }, [searchOpen, isVisible]);

    // Memoize totalItems calculation to prevent recalculation on every render
    const totalItems = useMemo(() => 
        cartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [cartItems]);

    // Memoize event handlers to prevent unnecessary re-creation
    const handleLogout = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        logout();
        setIsMenuOpen(false);
    }, [logout, setIsMenuOpen]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    }, [navigate, searchQuery, setSearchOpen, setSearchQuery]);

    // Memoize navLinks to prevent unnecessary re-creation
    const navLinks = useMemo(() => [
        { name: 'Software', path: '/software', icon: 'code' },
        { name: 'Products', path: '/products', icon: 'shopping-bag' },
        { name: 'Company', path: '/about', icon: 'building-office' },
        { name: 'Blog', path: '/blog', icon: 'document-text' },
    ], []);

    // Memoize isActivePath function to prevent unnecessary re-creation
    const isActivePath = useCallback((path: string) => {
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    }, [location.pathname]);

    // Define keyframes for animations - memoized to prevent recreation on each render
    const animationStyles = useMemo(() => `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `, []);

    return (
        <>
            {/* Add animation keyframes */}
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

            <header
                ref={headerRef}
                className={`
                    fixed top-0 w-full z-50 transition-all duration-300 ease-out
                    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                    ${isScrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-brand-gray-100'
                    : 'bg-white/80 backdrop-blur-sm'
                }
                `}
                style={{
                    zIndex: isMenuOpen ? 60 : 50,
                    willChange: 'transform' // Optimize for animations
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo */}
                        <div className="flex-shrink-0 group">
                            <Link
                                to="/"
                                className="flex items-center space-x-2 text-techflex-blue transition-all duration-300 hover:scale-105"
                                aria-label="Kytriq Home"
                            >
                                <div className="relative">
                                    <Icon name="kytriq" className="h-8 w-8 lg:h-10 lg:w-10 transition-all duration-300 group-hover:text-techflex-orange" />
                                    <div className="absolute inset-0 bg-techflex-blue/20 rounded-full scale-0 group-hover:scale-150 transition-all duration-500 opacity-0 group-hover:opacity-100 blur-md" />
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onMouseEnter={() => setHoveredItem(link.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`
                                        relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                        ${isActivePath(link.path)
                                        ? 'text-techflex-blue bg-techflex-blue/10 shadow-lg shadow-techflex-blue/20'
                                        : 'text-brand-gray-600 hover:text-techflex-blue hover:bg-brand-gray-50'
                                    }
                                    `}
                                >
                                    <Icon
                                        name={link.icon}
                                        className={`
                                            h-4 w-4 transition-all duration-300
                                            ${hoveredItem === link.name ? 'scale-110' : ''}
                                            ${isActivePath(link.path) ? 'text-techflex-blue' : ''}
                                        `}
                                    />
                                    <span>{link.name}</span>

                                    {isActivePath(link.path) && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-techflex-orange rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3">

                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`
                                    relative p-2.5 rounded-full transition-all duration-300 group
                                    ${searchOpen
                                    ? 'text-techflex-blue bg-techflex-blue/10'
                                    : 'text-brand-gray-600 hover:text-techflex-blue hover:bg-brand-gray-50'
                                }
                                `}
                                aria-label="Search"
                                aria-expanded={searchOpen}
                            >
                                <Icon name="search" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 rounded-full bg-techflex-blue/20 scale-0 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10" />
                            </button>

                            {/* Cart Button */}
                            <button
                                onClick={onCartToggle}
                                className="relative p-2.5 rounded-full text-brand-gray-600 hover:text-techflex-blue hover:bg-brand-gray-50 transition-all duration-300 group"
                                aria-label={`Shopping cart with ${totalItems} items`}
                            >
                                <Icon name="cart" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-gradient-to-r from-techflex-orange to-techflex-orange-600 rounded-full ring-2 ring-white animate-pulse">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                                <div className="absolute inset-0 rounded-full bg-techflex-orange/20 scale-0 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10" />
                            </button>

                            {/* Auth Section */}
                            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-brand-gray-200">
                                {currentUser ? (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to="/account"
                                            className="flex items-center gap-2 p-2 rounded-full text-brand-gray-600 hover:text-techflex-blue hover:bg-brand-gray-50 transition-all duration-300 group"
                                            aria-label="My Account"
                                        >
                                            <Icon name="user" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                                            <span className="hidden xl:inline text-sm font-medium">Account</span>
                                        </Link>

                                        {currentUser.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-techflex-blue to-techflex-blue-700 text-white hover:shadow-lg hover:shadow-techflex-blue/30 transition-all duration-300"
                                            >
                                                Admin
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="px-3 py-1.5 text-sm font-medium text-brand-gray-600 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-300"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 rounded-full bg-gradient-to-r from-techflex-orange to-techflex-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-techflex-orange/30 hover:scale-105 transition-all duration-300"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="px-4 py-2 rounded-full text-sm font-medium text-brand-gray-600 hover:text-techflex-blue border border-brand-gray-200 hover:border-techflex-blue/30 hover:bg-techflex-blue/5 transition-all duration-300"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className="lg:hidden relative p-2 rounded-full bg-brand-gray-50 hover:bg-brand-gray-100 text-brand-gray-600 hover:text-techflex-blue transition-all duration-300 group z-50"
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMenuOpen}
                        >
                            <div className="relative w-6 h-6">
                                <span className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
                                <span className={`absolute left-0 top-3 w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                <span className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Full-screen overlay when search is active */}
                {searchOpen && (
                    <div 
                        className="fixed inset-0 bg-white/80 backdrop-blur-md transition-opacity duration-300 ease-out z-30"
                        onClick={() => setSearchOpen(false)}
                    />
                )}

                {/* Search Bar (Desktop) */}
                <div className={`
                    absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-brand-gray-100 transition-all duration-300 ease-out z-40
                    ${searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                `}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search products, software, and more..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-brand-gray-200 focus:border-techflex-blue focus:ring-4 focus:ring-techflex-blue/10 outline-none transition-all duration-300 text-lg"
                            />
                            <Icon name="search" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
                            <button
                                type="submit"
                                disabled={!searchQuery.trim()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-techflex-blue text-white rounded-xl hover:bg-techflex-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium"
                            >
                                Search
                            </button>
                        </form>

                        {/* Cancel button */}
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="absolute right-4 top-4 p-2 rounded-full bg-brand-gray-100 hover:bg-brand-gray-200 text-brand-gray-600 hover:text-techflex-blue transition-all duration-300"
                            aria-label="Cancel search"
                        >
                            <Icon name="x-mark" className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 z-50" 
                    style={{ 
                        top: 'var(--header-height, 64px)',
                        willChange: 'opacity, transform', // Optimize for animations
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ 
                            willChange: 'opacity',
                            animation: 'fadeIn 0.3s ease-out'
                        }}
                    />

                    {/* Menu Panel */}
                    <div
                        ref={mobileMenuRef}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-brand-gray-200 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
                        style={{ 
                            willChange: 'transform',
                            animation: 'slideDown 0.3s ease-out',
                            transformOrigin: 'top'
                        }}
                    >
                        <div className="px-4 py-6 space-y-6">

                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-16 py-3 rounded-xl border border-brand-gray-200 focus:border-techflex-blue focus:ring-2 focus:ring-techflex-blue/20 outline-none transition-all duration-300"
                                />
                                <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-gray-400" />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                    {searchQuery.trim() && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="p-1.5 rounded-full bg-brand-gray-100 text-brand-gray-500 hover:bg-brand-gray-200"
                                                aria-label="Clear search"
                                            >
                                                <Icon name="x-mark" className="h-3 w-3" />
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-3 py-1.5 bg-techflex-blue text-white rounded-lg text-sm font-medium"
                                            >
                                                Go
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>

                            {/* Mobile Navigation */}
                            <nav className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
                                            ${isActivePath(link.path)
                                            ? 'text-techflex-blue bg-techflex-blue/10 shadow-sm'
                                            : 'text-brand-gray-700 hover:text-techflex-blue hover:bg-brand-gray-50'
                                        }
                                        `}
                                    >
                                        <Icon name={link.icon} className="h-5 w-5" />
                                        <span>{link.name}</span>
                                        {isActivePath(link.path) && (
                                            <div className="ml-auto w-2 h-2 bg-techflex-orange rounded-full" />
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Cart & Actions */}
                            <div className="pt-4 border-t border-brand-gray-200 space-y-4">
                                <button
                                    onClick={() => {
                                        onCartToggle();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-brand-gray-700 hover:text-techflex-blue hover:bg-brand-gray-50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon name="cart" className="h-5 w-5" />
                                        <span>Shopping Cart</span>
                                    </div>
                                    {totalItems > 0 && (
                                        <span className="flex items-center justify-center h-6 w-6 text-xs font-bold text-white bg-techflex-orange rounded-full">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>

                                {/* Mobile Auth */}
                                {currentUser ? (
                                    <div className="space-y-2">
                                        <Link
                                            to="/account"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-brand-gray-700 hover:text-techflex-blue hover:bg-brand-gray-50 transition-all duration-300"
                                        >
                                            <Icon name="user" className="h-5 w-5" />
                                            <span>My Account</span>
                                        </Link>

                                        {currentUser.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-techflex-blue bg-techflex-blue/10 transition-all duration-300"
                                            >
                                                <Icon name="cog" className="h-5 w-5" />
                                                <span>Admin Panel</span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                                        >
                                            <Icon name="arrow-right-on-rectangle" className="h-5 w-5" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-techflex-orange to-techflex-orange-600 text-white font-semibold transition-all duration-300"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full px-4 py-3 text-center rounded-xl text-brand-gray-700 border border-brand-gray-200 hover:border-techflex-blue/30 hover:bg-techflex-blue/5 font-medium transition-all duration-300"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Spacer */}
            <div
                className={`
                    transition-all duration-300 ease-out
                    ${isVisible ? 'h-16 lg:h-20' : 'h-0'}
                    ${searchOpen ? 'pb-20' : ''}
                `}
                aria-hidden="true"
            />
        </>
    );
};

// Improved throttle function to enhance scroll performance
function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): T {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;

    return (function(this: unknown, ...args: unknown[]) {
        const context = this;
        const now = Date.now();

        if (!lastRan) {
            func.apply(context, args);
            lastRan = now;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((now - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = now;
                }
            }, limit - (now - lastRan));
        }
    }) as T;
}

export default Header;
