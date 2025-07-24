import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useContent } from '../contexts/ContentContext';

interface FooterProps {}

// Memoized social link component for performance
const SocialLink: React.FC<{
    social: { name: string; href: string };
    index: number;
}> = React.memo(({ social, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={social.href}
            className="group relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-techflex-blue/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            style={{ transitionDelay: `${index * 100}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Follow us on ${social.name}`}
        >
            <span className="sr-only">{social.name}</span>
            <Icon
                name={social.name}
                className={`h-5 w-5 transition-all duration-300 ${
                    isHovered ? 'text-techflex-orange scale-110' : 'text-brand-gray-400 group-hover:text-techflex-blue'
                }`}
            />

            {/* Animated glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-techflex-blue to-techflex-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm -z-10`} />

            {/* Tooltip */}
            <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-brand-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none ${
                isHovered ? 'translate-y-0' : 'translate-y-2'
            }`}>
                {social.name.charAt(0).toUpperCase() + social.name.slice(1)}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brand-gray-800" />
            </div>
        </a>
    );
});

// Memoized footer link component
const FooterLink: React.FC<{
    link: { name: string; path: string };
    index: number;
}> = React.memo(({ link, index }) => (
    <li style={{ transitionDelay: `${index * 50}ms` }}>
        <Link
            to={link.path}
            className="group relative text-brand-gray-400 hover:text-techflex-blue transition-all duration-300 text-sm flex items-center gap-2 py-1 hover:translate-x-2"
        >
            <div className="w-0 h-px bg-techflex-blue group-hover:w-4 transition-all duration-300" />
            <span className="group-hover:font-medium transition-all duration-300">{link.name}</span>
            <Icon name="arrow-right" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" />
        </Link>
    </li>
));

// Memoized newsletter component
const NewsletterSection: React.FC = React.memo(() => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubscribed(true);
        setIsLoading(false);
        setEmail('');

        // Reset after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000);
    }, [email]);

    return (
        <div className="bg-gradient-to-br from-techflex-blue/10 to-techflex-orange/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm">
            <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-brand-gray-800 mb-2 flex items-center justify-center gap-2">
                    <Icon name="mail" className="w-5 h-5 text-techflex-blue" />
                    Stay Updated
                </h4>
                <p className="text-sm text-brand-gray-600">
                    Get the latest news and updates delivered to your inbox.
                </p>
            </div>

            {isSubscribed ? (
                <div className="flex items-center justify-center gap-2 text-green-600 animate-bounce">
                    <Icon name="check-circle" className="w-5 h-5" />
                    <span className="font-medium">Successfully subscribed!</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 rounded-xl border border-brand-gray-200 focus:border-techflex-blue focus:ring-2 focus:ring-techflex-blue/20 outline-none transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-techflex-blue to-techflex-orange text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Icon name="send" className="w-4 h-4" />
                        )}
                        {isLoading ? 'Sending...' : 'Subscribe'}
                    </button>
                </form>
            )}
        </div>
    );
});

const Footer: React.FC<FooterProps> = () => {
    const { currentUser } = useContent();
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress] = useState(0);
    const footerRef = useRef<HTMLDivElement>(null);

    // Intersection observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, []);



    // Memoized social links
    const socialLinks = useMemo(() => [
        { name: 'twitter', href: 'https://twitter.com/kytriq' },
        { name: 'linkedin', href: 'https://linkedin.com/company/kytriq' },
        { name: 'github', href: 'https://github.com/kytriq' },
        { name: 'instagram', href: 'https://instagram.com/kytriq' }
    ], []);

    // Memoized footer links with proper structuring
    const footerLinks = useMemo(() => {
        const baseLinks: Record<string, {name: string, path: string}[]> = {
            'Solutions': [
                { name: 'Software Development', path: '/software-development' },
                { name: 'Electronics', path: '/electronics' },
                { name: 'POS Systems', path: '/pos-systems' },
                { name: 'E-Commerce', path: '/ecommerce' },
            ],
            'Company': [
                { name: 'About Us', path: '/about' },
                { name: 'Our Blog', path: '/blog' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact', path: '/contact' },
            ],
            'Support': [
                { name: 'Help Center', path: '/help' },
                { name: 'Documentation', path: '/docs' },
                { name: 'API Reference', path: '/api' },
                { name: 'Status Page', path: '/status' },
            ],
            'Legal': [
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms-of-service' },
                { name: 'Cookie Policy', path: '/cookie-policy' },
                { name: 'Security', path: '/security' },
            ],
        };

        if (currentUser?.role === 'admin') {
            baseLinks['Admin'] = [
                { name: 'Dashboard', path: '/admin' },
                { name: 'Analytics', path: '/admin/analytics' },
                { name: 'Settings', path: '/admin/settings' },
            ];
        }

        return baseLinks;
    }, [currentUser]);

    return (
        <footer
            ref={footerRef}
            className="relative bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50/30 overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-techflex-blue/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-techflex-orange/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-techflex-blue/3 to-techflex-orange/3 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />
            </div>

            {/* Top progress bar */}
            <div className="h-1 bg-brand-gray-200">
                <div
                    className="h-full bg-gradient-to-r from-techflex-blue to-techflex-orange transition-all duration-300 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main footer content */}
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                        {/* Brand section - Enhanced */}
                        <div className="lg:col-span-4">
                            <div className="space-y-6">
                                {/* Logo with animation */}
                                <Link to="/" className="group cursor-pointer inline-block">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all duration-300 group-hover:scale-105">
                                        <Icon name="kytriq" className="text-techflex-blue text-4xl group-hover:text-techflex-orange transition-colors duration-300"/>
                                        <div>
                                            <div className="text-xl font-bold text-brand-gray-800 group-hover:text-techflex-blue transition-colors duration-300">
                                                Kytriq
                                            </div>
                                            <div className="text-xs text-brand-gray-500 group-hover:text-brand-gray-600 transition-colors duration-300">
                                                Innovation & Technology
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Enhanced tagline */}
                                <div className="space-y-3">
                                    <p className="text-brand-gray-600 leading-relaxed">
                                        <span className="font-semibold text-techflex-blue">Empowering Your Vision</span> with cutting-edge
                                        <span className="font-semibold text-techflex-orange"> Code & Circuits</span>.
                                    </p>
                                    <p className="text-sm text-brand-gray-500">
                                        Transforming ideas into innovative digital solutions that drive business growth and technological advancement.
                                    </p>
                                </div>

                                {/* Newsletter signup */}
                                <NewsletterSection />

                                {/* Social links with enhanced styling */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-brand-gray-700 flex items-center gap-2">
                                        <Icon name="users" className="w-4 h-4 text-techflex-blue" />
                                        Connect With Us
                                    </h4>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social, index) => (
                                            <SocialLink key={social.name} social={social} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links sections - Enhanced */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
                                    <div
                                        key={title}
                                        className={`transition-all duration-700 ${
                                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                        style={{ transitionDelay: `${(sectionIndex + 1) * 200}ms` }}
                                    >
                                        <h3 className="text-sm font-bold tracking-wider uppercase text-brand-gray-700 mb-6 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gradient-to-r from-techflex-blue to-techflex-orange rounded-full" />
                                            {title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {links.map((link, linkIndex) => (
                                                <FooterLink key={link.name} link={link} index={linkIndex} />
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced bottom section */}
                    <div className="border-t border-gradient-to-r from-transparent via-brand-gray-200 to-transparent pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Copyright with enhanced styling */}
                            <div className="flex items-center gap-4 text-sm text-brand-gray-500">
                                <p className="flex items-center gap-2">
                                    <Icon name="copyright" className="w-4 h-4 text-techflex-blue" as="span" />
                                    {new Date().getFullYear()} Kytriq. All rights reserved.
                                </p>
                                <div className="hidden md:block w-px h-4 bg-brand-gray-300" />
                                <p className="hidden md:block text-xs">
                                    Made with <span className="text-red-500 animate-pulse">♥</span> in Innovation Lab
                                </p>
                            </div>

                            {/* Additional info */}
                            <div className="flex items-center gap-6 text-xs text-brand-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span>All Systems Operational</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="shield" className="w-4 h-4 text-techflex-blue" />
                                    <span>SSL Secured</span>
                                </div>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="flex items-center gap-1 hover:text-techflex-blue transition-colors duration-300 group"
                                >
                                    <span>Back to top</span>
                                    <Icon name="arrow-up" className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* Performance indicator */}
                        <div className="mt-6 pt-4 border-t border-brand-gray-100 text-center">
                            <p className="text-xs text-brand-gray-400 flex items-center justify-center gap-2">
                                <Icon name="zap" className="w-3 h-3 text-yellow-500" />
                                Optimized for performance • Loaded in {Math.round(performance.now())}ms
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
