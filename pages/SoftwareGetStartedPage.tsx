
import React, { useState } from 'react';
import { SoftwareProduct } from '../data/software';
import Icon from '../components/Icon';

interface SoftwareGetStartedPageProps {
  software: SoftwareProduct;
  onNavigate: (page: string, id?: string) => void;
  onCompleteSetup: (softwareId: string) => void;
}

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Account', 'Payment', 'Review'];
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        {stepIdx < currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-techflex-orange"></div>
                                </div>
                                <a href="#" className="relative flex h-8 w-8 items-center justify-center bg-techflex-orange rounded-full hover:bg-techflex-orange-700">
                                    <Icon name="check" className="h-5 w-5 text-white" aria-hidden="true" />
                                    <span className="sr-only">{step}</span>
                                </a>
                            </>
                        ) : stepIdx === currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-brand-gray-200"></div>
                                </div>
                                <a href="#" className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-techflex-orange rounded-full" aria-current="step">
                                    <span className="h-2.5 w-2.5 bg-techflex-orange rounded-full" aria-hidden="true"></span>
                                    <span className="sr-only">{step}</span>
                                </a>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-brand-gray-200"></div>
                                </div>
                                <a href="#" className="group relative flex h-8 w-8 items-center justify-center bg-white border-2 border-brand-gray-300 rounded-full hover:border-brand-gray-400">
                                    <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-brand-gray-300" aria-hidden="true"></span>
                                    <span className="sr-only">{step}</span>
                                </a>
                            </>
                        )}
                         <div className="absolute top-10 w-max text-center -translate-x-1/2 left-1/2">
                           <p className={`text-sm font-medium ${stepIdx <= currentStep ? 'text-techflex-blue-600' : 'text-brand-gray-500'}`}>{step}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

const SoftwareGetStartedPage: React.FC<SoftwareGetStartedPageProps> = ({ software, onNavigate, onCompleteSetup }) => {
  const [step, setStep] = useState(0); // 0: Account, 1: Payment, 2: Review
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      companyName: '',
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 2));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteSetup(software.id);
  };
  
  const FormField: React.FC<{ label: string; name: string; type?: string; placeholder?: string; required?: boolean }> = 
    ({ label, name, type = 'text', placeholder, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
        />
    </div>
  );

  return (
    <div className="bg-brand-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">
              Get started with {software.name}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
              Just a few steps to unlock powerful new capabilities for your business.
            </p>
          </div>

          <div className="mb-20 flex justify-center pb-8">
            <Stepper currentStep={step} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left/Main Column: Form Steps */}
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
                {step === 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Account Information</h2>
                    <div className="mt-6 space-y-4">
                      <FormField label="Full Name" name="fullName" placeholder="John Doe" />
                      <FormField label="Email Address" name="email" type="email" placeholder="you@example.com" />
                      <FormField label="Company Name (Optional)" name="companyName" placeholder="Your Company Inc." required={false} />
                    </div>
                  </section>
                )}
                {step === 1 && (
                  <section>
                    <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4 flex items-center gap-2">
                        <Icon name="lock-closed" className="h-5 w-5 text-brand-gray-500"/>
                        Payment Details
                    </h2>
                    <div className="mt-6 space-y-4">
                        <FormField label="Name on card" name="cardName" placeholder="John Doe"/>
                        <FormField label="Card number" name="cardNumber" placeholder="0000 0000 0000 0000"/>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Expiration date (MM/YY)" name="expiryDate" placeholder="MM / YY"/>
                            <FormField label="CVC" name="cvc" placeholder="123"/>
                        </div>
                    </div>
                  </section>
                )}
                {step === 2 && (
                  <section>
                    <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Review Your Setup</h2>
                    <div className="mt-6 space-y-4 text-sm">
                        <div className="bg-brand-gray-50 p-4 rounded-lg border border-brand-gray-200">
                            <h3 className="font-semibold text-brand-gray-700 mb-2">Account Details</h3>
                            <p><span className="text-brand-gray-500 mr-2">Name:</span> <strong>{formData.fullName || 'N/A'}</strong></p>
                            <p><span className="text-brand-gray-500 mr-2">Email:</span> <strong>{formData.email || 'N/A'}</strong></p>
                            {formData.companyName && <p><span className="text-brand-gray-500 mr-2">Company:</span> <strong>{formData.companyName}</strong></p>}
                        </div>
                        <div className="bg-brand-gray-50 p-4 rounded-lg border border-brand-gray-200">
                             <h3 className="font-semibold text-brand-gray-700 mb-2">Payment</h3>
                             <p><span className="text-brand-gray-500 mr-2">Card:</span> <strong>**** **** **** {formData.cardNumber.slice(-4) || 'XXXX'}</strong></p>
                        </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg sticky top-32 border border-brand-gray-200">
                  <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Subscription Summary</h2>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           {software.logoUrl && <Icon name={software.logoUrl} className="h-10 w-10 text-techflex-blue" />}
                           <p className="font-semibold text-brand-gray-800">{software.name}</p>
                        </div>
                        <div>
                            <p className="font-bold text-brand-gray-900 text-lg">${software.price.toFixed(2)}</p>
                            <p className="text-sm text-brand-gray-500 text-right">{software.pricingModel === 'Subscription' ? '/mo' : 'once'}</p>
                        </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-brand-gray-200 space-y-2">
                    <p className="text-xs text-brand-gray-600">You will be billed immediately. You can manage your subscription from your account settings.</p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    {step > 0 && (
                      <button type="button" onClick={prevStep} className="w-full bg-brand-gray-200 hover:bg-brand-gray-300 text-brand-gray-800 font-bold py-3 px-4 rounded-lg transition-all duration-300">
                        Back
                      </button>
                    )}
                    {step < 2 ? (
                      <button type="button" onClick={nextStep} className="w-full bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                        Next
                      </button>
                    ) : (
                      <button type="submit" className="w-full bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                        Complete Setup
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoftwareGetStartedPage;
