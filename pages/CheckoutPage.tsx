
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';

interface CheckoutPageProps {
  onPlaceOrder: () => void;
  onNavigate: (page: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onPlaceOrder, onNavigate }) => {
  const { cartItems } = useCart();
  const { currentUser } = useContent();

  const [formState, setFormState] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  useEffect(() => {
    if (currentUser) {
        setFormState(prevState => ({
            ...prevState,
            email: currentUser.email,
            fullName: currentUser.fullName,
            address: currentUser.shippingAddress.address,
            city: currentUser.shippingAddress.city,
            state: currentUser.shippingAddress.state,
            zip: currentUser.shippingAddress.zip,
        }));
    }
  }, [currentUser]);


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + taxes;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    onPlaceOrder();
  };
  
  const FormRow: React.FC<{ children: React.ReactNode}> = ({ children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  );

  const FormField: React.FC<{ label: string; name: string; type?: string; placeholder?: string; required?: boolean }> = 
    ({ label, name, type = 'text', placeholder, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={formState[name as keyof typeof formState]}
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
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Checkout</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                Complete your order by providing your details below.
            </p>
        </div>
        
        {cartItems.length === 0 ? (
             <div className="text-center py-16 border-2 border-dashed border-brand-gray-200 rounded-2xl bg-white">
                <Icon name="cart" className="mx-auto h-12 w-12 text-brand-gray-400" />
                <h3 className="mt-4 text-2xl font-semibold text-brand-gray-700">Your cart is empty</h3>
                <p className="mt-2 text-brand-gray-500">You can't proceed to checkout without any items.</p>
                <button onClick={() => onNavigate('products')} className="mt-6 bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                    Shop Products
                </button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left/Main Column: Forms */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                <div className="space-y-6">
                    {/* Contact Info */}
                    <section>
                        <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Contact Information</h2>
                        <div className="mt-4">
                            <FormField label="Email address" name="email" type="email" placeholder="you@example.com"/>
                        </div>
                    </section>

                    {/* Shipping Address */}
                     <section>
                        <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Shipping Address</h2>
                        <div className="mt-4 space-y-4">
                           <FormField label="Full name" name="fullName" placeholder="John Doe"/>
                           <FormField label="Address" name="address" placeholder="1234 Main St"/>
                           <FormRow>
                                <FormField label="City" name="city" placeholder="Anytown"/>
                                <FormField label="State / Province" name="state" placeholder="CA"/>
                           </FormRow>
                           <FormField label="ZIP / Postal code" name="zip" placeholder="12345"/>
                        </div>
                    </section>

                    {/* Payment Details */}
                    <section>
                        <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4 flex items-center gap-2">
                            <Icon name="lock-closed" className="h-5 w-5 text-brand-gray-500"/>
                            Payment Details
                        </h2>
                         <div className="mt-4 space-y-4">
                           <FormField label="Name on card" name="cardName" placeholder="John Doe"/>
                           <FormField label="Card number" name="cardNumber" placeholder="0000 0000 0000 0000"/>
                           <FormRow>
                               <FormField label="Expiration date (MM/YY)" name="expiryDate" placeholder="MM / YY"/>
                               <FormField label="CVC" name="cvc" placeholder="123"/>
                           </FormRow>
                        </div>
                    </section>
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg sticky top-32">
                     <h2 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Order Summary</h2>
                     <div className="mt-6 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover mr-4" />
                                    <div>
                                        <p className="font-semibold text-brand-gray-800">{item.name}</p>
                                        <p className="text-brand-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-brand-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                     </div>
                     <div className="mt-6 pt-6 border-t border-brand-gray-200 space-y-2">
                         <div className="flex justify-between text-sm text-brand-gray-600">
                             <p>Subtotal</p>
                             <p className="font-medium text-brand-gray-800">${subtotal.toFixed(2)}</p>
                         </div>
                         <div className="flex justify-between text-sm text-brand-gray-600">
                             <p>Shipping</p>
                             <p className="font-medium text-brand-gray-800">${shipping.toFixed(2)}</p>
                         </div>
                          <div className="flex justify-between text-sm text-brand-gray-600">
                             <p>Taxes</p>
                             <p className="font-medium text-brand-gray-800">${taxes.toFixed(2)}</p>
                         </div>
                         <div className="flex justify-between text-base font-bold text-brand-gray-900 pt-2 border-t border-brand-gray-200 mt-2">
                             <p>Total</p>
                             <p>${total.toFixed(2)}</p>
                         </div>
                     </div>
                      <div className="mt-8">
                        <button type="submit" className="w-full bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
