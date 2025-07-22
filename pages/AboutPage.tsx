import React from 'react';
import Icon from '../components/Icon';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

const ValueCard: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-brand-gray-100 h-full group">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-techflex-blue-100 mb-6 transition-transform duration-300 group-hover:scale-110">
            <Icon name={iconName} className="h-8 w-8 text-techflex-blue" />
        </div>
        <h3 className="text-2xl font-semibold text-brand-gray-900">{title}</h3>
        <p className="mt-3 text-brand-gray-600">{children}</p>
    </div>
);

const TimelineItem: React.FC<{ iconName: string; year: string; title: string; children: React.ReactNode; isLast?: boolean }> = ({ iconName, year, title, children, isLast = false }) => (
    <div className="relative pl-12">
        {!isLast && <div className="absolute left-4 top-10 h-full border-l-2 border-dashed border-brand-gray-300"></div>}
        <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-techflex-blue-100 ring-8 ring-white">
            <Icon name={iconName} className="h-5 w-5 text-techflex-blue" />
        </div>
        <div className="flex items-center flex-wrap gap-4 mt-2">
            <span className="bg-techflex-blue text-white text-sm font-medium px-3 py-1 rounded-full">{year}</span>
            <h3 className="text-lg sm:text-xl font-bold text-brand-gray-900">{title}</h3>
        </div>
        <p className="mt-2 text-brand-gray-600">{children}</p>
    </div>
);

const TeamMemberCard: React.FC<{ imageUrl: string; name: string; title: string; }> = ({ imageUrl, name, title }) => (
    <div className="text-center">
        <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-brand-gray-900">{name}</h3>
        <p className="text-techflex-blue font-medium">{title}</p>
    </div>
);

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const values = [
        { icon: 'light-bulb', title: 'Innovation', description: "We constantly push the boundaries of what's possible, embracing new technologies and creative thinking to solve complex problems." },
        { icon: 'shield-check', title: 'Quality', description: "Excellence is not an act, but a habit. We are committed to delivering polished, reliable, and robust products that stand the test of time." },
        { icon: 'users', title: 'Partnership', description: "Your success is our success. We build lasting relationships based on trust, transparency, and collaborative-spirited teamwork." },
        { icon: 'scale', title: 'Integrity', description: "We operate with unwavering honesty and a strong moral compass. Doing the right thing is the only way we do business." },
    ];

    const timeline = [
        { icon: 'flag', year: '2020', title: 'Kytriq is Born', description: 'Founded in a small garage with a big dream: to seamlessly merge the worlds of custom software and cutting-edge hardware.' },
        { icon: 'rocket-launch', year: '2021', title: 'First Product Launch', description: 'We launched Synergy, our first all-in-one business management software, to critical acclaim from early adopters.' },
        { icon: 'cpu-chip', year: '2023', title: 'Hardware Expansion', description: 'Expanded our capabilities into electronics design, launching the NebulaBook Pro and our line of smart accessories.' },
        { icon: 'star', year: '2024', title: 'Milestone Achievement', description: 'Celebrated serving over 10,000 customers worldwide and doubled the size of our passionate, innovative team.' },
    ];

    const team = [
        { name: 'Jane Doe', title: 'Founder & CEO', imageUrl: 'https://i.pravatar.cc/300?u=jane_doe_ceo' },
        { name: 'John Smith', title: 'Chief Technology Officer', imageUrl: 'https://i.pravatar.cc/300?u=john_smith_cto' },
        { name: 'Emily White', title: 'Head of Design', imageUrl: 'https://i.pravatar.cc/300?u=emily_white_design' },
    ];

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-white shadow-sm text-brand-gray-900 py-24 sm:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-gray-900">We Are Kytriq.</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-600">
                        Pioneering the intersection of software and hardware to build a smarter, more connected future.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <section className="py-20 sm:py-28 text-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-base font-semibold tracking-wider uppercase text-techflex-blue">Our Mission</h2>
                    <p className="mt-4 text-3xl md:text-4xl font-extrabold text-brand-gray-900 max-w-4xl mx-auto tracking-tight">
                        To empower visionaries with robust, elegant technology solutions, transforming complex challenges into seamless user experiences.
                    </p>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="bg-brand-gray-100 py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Our Core Values</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            The principles that guide our work, our partnerships, and our culture.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((item) => (
                            <ValueCard key={item.title} iconName={item.icon} title={item.title}>
                                {item.description}
                            </ValueCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Our Journey</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            From a humble start to a global presence, here's a look at our story.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-12">
                            {timeline.map((item, index) => (
                                <TimelineItem key={item.title} iconName={item.icon} year={item.year} title={item.title} isLast={index === timeline.length - 1}>
                                    {item.description}
                                </TimelineItem>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-brand-gray-100 py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Meet The Innovators</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                            The passionate leaders driving Kytriq forward.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 justify-center max-w-5xl mx-auto">
                        {team.map((member) => (
                            <TeamMemberCard key={member.name} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-4xl font-extrabold tracking-tight text-brand-gray-900">Want to be part of our story?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                        We're always looking for passionate talent to join our mission. Explore our open positions and help us build the future.
                    </p>
                    <div className="mt-8">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate('careers');
                            }}
                            className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:scale-105"
                        >
                            View Careers
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
