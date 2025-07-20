
import React from 'react';
import Icon from '../components/Icon';

interface ElectronicsPageProps {
    onNavigate: (page: string) => void;
}

const CapabilityCard: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-brand-gray-100 text-center h-full">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-techflex-orange-100 mb-6 mx-auto">
            <Icon name={iconName} className="h-8 w-8 text-techflex-orange" />
        </div>
        <h3 className="text-xl font-bold text-brand-gray-900">{title}</h3>
        <p className="mt-3 text-brand-gray-600">{children}</p>
    </div>
);

const ProcessStep: React.FC<{ iconName: string; number: string; title: string; children: React.ReactNode }> = ({ iconName, number, title, children }) => (
    <div className="relative pl-12">
        <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-techflex-blue-100 ring-4 ring-white">
            <Icon name={iconName} className="h-5 w-5 text-techflex-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-brand-gray-900">{number}. {title}</h3>
        <p className="mt-2 text-base text-brand-gray-600">{children}</p>
    </div>
);


const ElectronicsPage: React.FC<ElectronicsPageProps> = ({ onNavigate }) => {

    const capabilities = [
        { icon: 'cpu-chip', title: 'PCB Design & Layout', description: 'Expert design of single, double, and multi-layer printed circuit boards optimized for performance and manufacturability.' },
        { icon: 'code', title: 'Firmware Development', description: 'Custom firmware for microcontrollers (ARM, AVR, ESP32) to bring your hardware to life with robust functionality.' },
        { icon: 'cube-transparent', title: 'Prototyping & Assembly', description: 'Rapid prototyping services, including 3D printing and hand-assembly, to quickly iterate on your designs.' },
        { icon: 'wrench-screwdriver', title: 'Sourcing & Manufacturing', description: 'We manage the entire supply chain, from component sourcing to full-scale manufacturing and quality control.' },
    ];
    
    const processSteps = [
        { icon: 'light-bulb', title: 'Ideation & Feasibility', description: 'We collaborate with you to refine your idea, define specifications, and assess technical and commercial feasibility.' },
        { icon: 'clipboard-document-list', title: 'Schematic & PCB Design', description: 'Our engineers create detailed schematics and layout the PCB, ensuring signal integrity and thermal management.' },
        { icon: 'beaker', title: 'Prototyping & Testing', description: 'We build and assemble functional prototypes for rigorous testing, validation, and design refinement.' },
        { icon: 'cpu-chip', title: 'Firmware Integration', description: 'The custom firmware is flashed and integrated with the hardware, followed by comprehensive system testing.' },
        { icon: 'shield-check', title: 'Validation & QA', description: 'Our quality assurance process guarantees your product meets the highest standards of reliability and performance.' },
        { icon: 'rocket-launch', title: 'Manufacturing & Scale', description: 'Once validated, we oversee the transition to mass production with our trusted manufacturing partners.' },
    ];
    
    const industries = ['Consumer Electronics', 'IoT & Smart Home', 'Medical Devices', 'Industrial Automation', 'Automotive'];

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-techflex-blue text-white py-24 sm:py-32">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092921462-69f7837a77b8?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-techflex-blue/90 to-techflex-blue"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Innovative Electronics Solutions</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-200">
                        From concept to production, we engineer custom hardware and embedded systems that power the future.
                    </p>
                    <div className="mt-10">
                        <a href="#contact" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                            Bring Your Idea to Life
                        </a>
                    </div>
                </div>
            </div>

            {/* Capabilities Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Our Core Capabilities</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            We offer end-to-end services to handle every aspect of your electronics project.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {capabilities.map((item) => (
                            <CapabilityCard key={item.title} iconName={item.icon} title={item.title}>
                                {item.description}
                            </CapabilityCard>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Our Process Section */}
             <section className="bg-brand-gray-100 py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Our Development Process</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           A streamlined journey from a simple idea to a market-ready product.
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
            
            {/* Industries Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Industries We Serve</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            We've delivered innovative hardware solutions across a diverse range of sectors.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {industries.map(industry => (
                            <span key={industry} className="bg-white text-techflex-blue-800 text-base font-semibold px-6 py-3 rounded-full border border-brand-gray-200 shadow-sm">
                                {industry}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="bg-techflex-blue">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-extrabold tracking-tight">Have a Hardware Project in Mind?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-200">
                            We're here to help you navigate the complexities of hardware development. Let's discuss your project.
                        </p>
                        <div className="mt-8">
                             <a href="#" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                                Request a Free Quote
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ElectronicsPage;
