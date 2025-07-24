import React from 'react';

const SecurityPage: React.FC = () => {
    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Security</h1>
                        <p className="mt-4 text-lg text-brand-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>

                    <article className="prose prose-lg max-w-none text-brand-gray-700 leading-relaxed space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">1. Our Commitment to Security</h2>
                            <p>
                                At Kytriq, we take the security of your data and our systems very seriously. We employ industry-standard security measures and best practices to protect your information and ensure the reliability of our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">2. Data Protection Measures</h2>
                            <p>
                                We implement multiple layers of security to protect your data:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>
                                    <strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using TLS/SSL. We also encrypt sensitive data at rest.
                                </li>
                                <li>
                                    <strong>Access Controls:</strong> We implement strict access controls and authentication mechanisms to ensure only authorized personnel can access sensitive systems and data.
                                </li>
                                <li>
                                    <strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments to identify and address potential security issues.
                                </li>
                                <li>
                                    <strong>Secure Development:</strong> Our development practices include security reviews, code scanning, and testing to identify and fix security vulnerabilities.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">3. Infrastructure Security</h2>
                            <p>
                                Our infrastructure is designed with security in mind:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>
                                    <strong>Secure Hosting:</strong> We use industry-leading cloud providers with robust security certifications and compliance programs.
                                </li>
                                <li>
                                    <strong>Network Security:</strong> Our network architecture includes firewalls, intrusion detection systems, and regular security monitoring.
                                </li>
                                <li>
                                    <strong>Redundancy:</strong> We maintain redundant systems and regular backups to ensure data availability and business continuity.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">4. Compliance</h2>
                            <p>
                                We adhere to relevant security standards and regulations:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>
                                    <strong>GDPR Compliance:</strong> We follow GDPR requirements for EU data subjects.
                                </li>
                                <li>
                                    <strong>Industry Standards:</strong> We follow industry best practices and frameworks such as NIST and ISO 27001.
                                </li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">5. Security Incident Response</h2>
                            <p>
                                We have a comprehensive incident response plan in place to quickly address any security incidents:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>
                                    <strong>Monitoring:</strong> We continuously monitor our systems for suspicious activities.
                                </li>
                                <li>
                                    <strong>Response Team:</strong> Our dedicated security team is ready to respond to incidents 24/7.
                                </li>
                                <li>
                                    <strong>Notification:</strong> We will notify affected users in accordance with applicable laws and regulations.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">6. Security Recommendations for Users</h2>
                            <p>
                                We recommend the following security practices for our users:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Use strong, unique passwords for your Kytriq account.</li>
                                <li>Enable two-factor authentication when available.</li>
                                <li>Keep your devices and software up to date with security patches.</li>
                                <li>Be cautious of phishing attempts and verify the authenticity of communications.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">7. Contact Us</h2>
                            <p>
                                If you have any questions about our security practices or want to report a security concern, please contact our security team at: <a href="mailto:security@kytriq.com" className="text-techflex-blue hover:underline">security@kytriq.com</a>.
                            </p>
                        </section>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;