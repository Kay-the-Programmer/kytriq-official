
import React from 'react';
import { useCart } from '../contexts/CartContext';
import Icon from './Icon';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    onNavigate('checkout');
    onClose();
  };


  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-brand-gray-900 bg-opacity-75" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className={`relative w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-brand-gray-900" id="slide-over-title">Shopping cart</h2>
                <div className="ml-3 flex h-7 items-center">
                  <button type="button" className="-m-2 p-2 text-brand-gray-400 hover:text-brand-gray-500" onClick={onClose}>
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  {cartItems.length > 0 ? (
                    <ul role="list" className="-my-6 divide-y divide-brand-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.product.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-brand-gray-200">
                            <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover object-center" />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-brand-gray-900">
                                <h3>{item.product.name}</h3>
                                <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-brand-gray-500">{item.product.category}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border border-brand-gray-300 rounded-md">
                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-brand-gray-500 hover:text-brand-gray-700">-</button>
                                <p className="px-2">{item.quantity}</p>
                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-brand-gray-500 hover:text-brand-gray-700">+</button>
                              </div>
                              <div className="flex">
                                <button type="button" className="font-medium text-techflex-orange hover:text-techflex-orange-600 flex items-center gap-1" onClick={() => removeFromCart(item.product.id)}>
                                  <Icon name="trash" className="h-4 w-4" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center">
                        <Icon name="cart" className="mx-auto h-12 w-12 text-brand-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-brand-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-brand-gray-500">Start adding some products to see them here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
                <div className="border-t border-brand-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-brand-gray-900">
                        <p>Subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-brand-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                        <button onClick={handleCheckout} className="w-full flex items-center justify-center rounded-full border border-transparent bg-techflex-orange px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-techflex-orange-600">
                          Checkout
                        </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-brand-gray-500">
                        <p>
                        or{' '}
                        <button type="button" className="font-medium text-techflex-blue hover:text-techflex-blue-600" onClick={onClose}>
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </button>
                        </p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
