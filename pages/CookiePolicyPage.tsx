
import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
        <h2 className="text-2xl font-bold text-brand-gray-800">{title}</h2>
        <div className="mt-4 space-y-4">
            {children}
        </div>
    </section>
);

const CookiePolicyPage: React.FC = () => {
    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Cookie Policy</h1>
                        <p className="mt-4 text-lg text-brand-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>

                    <article className="prose prose-lg max-w-none text-brand-gray-700 leading-relaxed space-y-8">
                        <Section title="1. What Are Cookies?">
                            <p>Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
                        </Section>

                        <Section title="2. How We Use Cookies">
                            <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
                            <p>We use cookies to:</p>
                             <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Understand and save your preferences for future visits.</li>
                                <li>Keep track of items in your shopping cart.</li>
                                <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future.</li>
                                <li>Provide and monitor the effectiveness of our services.</li>
                            </ul>
                        </Section>

                        <Section title="3. Types of Cookies We Use">
                            <p>We use the following types of cookies:</p>
                             <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>
                                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.
                                </li>
                                 <li>
                                    <strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                                </li>
                                 <li>
                                    <strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                                </li>
                            </ul>
                        </Section>
                        
                        <Section title="4. Your Choices Regarding Cookies">
                            <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser. Most web browsers allow some control of most cookies through the browser settings.</p>
                            <p>Please note that if you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.</p>
                        </Section>
                        
                        <Section title="5. Changes to This Cookie Policy">
                             <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page. We encourage you to review this Cookie Policy periodically for any changes.</p>
                        </Section>

                         <Section title="6. Contact Us">
                            <p>If you have any questions about our use of cookies, please contact us at: <a href="mailto:privacy@kytriq.com" className="text-techflex-blue hover:underline">privacy@kytriq.com</a>.</p>
                        </Section>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicyPage;
