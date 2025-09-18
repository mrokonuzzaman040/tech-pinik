'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { MapPin, User, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutForm {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Shipping Address
  address: string;
  city: string;
  district: string;
  postalCode: string;
  
  // Payment
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket';
  bkashNumber?: string;
  
  // Additional
  notes: string;
}

const bangladeshiDistricts = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh',
  'Comilla', 'Feni', 'Brahmanbaria', 'Rangamati', 'Noakhali', 'Chandpur', 'Lakshmipur',
  'Chattogram', 'Coxs Bazar', 'Bandarban', 'Bogura', 'Joypurhat', 'Naogaon', 'Natore',
  'Nawabganj', 'Pabna', 'Sirajganj', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat',
  'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Faridpur', 'Gopalganj', 'Madaripur', 'Manikganj',
  'Munshiganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail', 'Kishoreganj', 'Netrokona',
  'Sherpur', 'Jamalpur', 'Jessore', 'Jhenaidah', 'Magura', 'Narail', 'Satkhira', 'Kushtia',
  'Chuadanga', 'Meherpur', 'Bagerhat', 'Pirojpur', 'Jhalokati', 'Patuakhali', 'Barguna',
  'Bhola', 'Habiganj', 'Moulvibazar', 'Sunamganj', 'Gazipur', 'Narayanganj'
];

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    paymentMethod: 'cod',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'phone', 'address', 'city', 'district'];
    
    for (const field of required) {
      if (!formData[field as keyof CheckoutForm]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    if (formData.phone && !/^(\+88)?01[3-9]\d{8}$/.test(formData.phone)) {
      toast.error('Please enter a valid Bangladeshi phone number');
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if ((formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad' || formData.paymentMethod === 'rocket') && !formData.bkashNumber) {
      toast.error('Mobile payment number is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
        },
        payment: {
          method: formData.paymentMethod,
          mobileNumber: formData.bkashNumber,
        },
        totals: {
          subtotal: getTotalPrice(),
          shipping: getTotalPrice() >= 1000 ? 0 : 60,
          total: getTotalPrice() + (getTotalPrice() >= 1000 ? 0 : 60),
        },
        notes: formData.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/order-confirmation/${result.data.orderId}`);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 1000 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City/Upazila *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                        District *
                      </label>
                      <select
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select District</option>
                        {bangladeshiDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bkash"
                      name="paymentMethod"
                      type="radio"
                      value="bkash"
                      checked={formData.paymentMethod === 'bkash'}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="bkash" className="ml-3 block text-sm font-medium text-gray-700">
                      bKash
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="nagad"
                      name="paymentMethod"
                      type="radio"
                      value="nagad"
                      checked={formData.paymentMethod === 'nagad'}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="nagad" className="ml-3 block text-sm font-medium text-gray-700">
                      Nagad
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="rocket"
                      name="paymentMethod"
                      type="radio"
                      value="rocket"
                      checked={formData.paymentMethod === 'rocket'}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="rocket" className="ml-3 block text-sm font-medium text-gray-700">
                      Rocket
                    </label>
                  </div>
                  
                  {(formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad' || formData.paymentMethod === 'rocket') && (
                    <div className="mt-4">
                      <label htmlFor="bkashNumber" className="block text-sm font-medium text-gray-700">
                        Mobile Payment Number *
                      </label>
                      <input
                        type="tel"
                        id="bkashNumber"
                        name="bkashNumber"
                        value={formData.bkashNumber || ''}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Order Notes (Optional)
                </h2>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="mt-16 bg-white rounded-lg shadow-sm px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal ({getTotalItems()} items)</dt>
                <dd className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">{formatPrice(total)}</dd>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-primary-500 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Free shipping on orders over {formatPrice(1000)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}