import React, { memo } from 'react';
import FAQItem from './FAQItem';
import Icon from './Icon';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

interface FAQSectionProps {
    faqItems: Array<{
        question: string;
        answer: string;
    }>;
    onNavigate: (page: string, id: string) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqItems, onNavigate }) => {
    // Monitor performance of this component
    usePerformanceMonitor('FAQSection');

    return (
        <section className="py-24 sm:py-32 bg-gradient-to-t from-techflex-blue-50 to-white relative overflow-hidden">
            {/* Simplified decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-1/6 w-72 h-72 bg-techflex-blue-500/5 rounded-full blur-3xl animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto animate-fadeInUp">
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue shadow-sm">Support & Resources</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-brand-gray-900 mb-4">Frequently Asked Questions</h2>
                    <div className="w-24 h-1 bg-techflex-orange mx-auto mb-6 rounded-full"></div>
                    <p className="text-xl text-brand-gray-600 leading-relaxed">
                        Find answers to common questions about our software products and services. Can't find what you're looking for? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact', ''); }} className="text-techflex-blue hover:text-techflex-blue-600 transition-colors duration-300 font-medium">Contact our support team</a>.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-brand-gray-100 relative">
                        {/* Simplified decorative corner accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 bg-techflex-blue-50 rounded-br-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-techflex-orange-50 rounded-tl-3xl"></div>

                        <div className="relative p-2 sm:p-4">
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <FAQItem
                                        key={index}
                                        question={item.question}
                                        answer={item.answer}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 bg-gradient-to-br from-techflex-blue-600 to-techflex-blue-800 rounded-3xl p-10 relative overflow-hidden shadow-xl">
                        {/* Simplified background elements */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-white">
                            <div className="md:w-2/3">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h3>
                                <p className="text-white/90 text-lg leading-relaxed">
                                    Our team of experts is ready to help you find the perfect software solution for your unique business needs. Get in touch today!
                                </p>
                            </div>
                            <div className="md:w-1/3 flex justify-center md:justify-end">
                                <a 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate('contact', '');
                                    }}
                                    className="group inline-flex items-center px-8 py-4 rounded-xl bg-white text-techflex-blue font-bold hover:bg-brand-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                                >
                                    Contact Support
                                    <Icon name="chat-bubble-left-right" className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(FAQSection);