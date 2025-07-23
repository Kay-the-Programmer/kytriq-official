import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../components/Icon';

interface ContactPageProps {
    onNavigate: (page: string) => void;
    onSendMessage: () => void;
}

// Enhanced intersection observer hook for scroll animations
const useIntersectionObserver = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                setProgress(entry.intersectionRatio);
            },
            {
                threshold: [0, 0.2, 0.5, 0.8, 1.0],
                rootMargin: '50px',
                ...options
            }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible, progress] as const;
};

// Touch detection hook
const useTouch = () => {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
            setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
        };
        checkTouch();
        window.addEventListener('resize', checkTouch, { passive: true });
        return () => window.removeEventListener('resize', checkTouch);
    }, []);

    return isTouch;
};

// Enhanced 3D tilt effect
const useTiltEffect = () => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);
    const isTouch = useTouch();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!ref.current || isTouch) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / rect.height) * -8;
        const rotateY = ((e.clientX - centerX) / rect.width) * 8;

        setTilt({ x: rotateX, y: rotateY });
    }, [isTouch]);

    const handleMouseLeave = useCallback(() => {
        setTilt({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    return [ref, tilt] as const;
};

// Enhanced Contact Info Item with micro-interactions
const ContactInfoItem: React.FC<{
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
    onInteract?: () => void;
}> = ({ iconName, title, children, index, onInteract }) => {
    const [itemRef, isVisible] = useIntersectionObserver();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const isTouch = useTouch();

    const colors = [
        {
            bg: 'bg-techflex-blue-50',
            iconBg: 'bg-techflex-blue-100',
            iconColor: 'text-techflex-blue-600',
            hoverBg: 'hover:bg-techflex-blue-100',
            shadow: 'shadow-techflex-blue-500/20'
        },
        {
            bg: 'bg-techflex-orange-50',
            iconBg: 'bg-techflex-orange-100',
            iconColor: 'text-techflex-orange-600',
            hoverBg: 'hover:bg-techflex-orange-100',
            shadow: 'shadow-techflex-orange-500/20'
        },
        {
            bg: 'bg-brand-gray-50',
            iconBg: 'bg-brand-gray-100',
            iconColor: 'text-brand-gray-600',
            hoverBg: 'hover:bg-brand-gray-100',
            shadow: 'shadow-brand-gray-500/20'
        }
    ];

    const currentColor = colors[index % colors.length];

    return (
        <div
            ref={itemRef as React.RefObject<HTMLDivElement>}
            className={`group relative p-6 rounded-2xl border border-white/60 backdrop-blur-sm transition-all duration-500 cursor-pointer transform-gpu ${currentColor.bg} ${currentColor.hoverBg} ${
                isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
            } ${isHovered && !isTouch ? 'shadow-xl scale-105' : 'shadow-lg'} ${
                isPressed ? 'scale-95' : ''
            }`}
            style={{
                transitionDelay: `${index * 150}ms`,
            }}
            onMouseEnter={() => !isTouch && setIsHovered(true)}
            onMouseLeave={() => !isTouch && setIsHovered(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            onClick={onInteract}
        >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

            <div className="relative flex items-start gap-4">
                <div className={`flex-shrink-0 w-14 h-14 ${currentColor.iconBg} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${currentColor.shadow}`}>
                    <Icon name={iconName} className={`w-7 h-7 ${currentColor.iconColor} transition-colors duration-300`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-brand-gray-900 mb-2 group-hover:text-techflex-blue-600 transition-colors duration-300">
                        {title}
                    </h3>
                    <div className="text-brand-gray-600 space-y-1 group-hover:text-brand-gray-700 transition-colors duration-300">
                        {children}
                    </div>
                </div>

                {/* Hover indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-techflex-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300`}>
                    <Icon name="arrow-right" className="w-3 h-3 text-white" />
                </div>
            </div>

            {/* Interactive ripple effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r from-techflex-blue-500/10 to-techflex-orange-500/10 transform ${isPressed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-300 rounded-2xl`} />
            </div>
        </div>
    );
};

// Enhanced form input component
const FormInput: React.FC<{
    type: string;
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    options?: string[];
    placeholder?: string;
}> = ({ type, id, name, label, value, onChange, required, multiline, rows, options, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);

    useEffect(() => {
        setHasContent(value.length > 0);
    }, [value]);

    const inputClasses = `w-full px-4 py-3 text-base border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm
        ${isFocused
        ? 'border-techflex-orange-400 ring-2 ring-techflex-orange-100 shadow-lg scale-[1.02]'
        : hasContent
            ? 'border-techflex-blue-300 shadow-md'
            : 'border-brand-gray-200 hover:border-brand-gray-300'
    }
        focus:outline-none transform-gpu`;

    const labelClasses = `absolute left-4 transition-all duration-300 pointer-events-none font-medium
        ${isFocused || hasContent
        ? '-top-2.5 text-sm bg-white px-2 rounded-md text-techflex-orange-600'
        : 'top-3 text-base text-brand-gray-500'
    }`;

    if (multiline) {
        return (
            <div className="relative">
                <label htmlFor={id} className={labelClasses}>
                    {label} {required && <span className="text-techflex-orange-500">*</span>}
                </label>
                <textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={rows}
                    placeholder={placeholder}
                    className={`${inputClasses} resize-none`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>
        );
    }

    if (options) {
        return (
            <div className="relative">
                <label htmlFor={id} className={labelClasses}>
                    {label} {required && <span className="text-techflex-orange-500">*</span>}
                </label>
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={inputClasses}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className="relative">
            <label htmlFor={id} className={labelClasses}>
                {label} {required && <span className="text-techflex-orange-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={inputClasses}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </div>
    );
};

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onSendMessage }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'General Inquiry',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitProgress, setSubmitProgress] = useState(0);
    const [heroRef, heroVisible] = useIntersectionObserver();
    const [contentRef, contentVisible] = useIntersectionObserver();
    const [tiltRef, tilt] = useTiltEffect();
    const isTouch = useTouch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
            setSubmitProgress(i);
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        setTimeout(() => {
            onSendMessage();
            setIsSubmitting(false);
            setSubmitProgress(0);
        }, 500);
    };

    const contactInfoItems = [
        {
            iconName: "map-pin",
            title: "Visit Our Office",
            content: (
                <>
                    <p className="font-semibold">123 Kytriq Avenue</p>
                    <p>Innovate City, CA 94043</p>
                    <p className="text-sm mt-2 text-techflex-blue-600">Open Mon-Fri 9AM-6PM</p>
                </>
            ),
            onInteract: () => window.open('https://maps.google.com', '_blank')
        },
        {
            iconName: "envelope",
            title: "Email Us",
            content: (
                <>
                    <p><a href="mailto:contact@kytriq.com" className="hover:text-techflex-orange-600 transition-colors duration-200 font-medium">contact@kytriq.com</a> <span className="text-sm text-brand-gray-400">(General)</span></p>
                    <p><a href="mailto:sales@kytriq.com" className="hover:text-techflex-orange-600 transition-colors duration-200 font-medium">sales@kytriq.com</a> <span className="text-sm text-brand-gray-400">(Sales)</span></p>
                    <p><a href="mailto:support@kytriq.com" className="hover:text-techflex-orange-600 transition-colors duration-200 font-medium">support@kytriq.com</a> <span className="text-sm text-brand-gray-400">(Support)</span></p>
                </>
            ),
            onInteract: () => window.location.href = 'mailto:contact@kytriq.com'
        },
        {
            iconName: "device-phone-mobile",
            title: "Call Us",
            content: (
                <>
                    <p className="text-xl font-bold text-brand-gray-900">(123) 456-7890</p>
                    <p className="text-sm text-brand-gray-500 mt-1">Available 24/7 for support</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Online now</span>
                    </div>
                </>
            ),
            onInteract: () => window.location.href = 'tel:+11234567890'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50">
            {/* Enhanced Hero Section */}
            <div
                ref={heroRef as React.RefObject<HTMLDivElement>}
                className="relative bg-gradient-to-br from-techflex-blue-600 via-techflex-blue-700 to-techflex-blue-800 text-white py-20 sm:py-28 overflow-hidden"
            >
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-techflex-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-techflex-orange-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
                    backgroundSize: '50px 50px'
                }}></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className={`text-center max-w-4xl mx-auto transform transition-all duration-1000 ${
                        heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/30">
                            <div className="w-2 h-2 bg-techflex-orange-400 rounded-full animate-pulse"></div>
                            We're here to help
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                            <span className="bg-gradient-to-r from-white via-brand-gray-100 to-techflex-orange-200 bg-clip-text text-transparent">
                                Get in Touch
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-brand-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
                            We're here to help and answer any question you might have.
                            <span className="block mt-2 text-techflex-orange-200 font-medium">
                                We look forward to hearing from you.
                            </span>
                        </p>

                        {/* Quick stats */}
                        <div className="flex flex-wrap justify-center gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-techflex-orange-300">24/7</div>
                                <div className="text-sm text-brand-gray-300">Support</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-techflex-orange-300">&lt;2h</div>
                                <div className="text-sm text-brand-gray-300">Response Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-techflex-orange-300">98%</div>
                                <div className="text-sm text-brand-gray-300">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div
                ref={contentRef as React.RefObject<HTMLDivElement>}
                className="py-16 sm:py-20 lg:py-24"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">

                        {/* Left Column: Contact Info & Interactive Map */}
                        <div className={`space-y-10 transform transition-all duration-1000 ${
                            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl sm:text-4xl font-bold text-brand-gray-900 mb-4">
                                    Let's Connect
                                </h2>
                                <p className="text-lg text-brand-gray-600 max-w-md mx-auto lg:mx-0">
                                    Choose the best way to reach us. We're always ready to help.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {contactInfoItems.map((item, index) => (
                                    <ContactInfoItem
                                        key={index}
                                        iconName={item.iconName}
                                        title={item.title}
                                        index={index}
                                        onInteract={item.onInteract}
                                    >
                                        {item.content}
                                    </ContactInfoItem>
                                ))}
                            </div>

                            {/* Enhanced Interactive Map */}
                            <div className="group relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-gray-100 to-brand-gray-200 aspect-[4/3] cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-500/20 to-techflex-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=600"
                                    alt="Kytriq Office Location"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h4 className="font-bold text-brand-gray-900 mb-1">Our Office</h4>
                                        <p className="text-sm text-brand-gray-600">123 Kytriq Avenue, Innovate City</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6">
                                    <div className="w-12 h-12 bg-techflex-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Icon name="map-pin" className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Enhanced Contact Form */}
                        <div
                            ref={tiltRef as React.RefObject<HTMLDivElement>}
                            className={`transform transition-all duration-1000 ${
                                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{
                                transform: !isTouch ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
                                transition: 'transform 0.3s ease-out',
                                transitionDelay: '200ms'
                            }}
                        >
                            <div className="relative bg-white/95 backdrop-blur-sm p-8 sm:p-10 lg:p-12 rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                                {/* Animated background gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-50/50 via-white to-techflex-orange-50/50 opacity-60"></div>

                                {/* Form header */}
                                <div className="relative mb-8 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-techflex-orange-100 rounded-full text-sm font-medium text-techflex-orange-600 mb-4">
                                        <Icon name="envelope" className="w-4 h-4" />
                                        Send us a message
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-gray-900 mb-2">
                                        Let's Start a Conversation
                                    </h2>
                                    <p className="text-brand-gray-600">
                                        Fill out the form below and we'll get back to you within 24 hours.
                                    </p>
                                </div>

                                {/* Enhanced Form */}
                                <form onSubmit={handleSubmit} className="relative space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <FormInput
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            label="Full Name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                        <FormInput
                                            type="email"
                                            id="email"
                                            name="email"
                                            label="Email Address"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <FormInput
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            label="Phone Number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="(123) 456-7890"
                                        />
                                        <FormInput
                                            type="select"
                                            id="inquiryType"
                                            name="inquiryType"
                                            label="How can we help?"
                                            value={formData.inquiryType}
                                            onChange={handleInputChange}
                                            options={['General Inquiry', 'Sales Question', 'Support Request', 'Partnership', 'Technical Support', 'Billing Question']}
                                            required
                                        />
                                    </div>

                                    <FormInput
                                        type="textarea"
                                        id="message"
                                        name="message"
                                        label="Message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        multiline
                                        rows={5}
                                        placeholder="Tell us more about your inquiry..."
                                    />

                                    {/* Enhanced Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group relative w-full bg-gradient-to-r from-techflex-orange-500 to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                                        >
                                            {/* Progress bar */}
                                            {isSubmitting && (
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-100"
                                                    style={{ width: `${submitProgress}%` }}
                                                />
                                            )}

                                            <span className="relative flex items-center justify-center gap-2">
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Sending... ({submitProgress}%)
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Icon name="arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="flex items-center justify-center gap-6 pt-6 text-sm text-brand-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Icon name="shield-check" className="w-4 h-4 text-green-500" />
                                            Secure & Private
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Icon name="clock" className="w-4 h-4 text-techflex-blue-500" />
                                            Quick Response
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Additional CTA Section */}
                    <div className="mt-20 text-center">
                        <div className="bg-gradient-to-r from-techflex-blue-600 to-techflex-blue-700 rounded-3xl p-12 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-techflex-orange-500/20 to-transparent"></div>
                            <div className="relative">
                                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                                    Need immediate assistance?
                                </h3>
                                <p className="text-lg text-brand-gray-200 mb-8 max-w-2xl mx-auto">
                                    Our support team is available 24/7 to help you with any urgent questions or technical issues.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => window.location.href = 'tel:+11234567890'}
                                        className="bg-white text-techflex-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-brand-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <Icon name="device-phone-mobile" className="w-5 h-5" />
                                        Call Now
                                    </button>
                                    <button
                                        onClick={() => onNavigate('support')}
                                        className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-techflex-blue-600 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                                    >
                                        <Icon name="chat-bubble-left-right" className="w-5 h-5" />
                                        Live Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;