
import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
        <h2 className="text-2xl font-bold text-brand-gray-800">{title}</h2>
        <div className="mt-4 space-y-4">
            {children}
        </div>
    </section>
);

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Terms of Service</h1>
                        <p className="mt-4 text-lg text-brand-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>

                    <article className="prose prose-lg max-w-none text-brand-gray-700 leading-relaxed space-y-8">
                        <Section title="1. Agreement to Terms">
                            <p>By accessing or using our website, services, or products (collectively, the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Site.</p>
                        </Section>

                        <Section title="2. Intellectual Property Rights">
                            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
                        </Section>

                        <Section title="3. User Representations">
                            <p>By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Site for any illegal or unauthorized purpose; and (5) your use of the Site will not violate any applicable law or regulation.</p>
                        </Section>

                        <Section title="4. Products">
                            <p>We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors. All products are subject to availability, and we cannot guarantee that items will be in stock.</p>
                        </Section>

                        <Section title="5. Purchases and Payment">
                             <p>You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us.</p>
                        </Section>

                        <Section title="6. Prohibited Activities">
                            <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
                        </Section>

                        <Section title="7. Term and Termination">
                            <p>These Terms of Service shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON.</p>
                        </Section>
                        
                        <Section title="8. Disclaimer">
                           <p>THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF.</p>
                        </Section>

                        <Section title="9. Limitation of Liability">
                            <p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
                        </Section>

                         <Section title="10. Contact Us">
                            <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:legal@kytriq.com" className="text-techflex-blue hover:underline">legal@kytriq.com</a>.</p>
                        </Section>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
