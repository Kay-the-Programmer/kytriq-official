import React, { useState } from 'react';
import Icon from '../components/Icon';

interface ServicePageProps {
    onNavigate: (page: string, id: string) => void;
}

// Service Card Component
const ServiceCard = ({ icon, title, description, link, linkText, color = 'techflex-blue' }: { 
    icon: string, 
    title: string, 
    description: string, 
    link?: string, 
    linkText?: string,
    color?: string 
}) => (
    <div className={`group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden p-8 border border-brand-gray-100 hover:border-${color}/20 transform hover:-translate-y-1`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700`}></div>

        <div className="relative">
            <div className={`flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-${color} to-${color}-600 text-white mb-6 transform transition-transform group-hover:rotate-3 group-hover:scale-110 duration-300`}>
                <Icon name={icon} className="h-8 w-8" />
            </div>

            <h3 className={`text-xl font-bold text-brand-gray-800 mb-3 group-hover:text-${color} transition-colors duration-300`}>
                {title}
            </h3>

            <p className="text-brand-gray-600 relative z-10 mb-6">
                {description}
            </p>

            {link && linkText && (
                <a 
                    href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = link;
                    }}
                    className={`inline-flex items-center text-${color} font-medium hover:text-${color}-600 transition-colors duration-300`}
                >
                    {linkText}
                    <Icon name="arrow-right" className="ml-1 h-4 w-4" />
                </a>
            )}

            <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Icon name="sparkles" className={`h-12 w-12 text-${color}/10`} />
            </div>
        </div>
    </div>
);

// Testimonial Component
const Testimonial = ({ quote, author, role, company, image }: { 
    quote: string, 
    author: string, 
    role: string, 
    company: string,
    image: string 
}) => (
    <div className="bg-white rounded-2xl shadow-md p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-techflex-blue/5 rounded-full -mr-16 -mt-16"></div>
        
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex justify-center md:justify-start">
                <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-techflex-blue/20">
                    <img src={image} alt={author} className="h-full w-full object-cover" />
                </div>
            </div>
            <div className="md:w-3/4">
                <Icon name="quote" className="h-8 w-8 text-techflex-blue/30 mb-4" />
                <p className="text-brand-gray-700 italic mb-6">{quote}</p>
                <div>
                    <p className="font-bold text-brand-gray-900">{author}</p>
                    <p className="text-sm text-brand-gray-600">{role}, {company}</p>
                </div>
            </div>
        </div>
    </div>
);

// Process Step Component
const ProcessStep = ({ number, title, description }: { number: number, title: string, description: string }) => (
    <div className="relative">
        <div className="flex items-start gap-6">
            <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-techflex-blue text-white text-xl font-bold">
                {number}
            </div>
            <div>
                <h3 className="text-xl font-bold text-brand-gray-800 mb-2">{title}</h3>
                <p className="text-brand-gray-600">{description}</p>
            </div>
        </div>
        {number < 4 && (
            <div className="absolute left-7 top-14 h-16 w-0.5 bg-techflex-blue/20"></div>
        )}
    </div>
);

const ServicePage: React.FC<ServicePageProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('all');

    // Services Data
    const services = [
        {
            icon: "code",
            title: "Custom Software Development",
            description: "Tailored software solutions designed to meet your specific business needs and challenges.",
            link: "/software-development",
            linkText: "Learn about our development process",
            category: "development",
            color: "techflex-blue"
        },
        {
            icon: "shopping-cart",
            title: "E-Commerce Solutions",
            description: "Comprehensive online store setups with payment processing, inventory management, and customer analytics.",
            link: "/ecommerce",
            linkText: "Explore e-commerce options",
            category: "web",
            color: "techflex-orange"
        },
        {
            icon: "device-tablet",
            title: "Mobile App Development",
            description: "Native and cross-platform mobile applications for iOS and Android with seamless user experiences.",
            link: "/mobile-development",
            linkText: "See our mobile portfolio",
            category: "development",
            color: "techflex-blue"
        },
        {
            icon: "chart-bar",
            title: "Business Intelligence",
            description: "Data analytics and visualization tools to help you make informed business decisions.",
            link: "/business-intelligence",
            linkText: "Discover BI solutions",
            category: "analytics",
            color: "techflex-green"
        },
        {
            icon: "cloud",
            title: "Cloud Solutions",
            description: "Secure, scalable cloud infrastructure and migration services for your business applications.",
            link: "/cloud-solutions",
            linkText: "Learn about cloud options",
            category: "infrastructure",
            color: "techflex-purple"
        },
        {
            icon: "shield-check",
            title: "Cybersecurity Services",
            description: "Comprehensive security assessments, implementation, and monitoring to protect your digital assets.",
            link: "/cybersecurity",
            linkText: "Explore security services",
            category: "security",
            color: "techflex-red"
        },
        {
            icon: "cog",
            title: "IT Consulting",
            description: "Strategic technology planning and advisory services to align IT with your business objectives.",
            link: "/consulting",
            linkText: "Book a consultation",
            category: "consulting",
            color: "techflex-blue"
        },
        {
            icon: "support",
            title: "Technical Support",
            description: "24/7 technical assistance and maintenance for all your software and hardware needs.",
            link: "/support",
            linkText: "View support plans",
            category: "support",
            color: "techflex-green"
        }
    ];

    // Filter services based on active tab
    const filteredServices = activeTab === 'all' 
        ? services 
        : services.filter(service => service.category === activeTab);

    // Process Steps
    const processSteps = [
        {
            number: 1,
            title: "Discovery & Planning",
            description: "We begin by understanding your business needs, goals, and challenges through in-depth consultations."
        },
        {
            number: 2,
            title: "Design & Development",
            description: "Our team creates detailed specifications and begins building your solution with regular progress updates."
        },
        {
            number: 3,
            title: "Testing & Refinement",
            description: "Rigorous quality assurance testing ensures your solution works flawlessly before deployment."
        },
        {
            number: 4,
            title: "Deployment & Support",
            description: "We implement your solution and provide ongoing support and maintenance to ensure continued success."
        }
    ];

    // Testimonials
    const testimonials = [
        {
            quote: "The team at Kytriq transformed our business operations with their custom software solution. Their attention to detail and commitment to understanding our needs was exceptional.",
            author: "Sarah Johnson",
            role: "Operations Director",
            company: "Global Logistics Inc.",
            image: "/images/testimonial-1.jpg"
        },
        {
            quote: "Working with Kytriq on our e-commerce platform was a game-changer. Sales have increased by 45% since launch, and the customer feedback has been overwhelmingly positive.",
            author: "Michael Chen",
            role: "CEO",
            company: "Urban Outfitters",
            image: "/images/testimonial-2.jpg"
        },
        {
            quote: "The mobile app developed by Kytriq has revolutionized how we engage with our customers. The intuitive design and robust functionality exceeded our expectations.",
            author: "Jessica Williams",
            role: "Marketing Director",
            company: "TechStart Solutions",
            image: "/images/testimonial-3.jpg"
        }
    ];

    // Service categories
    const categories = [
        { id: 'all', name: 'All Services' },
        { id: 'development', name: 'Development' },
        { id: 'web', name: 'Web Solutions' },
        { id: 'analytics', name: 'Analytics' },
        { id: 'infrastructure', name: 'Infrastructure' },
        { id: 'security', name: 'Security' },
        { id: 'consulting', name: 'Consulting' },
        { id: 'support', name: 'Support' }
    ];

    return (
        <div className="bg-techflex-blue-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-techflex-blue-50 to-white py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue">Professional Services</span>
                        <h1 className="text-3xl py-4 md:text-5xl lg:text-6xl font-bold text-brand-gray-900 tracking-tight leading-tight">
                            Technology solutions that <span className="text-techflex-blue">drive growth</span>
                        </h1>
                        <p className="mt-4 text-xl text-brand-gray-600 max-w-3xl mx-auto">
                            We provide comprehensive technology services to help businesses innovate, optimize, and thrive in today's digital landscape.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate('contact', '');
                                }}
                                className="px-6 py-3 bg-techflex-blue text-white font-medium rounded-xl hover:bg-techflex-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                            >
                                Get Started
                            </a>
                            <a 
                                href="#services" 
                                className="px-6 py-3 bg-white text-techflex-blue font-medium rounded-xl border border-techflex-blue hover:bg-techflex-blue-50 transition-colors duration-300"
                            >
                                Explore Services
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-gradient-to-b from-white to-techflex-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue">Our Expertise</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">Comprehensive Technology Services</h2>
                        <p className="text-lg text-brand-gray-600">
                            From custom software development to cloud solutions, we offer a wide range of services to meet your business needs.
                        </p>
                    </div>

                    {/* Service Categories */}
                    <div className="mb-12">
                        <div className="bg-white p-4 rounded-2xl shadow-md">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {categories.map(category => {
                                    const isActive = activeTab === category.id;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setActiveTab(category.id)}
                                            className={`
                                                relative px-5 py-2.5 rounded-xl font-medium text-sm 
                                                transition-all duration-300 ease-in-out
                                                ${isActive 
                                                    ? 'bg-techflex-blue text-white shadow-md' 
                                                    : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200'
                                                }
                                            `}
                                            aria-pressed={isActive}
                                        >
                                            {category.id === 'all' && (
                                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                                                    <span className={`absolute inline-flex h-full w-full rounded-full ${isActive ? 'bg-white' : 'bg-techflex-blue'} opacity-50 animate-ping`}></span>
                                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isActive ? 'bg-white' : 'bg-techflex-blue'}`}></span>
                                                </span>
                                            )}
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredServices.map((service, index) => (
                            <ServiceCard 
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                link={service.link}
                                linkText={service.linkText}
                                color={service.color}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Process Section */}
            <section className="py-20 bg-gradient-to-br from-techflex-blue-50 via-white to-techflex-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue">Our Approach</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">How We Work</h2>
                        <p className="text-lg text-brand-gray-600">
                            Our proven process ensures we deliver high-quality solutions that meet your business objectives.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 gap-12">
                            {processSteps.map((step) => (
                                <ProcessStep 
                                    key={step.number}
                                    number={step.number}
                                    title={step.title}
                                    description={step.description}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-t from-techflex-blue-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue">Client Success</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">What Our Clients Say</h2>
                        <p className="text-lg text-brand-gray-600">
                            Don't just take our word for it. Here's what our clients have to say about working with us.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Testimonial 
                                key={index}
                                quote={testimonial.quote}
                                author={testimonial.author}
                                role={testimonial.role}
                                company={testimonial.company}
                                image={testimonial.image}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-white to-techflex-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-techflex-blue to-techflex-blue-600 rounded-3xl overflow-hidden shadow-xl">
                        <div className="px-6 py-12 md:p-12 relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
                            
                            <div className="relative z-10 text-center max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your business?</h2>
                                <p className="text-xl text-white/90 mb-10">
                                    Let's discuss how our technology services can help you achieve your business goals.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate('contact', '');
                                        }}
                                        className="px-8 py-4 bg-white text-techflex-blue font-medium rounded-xl hover:bg-techflex-blue-50 transition-colors duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Schedule a Consultation
                                    </a>
                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate('about', '');
                                        }}
                                        className="px-8 py-4 bg-transparent text-white font-medium rounded-xl border border-white hover:bg-white/10 transition-colors duration-300"
                                    >
                                        Learn More About Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicePage;