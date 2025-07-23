import React, { useState, useCallback, memo } from 'react';
import Icon from './Icon';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Memoized toggle handler
    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return (
        <div className="group relative">
            {/* Reduced decorative elements for better performance */}
            {isOpen && (
                <div className="absolute -right-4 top-1/2 w-8 h-8 bg-techflex-blue-100 rounded-full opacity-20 animate-pulse" />
            )}

            <button
                className={`flex justify-between items-center w-full py-6 px-8 text-left focus:outline-none focus:ring-2 focus:ring-techflex-blue-100 rounded-xl transition-all duration-300 ${
                    isOpen ? 'bg-white shadow-md' : 'hover:bg-white/50'
                }`}
                onClick={toggleOpen}
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <div className={`flex-shrink-0 mr-4 flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-300 ${
                        isOpen 
                            ? 'bg-gradient-to-r from-techflex-blue to-techflex-blue-600 text-white shadow-md' 
                            : 'bg-techflex-blue-50 text-techflex-blue group-hover:bg-techflex-blue-100'
                    }`}>
                        <Icon
                            name={isOpen ? "check" : "question-mark-circle"}
                            className="h-5 w-5"
                        />
                    </div>
                    <span className={`text-lg font-medium ${
                        isOpen ? 'text-techflex-blue' : 'text-brand-gray-800 group-hover:text-techflex-blue'
                    } transition-colors duration-300`}>
                        {question}
                    </span>
                </div>
                <div className={`flex items-center justify-center h-9 w-9 rounded-full ${
                    isOpen 
                        ? 'bg-techflex-blue text-white rotate-180 shadow-md' 
                        : 'bg-brand-gray-100 text-brand-gray-500 group-hover:bg-techflex-blue/10 group-hover:text-techflex-blue'
                    } transition-all duration-500 transform`}>
                    <Icon name="chevron-down" className="h-5 w-5" />
                </div>
            </button>
            
            <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!isOpen}
            >
                <div className="pb-6 px-8 text-brand-gray-600">
                    <div className="bg-gradient-to-r from-techflex-blue-50 to-white p-6 rounded-xl border-l-4 border-techflex-blue shadow-sm">
                        <p className="leading-relaxed">{answer}</p>
                        <div className="mt-4 pt-4 border-t border-techflex-blue-100">
                            <div className="flex items-center text-sm text-techflex-blue">
                                <Icon name="information-circle" className="h-4 w-4 mr-2" />
                                <span>Was this helpful? <a href="#" className="underline hover:text-techflex-blue-600 transition-colors duration-300">Let us know</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FAQItem);