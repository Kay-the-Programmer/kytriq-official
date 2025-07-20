
import React, { useState } from 'react';
import Icon from '../components/Icon';

interface ContactPageProps {
    onNavigate: (page: string) => void;
    onSendMessage: () => void;
}

const ContactInfoItem: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-techflex-orange-100 rounded-full flex items-center justify-center">
            <Icon name={iconName} className="w-6 h-6 text-techflex-orange" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-brand-gray-900">{title}</h3>
            <div className="text-brand-gray-600 mt-1">{children}</div>
        </div>
    </div>
);


const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onSendMessage }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'General',
        message: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage();
    };

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-techflex-blue text-white py-24 sm:py-32">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-techflex-blue/90 to-techflex-blue"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Get in Touch</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-200">
                        We're here to help and answer any question you might have. We look forward to hearing from you.
                    </p>
                </div>
            </div>

            <div className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left Column: Contact Info & Map */}
                        <div className="space-y-12">
                            <h2 className="text-3xl font-bold text-brand-gray-900">Contact Information</h2>
                            <div className="space-y-8">
                                <ContactInfoItem iconName="map-pin" title="Our Office">
                                    <p>123 Kytriq Avenue</p>
                                    <p>Innovate City, CA 94043</p>
                                </ContactInfoItem>
                                <ContactInfoItem iconName="envelope" title="Email Us">
                                    <p><a href="mailto:contact@kytriq.com" className="hover:text-techflex-orange">contact@kytriq.com</a> (General)</p>
                                    <p><a href="mailto:sales@kytriq.com" className="hover:text-techflex-orange">sales@kytriq.com</a> (Sales)</p>
                                    <p><a href="mailto:support@kytriq.com" className="hover:text-techflex-orange">support@kytriq.com</a> (Support)</p>
                                </ContactInfoItem>
                                <ContactInfoItem iconName="device-phone-mobile" title="Call Us">
                                    <p>(123) 456-7890</p>
                                </ContactInfoItem>
                            </div>
                             <div className="mt-12 rounded-2xl overflow-hidden shadow-xl">
                                <img src="https://maps.googleapis.com/maps/api/staticmap?center=37.422,-122.084&zoom=15&size=600x400&markers=color:orange%7Clabel:K%7C37.422,-122.084&key=YOUR_API_KEY&style=feature:all|element:labels|visibility:off" alt="Map to Kytriq Office" className="w-full" />
                            </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl border border-brand-gray-100">
                             <h2 className="text-3xl font-bold text-brand-gray-900 mb-8">Send Us a Message</h2>
                             <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-brand-gray-700">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-orange focus:ring-techflex-orange" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700">Email Address</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-orange focus:ring-techflex-orange" />
                                </div>
                                 <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-brand-gray-700">Phone Number (Optional)</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-orange focus:ring-techflex-orange" />
                                </div>
                                <div>
                                    <label htmlFor="inquiryType" className="block text-sm font-medium text-brand-gray-700">What can we help you with?</label>
                                    <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-orange focus:ring-techflex-orange">
                                        <option>General Inquiry</option>
                                        <option>Sales Question</option>
                                        <option>Support Request</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-brand-gray-700">Message</label>
                                    <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={5} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-orange focus:ring-techflex-orange"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        Send Message
                                    </button>
                                </div>
                             </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
