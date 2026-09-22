import React, { useState } from 'react';
import { ShieldCheck, CreditCard, CheckCircle2, Lock, Smartphone, ExternalLink, X, AlertCircle } from 'lucide-react';
import { Appointment, SquareSettings } from '../types';

interface SquarePaymentModalProps {
  isOpen: boolean;
  appointmentData: {
    serviceName: string;
    duration: number;
    date: string;
    timeSlot: string;
    totalPrice: number;
    clientName: string;
    clientEmail: string;
  };
  squareSettings?: SquareSettings;
  onClose: () => void;
  onPaymentSuccess: (method: 'credit_card' | 'apple_pay' | 'google_pay' | 'cash_app' | 'in_person', txId: string) => void;
}

export const SquarePaymentModal: React.FC<SquarePaymentModalProps> = ({
  isOpen,
  appointmentData,
  squareSettings,
  onClose,
  onPaymentSuccess
}) => {
  const allowOnlineCards = squareSettings ? squareSettings.acceptOnlineCard : true;
  const allowWallets = squareSettings ? (squareSettings.acceptDigitalWallets ?? true) : true;

  const [paymentOption, setPaymentOption] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [postalCode, setPostalCode] = useState('87144');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProcessSquarePayment = () => {
    setIsProcessing(true);
    // Simulate Square Web Payments SDK tokenization and authorization
    setTimeout(() => {
      const generatedTxId = `sq_tx_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      setIsProcessing(false);
      onPaymentSuccess(
        paymentOption === 'apple_pay' ? 'apple_pay' : (paymentOption === 'google_pay' ? 'google_pay' : 'credit_card'),
        generatedTxId
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          disabled={isProcessing}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Square Security Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg tracking-wider">
            ■
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-base">Square Payment Handoff</span>
              <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                {squareSettings?.environment === 'sandbox' ? 'Square Sandbox' : 'Encrypted'}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Official Square Web Payments Integration Point
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-stone-700">
            <span>{appointmentData.serviceName} ({appointmentData.duration} min)</span>
            <span className="font-medium">${appointmentData.totalPrice}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-500">
            <span>Date & Time</span>
            <span>{appointmentData.date} at {appointmentData.timeSlot}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-500">
            <span>Client</span>
            <span>{appointmentData.clientName}</span>
          </div>
          <div className="pt-2 border-t border-stone-200/80 flex justify-between font-bold text-stone-900 text-base">
            <span>Total Due:</span>
            <span className="text-emerald-800 font-bold">${appointmentData.totalPrice}.00</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-4 mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Select Square Checkout Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            {allowOnlineCards && (
              <button
                type="button"
                onClick={() => setPaymentOption('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  paymentOption === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Credit / Debit Card</span>
              </button>
            )}

            {allowWallets && (
              <button
                type="button"
                onClick={() => setPaymentOption('apple_pay')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  paymentOption === 'apple_pay'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-stone-900" />
                <span>Apple Pay / G-Pay</span>
              </button>
            )}
          </div>
        </div>

        {/* Square Card Form Simulated Fields */}
        {paymentOption === 'card' && (
          <div className="space-y-3 mb-6 bg-stone-50/70 p-4 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
              <span>Card Details (Square Hosted Field)</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                <Lock className="w-3 h-3" /> 256-Bit SSL
              </span>
            </div>

            <div>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={cardExp}
                onChange={e => setCardExp(e.target.value)}
                placeholder="MM/YY"
                className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-center"
              />
              <input
                type="text"
                value={cardCvv}
                onChange={e => setCardCvv(e.target.value)}
                placeholder="CVV"
                className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-center"
              />
              <input
                type="text"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                placeholder="Zip"
                className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-center"
              />
            </div>
          </div>
        )}

        {paymentOption === 'apple_pay' && (
          <div className="mb-6 p-4 rounded-xl bg-stone-900 text-white text-center space-y-2">
            <Smartphone className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-sm font-medium">Square Digital Wallet Pass-Through</p>
            <p className="text-xs text-stone-400">
              Click below to authorize with Touch ID / Face ID or Google Pay.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleProcessSquarePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-700 hover:from-emerald-800 hover:to-pink-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to Square...</span>
            </div>
          ) : (
            <>
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>Pay ${appointmentData.totalPrice}.00 with Square</span>
            </>
          )}
        </button>

        {/* Security footnote */}
        <p className="mt-4 text-[11px] text-center text-stone-500">
          Protected by Square PCI-DSS Level 1 compliance. Your card information is tokenized and never stored on private servers.
        </p>
      </div>
    </div>
  );
};
