
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useCart } from '../contexts/CartContext';
import { useContent } from '../contexts/ContentContext';

interface HeaderProps {
    onCartToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartToggle }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const prevScrollPos = useRef(0);
    const { cartItems } = useCart();
    const { currentUser, logout } = useContent();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isScrollingDown = prevScrollPos.current < currentScrollPos;

            // Only hide header when scrolling down and not at the top of the page
            setIsVisible(!isScrollingDown || currentScrollPos < 10);
            prevScrollPos.current = currentScrollPos;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        logout();
        navigate('/');
        setIsMenuOpen(false);
    }

    const navLinks = [
        { name: 'Software', path: '/software' },
        { name: 'Products', path: '/products' },
        { name: 'Company', path: '/about' },
        { name: 'Blog', path: '/blog' },
    ];

    const authLinks = currentUser ? (
        <>
            <Link to="/account" className="p-2 text-brand-gray-600 hover:text-techflex-blue" aria-label="My Account">
               <Icon name="user" className="h-6 w-6" />
            </Link>
            {currentUser.role === 'admin' && (
                <Link to="/admin" className="text-brand-gray-600 hover:text-techflex-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Admin
                </Link>
            )}
            <button onClick={handleLogout} className="text-brand-gray-600 hover:text-techflex-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Log Out
            </button>
        </>
    ) : (
        <div className="flex items-center gap-2">
            <Link to="/login" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300">
                Sign In
            </Link>
            <Link to="/signup" className="text-brand-gray-600 hover:text-techflex-blue border border-brand-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sign Up
            </Link>
        </div>
    );

    return (
        <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-techflex-blue">
                           <Icon name="kytriq" className="text-techflex-blue"/>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} className="text-brand-gray-600 hover:text-techflex-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={onCartToggle} className="relative p-2 text-brand-gray-600 hover:text-techflex-blue">
                            <Icon name="cart" className="h-6 w-6" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white bg-techflex-orange text-white text-xs font-bold flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        {authLinks}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-brand-gray-100 inline-flex items-center justify-center p-2 rounded-md text-brand-gray-600 hover:text-techflex-blue hover:bg-brand-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-100 focus:ring-techflex-blue" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-brand-gray-600 hover:bg-brand-gray-100 hover:text-techflex-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">
                                {link.name}
                            </Link>
                        ))}
                         <div className="border-t border-brand-gray-200 mt-3 pt-3 flex justify-between items-center px-3">
                             <div className="flex items-center gap-2">
                                {currentUser ? (
                                    <>
                                        <Link to="/account" onClick={() => setIsMenuOpen(false)} className="text-brand-gray-600 hover:text-techflex-blue block px-3 py-2 rounded-md text-base font-medium">Account</Link>
                                        {currentUser.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-brand-gray-600 hover:text-techflex-blue block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                                        )}
                                        <button onClick={handleLogout} className="text-brand-gray-600 hover:text-techflex-blue block px-3 py-2 rounded-md text-base font-medium">Log Out</button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300">
                                            Sign In
                                        </Link>
                                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-brand-gray-600 hover:text-techflex-blue block px-3 py-2 rounded-md text-base font-medium">
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={onCartToggle} className="relative p-2 text-brand-gray-600 hover:text-techflex-blue">
                                    <Icon name="cart" className="h-6 w-6" />
                                    {totalItems > 0 && (
                                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white bg-techflex-orange text-white text-xs font-bold flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                             </div>
                         </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
