
import React from 'react';
import Icon from '../components/Icon';

interface SoftwareDevelopmentPageProps {
    onNavigate: (page: string) => void;
}

const ProcessStep: React.FC<{ iconName: string; number: string; title: string; children: React.ReactNode }> = ({ iconName, number, title, children }) => (
    <div className="relative pl-12">
        <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-techflex-blue-100 ring-4 ring-white">
            <Icon name={iconName} className="h-5 w-5 text-techflex-blue" />
        </div>
        <h3 className="text-xl font-bold text-brand-gray-900">{number}. {title}</h3>
        <p className="mt-2 text-base text-brand-gray-600">{children}</p>
    </div>
);

const WhatWeBuildCard: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-brand-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-techflex-blue-100 mb-6">
            <Icon name={iconName} className="h-8 w-8 text-techflex-blue" />
        </div>
        <h3 className="text-2xl font-bold text-brand-gray-900">{title}</h3>
        <p className="mt-3 text-brand-gray-600">{children}</p>
    </div>
);

const SoftwareDevelopmentPage: React.FC<SoftwareDevelopmentPageProps> = ({ onNavigate }) => {

    const processSteps = [
        { icon: 'compass', title: 'Discovery & Strategy', description: 'We start by understanding your vision, goals, and target audience. We conduct market research and define a clear product roadmap.' },
        { icon: 'pencil', title: 'UI/UX Design', description: 'Our designers create intuitive wireframes and stunning, high-fidelity mockups that focus on user experience.' },
        { icon: 'code', title: 'Development', description: 'Our expert engineers write clean, efficient, and scalable code using modern technologies and agile methodologies.' },
        { icon: 'shield-check', title: 'Testing & QA', description: 'Rigorous testing is performed at every stage to ensure a bug-free, high-performance, and secure application.' },
        { icon: 'rocket-launch', title: 'Deployment', description: 'We handle seamless deployment to the cloud, ensuring your application is live and available to users.' },
        { icon: 'refresh', title: 'Support & Growth', description: 'Our partnership doesn\'t end at launch. We provide ongoing support, maintenance, and help you scale as you grow.' },
    ];

    const whatWeBuildItems = [
        { icon: 'computer-desktop', title: 'Custom Web Applications', description: 'Scalable and responsive web apps, from complex dashboards to customer-facing platforms.' },
        { icon: 'device-phone-mobile', title: 'Native & Hybrid Mobile Apps', description: 'Engaging iOS and Android applications that deliver a seamless user experience on any device.' },
        { icon: 'briefcase', title: 'Enterprise Software (ERP/CRM)', description: 'Custom solutions to streamline your internal operations, from resource planning to customer relationship management.' },
        { icon: 'link', title: 'API Development & Integration', description: 'Robust and secure APIs to connect your software systems, services, and third-party applications.' },
    ];

    const techCategories = [
        { name: 'Frontend', techs: 'React, Vue, Svelte, Tailwind CSS' },
        { name: 'Backend', techs: 'Node.js, Python, Java, Go' },
        { name: 'Mobile', techs: 'React Native, Swift, Kotlin' },
        { name: 'Database', techs: 'PostgreSQL, MongoDB, Redis' },
        { name: 'Cloud & DevOps', techs: 'AWS, Docker, Kubernetes' },
    ];

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-white shadow-sm text-brand-gray-900 py-24 sm:py-32">
                <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-gray-900">Bespoke Software Development</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-600">
                        From concept to launch, we build scalable, secure, and user-centric software tailored to your business needs.
                    </p>
                    <div className="mt-10">
                        <a href="#contact" className="bg-techflex-blue hover:bg-techflex-blue-600 text-white font-bold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:scale-105">
                            Start Your Project
                        </a>
                    </div>
                </div>
            </div>

            {/* Our Process Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Our Proven Process</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            We follow a structured, transparent process to ensure your project is a success from start to finish.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-4 h-full border-l-2 border-dashed border-brand-gray-300"></div>
                            <div className="space-y-12">
                                {processSteps.map((step, index) => (
                                    <ProcessStep key={step.title} iconName={step.icon} number={`0${index + 1}`} title={step.title}>
                                        {step.description}
                                    </ProcessStep>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Build Section */}
            <section className="bg-brand-gray-100 py-20 sm:py-28">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Solutions We Engineer</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            We build a wide range of software applications to solve your most complex challenges.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whatWeBuildItems.map((item) => (
                            <WhatWeBuildCard key={item.title} iconName={item.icon} title={item.title}>
                                {item.description}
                            </WhatWeBuildCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Our Technology Stack</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            We use modern, battle-tested technologies to build reliable and high-performing applications.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-brand-gray-200">
                        {techCategories.map((cat, index) => (
                             <div key={cat.name} className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center py-4 ${index < techCategories.length - 1 ? 'border-b border-brand-gray-100' : ''}`}>
                                <h3 className="w-full sm:w-1/4 font-bold text-techflex-blue text-lg flex-shrink-0">{cat.name}</h3>
                                <p className="text-brand-gray-600">{cat.techs}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold tracking-tight text-brand-gray-900">Ready to build your next big idea?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            Let's talk about your project. We offer a free, no-obligation consultation to discuss your needs and how we can help.
                        </p>
                        <div className="mt-8">
                             <a href="#" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:scale-105">
                                Get a Free Consultation
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SoftwareDevelopmentPage;
