
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useContent } from '../contexts/ContentContext';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    const { currentUser } = useContent();

    const socialLinks = [
        { name: 'twitter', href: '#' },
        { name: 'linkedin', href: '#' },
        { name: 'github', href: '#' }
    ];

    const footerLinks: Record<string, {name: string, path: string}[]> = {
        'Solutions': [
            { name: 'Software Development', path: '/software-development' },
            { name: 'Electronics', path: '/electronics' },
            { name: 'POS Systems', path: '/pos-systems' },
            { name: 'E-Commerce', path: '/ecommerce' },
        ],
        'Company': [
            { name: 'About', path: '/about' },
            { name: 'Blog', path: '/blog' },
            { name: 'Careers', path: '/careers' },
            { name: 'Contact', path: '/contact' },
        ],
        'Legal': [
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms-of-service' },
            { name: 'Cookie Policy', path: '/cookie-policy' },
        ],
    };

    if (currentUser && currentUser.role === 'admin') {
        footerLinks['Admin'] = [
            { name: 'Content Management', path: '/admin' },
        ];
    }

    return (
        <footer className="bg-techflex-blue text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link to="/" className="cursor-pointer">
                           <Icon name="kytriq" className="text-white text-3xl"/>
                        </Link>
                        <p className="mt-4 text-brand-gray-300 text-sm">Empowering Your Vision with Code & Circuits.</p>
                        <div className="mt-6 flex space-x-4">
                           <p className="font-bold">Follow us:</p>
                            {socialLinks.map((social) => (
                                <a key={social.name} href={social.href} className="text-brand-gray-300 hover:text-white transition-colors">
                                    <span className="sr-only">{social.name}</span>
                                    <Icon name={social.name} className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h3 className="text-sm font-semibold tracking-wider uppercase text-brand-gray-200">{title}</h3>
                                <ul className="mt-4 space-y-2">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link to={link.path} className="text-base text-brand-gray-300 hover:text-white transition-colors">{link.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 border-t border-techflex-blue-700 pt-8 text-center text-sm text-brand-gray-400">
                    <p>&copy; {new Date().getFullYear()} Kytriq. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
