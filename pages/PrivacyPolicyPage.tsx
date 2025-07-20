
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Privacy Policy</h1>
                        <p className="mt-4 text-lg text-brand-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>

                    <article className="prose prose-lg max-w-none text-brand-gray-700 leading-relaxed space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">1. Introduction</h2>
                            <p>
                                Welcome to Kytriq ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or purchase our products. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">2. Information We Collect</h2>
                            <p>
                                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>
                                    <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.
                                </li>
                                <li>
                                    <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                                </li>
                                <li>
                                    <strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase or order from the Site. All financial information is stored by our payment processor.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">3. How We Use Your Information</h2>
                            <p>
                                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Create and manage your account.</li>
                                <li>Process your orders and manage your cart.</li>
                                <li>Email you regarding your account or order.</li>
                                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                                <li>Request feedback and contact you about your use of the Site.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">4. Disclosure of Your Information</h2>
                            <p>
                                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>
                                    <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                                </li>
                                <li>
                                    <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">5. Data Security</h2>
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">6. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain processing of your personal information. To exercise these rights, please contact us using the contact information provided below.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">7. Changes to This Privacy Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-brand-gray-800">8. Contact Us</h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@kytriq.com" className="text-techflex-blue hover:underline">privacy@kytriq.com</a>.
                            </p>
                        </section>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
