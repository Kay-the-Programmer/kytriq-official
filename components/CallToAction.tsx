import React from 'react';

interface CallToActionProps {
    onNavigate: (page: string) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onNavigate }) => {
    return (
        <section className="py-0 sm:py-0 bg-brand-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

                {/* top Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {/* SnapCart Card */}
                    <div className="bg-brand-gray-100 rounded-3xl overflow-hidden shadow-md w-full max-w-full sm:max-w-sm flex flex-col">
                        <div className="p-2">
                            <div
                                className="w-full h-[300px] rounded-2xl bg-cover bg-center"
                                style={{ backgroundImage: "url('/images/snapcart-img.jpg')" }}
                            ></div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-gray-900">SnapCart is Your Business Companion</h3>
                            <p className="mt-2 text-gray-700">
                                Smart sales and inventory tracking — scan, sell, and simplify retail from your phone.
                            </p>
                            <div className="mt-auto pt-6">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate('services');
                                    }}
                                    className="inline-block bg-techflex-blue-500 hover:bg-techflex-blue text-white font-bold py-2 px-5 rounded-xl transition-all duration-300"
                                >
                                    Get Started
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Trade-in Card */}
                    <div className="bg-brand-gray-100 rounded-3xl overflow-hidden shadow-md w-full max-w-full sm:max-w-sm flex flex-col">
                        <div className="p-2">
                            <div
                                className="w-full h-[300px] rounded-2xl bg-cover bg-center"
                                style={{ backgroundImage: "url('/images/tradein-img.jpg')" }}
                            ></div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-gray-900">Up to K2000 cash back with trade-in</h3>
                            <p className="mt-2 text-gray-700">
                                Buy a laptop and get cashback plus our free software when you trade in an eligible device.
                            </p>
                            <div className="mt-auto pt-6">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate('services');
                                    }}
                                    className="inline-block bg-techflex-blue-500 hover:bg-techflex-blue text-white font-bold py-2 px-5 rounded-xl transition-all duration-300"
                                >
                                    Shop now
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Smartphones Card */}
                    <div className="bg-brand-gray-100 rounded-3xl overflow-hidden shadow-md w-full max-w-full sm:max-w-sm flex flex-col">
                        <div className="p-2">
                            <div
                                className="w-full h-[300px] rounded-2xl bg-cover bg-center"
                                style={{ backgroundImage: "url('/images/smartphone.jpg')" }}
                            ></div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-gray-900">Smartphones and Accessories</h3>
                            <p className="mt-2 text-gray-700">
                                Find the smartphone and gear that match your lifestyle and look.
                            </p>
                            <div className="mt-auto pt-6">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate('services');
                                    }}
                                    className="inline-block bg-techflex-blue-500 hover:bg-techflex-blue text-white font-bold py-2 px-5 rounded-xl transition-all duration-300"
                                >
                                    Shop now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main CTA Card */}
                <div className="flex flex-col lg:flex-row shadow-md bg-brand-gray-100 rounded-3xl overflow-hidden">
                    <div className="lg:w-1/2 w-full p-2">
                        <div
                            className="h-[300px] md:h-[600px] sm:h-[300px] bg-[url('/images/cta-bg.jpg')] bg-cover bg-center rounded-2xl"
                        />
                    </div>
                    <div className="lg:w-1/2 w-full p-6 sm:p-10 flex flex-col justify-between text-right">
                        <p className="mt-4 text-base text-brand-gray-600">Business</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-gray-900 tracking-tight">
                            Let us take care of the numbers — so you can take care of your customers
                        </h3>
                        <p className="mt-4 text-base text-brand-gray-600">
                            Our software simplifies your back-office operations, giving you more time to focus on what matters most.
                        </p>
                        <div className="mt-6">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate('softwareDevelopment');
                                }}
                                className="inline-block bg-techflex-blue-500 hover:bg-techflex-blue-600 text-white font-bold py-3 px-6 rounded-[35px] transition-all duration-300"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CallToAction;
