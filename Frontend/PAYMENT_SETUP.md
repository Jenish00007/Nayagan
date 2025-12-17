# Payment System Setup - Razorpay Integration

## Overview
The payment system has been updated to use Razorpay instead of Stripe/PayPal. This provides a more localized payment solution for Indian customers with support for UPI, cards, net banking, and other Indian payment methods.

## Changes Made

### 1. Frontend Changes
- **Replaced Stripe/PayPal** with Razorpay integration
- **Updated Payment Component** (`src/components/Payment/Payment.jsx`)
  - Modern, clean UI with Tailwind CSS
  - Payment method selection cards
  - Order summary sidebar
  - Loading states and error handling
- **Removed Stripe Dependencies** from `package.json`
- **Added React Icons** for better UI
- **Updated Server Configuration** to use local backend

### 2. Backend Integration
- **Razorpay Configuration** already exists in `backend/config/razorpay.js`
- **Payment Routes** available at `/v2/payment`
- **Payment Processing** endpoint: `POST /v2/payment/process`
- **Payment Verification** endpoint: `POST /v2/payment/verify`

## Features

### Payment Methods
1. **Razorpay Online Payment**
   - Credit/Debit Cards
   - UPI (Google Pay, PhonePe, etc.)
   - Net Banking
   - Wallets (Paytm, etc.)
   - EMI options

2. **Cash on Delivery**
   - Pay when you receive your order

### UI Features
- **Responsive Design** - Works on mobile and desktop
- **Payment Method Selection** - Visual cards for easy selection
- **Order Summary** - Real-time calculation display
- **Security Indicators** - Trust badges and security notices
- **Loading States** - Clear feedback during payment processing
- **Error Handling** - User-friendly error messages

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the `Multivendor_Frontend` directory:

```env
# Backend Server URL (for development)
REACT_APP_SERVER_URL=http://localhost:8000/v2

# For production, use your actual backend URL
# REACT_APP_SERVER_URL=https://your-backend-domain.com/v2
```

### 2. Backend Environment Variables
Ensure your backend has these environment variables in `backend/config/.env`:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
cd Multivendor_Frontend
npm install
```

### 4. Start Development Server
```bash
npm start
```

## Payment Flow

1. **User selects payment method** (Razorpay or COD)
2. **For Razorpay:**
   - Frontend calls `/v2/payment/process` with order details
   - Backend creates Razorpay payment link
   - Payment link opens in new window
   - User completes payment on Razorpay
   - Order is created after successful payment
3. **For COD:**
   - Order is created directly
   - Payment marked as "Cash on Delivery"

## API Endpoints

### Create Payment Link
```
POST /v2/payment/process
Content-Type: application/json

{
  "amount": 1000,
  "email": "user@example.com",
  "name": "User Name",
  "contact": "9876543210"
}
```

### Verify Payment
```
POST /v2/payment/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

## Security Features

- **Input Validation** - All payment data is validated
- **Signature Verification** - Razorpay signatures are verified
- **HTTPS** - Secure communication (in production)
- **Error Handling** - Comprehensive error handling and logging

## Testing

### Test Cards (Razorpay Test Mode)
- **Success Card**: 4111 1111 1111 1111
- **Failure Card**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI
- Use any valid UPI ID in test mode

## Production Deployment

1. **Update Environment Variables** with production values
2. **Enable HTTPS** for secure communication
3. **Configure Razorpay Webhooks** for payment status updates
4. **Set up proper error monitoring** and logging
5. **Test thoroughly** with real payment scenarios

## Troubleshooting

### Common Issues

1. **Payment Link Not Opening**
   - Check Razorpay credentials
   - Verify backend is running
   - Check browser popup blockers

2. **Payment Verification Fails**
   - Verify signature calculation
   - Check Razorpay webhook configuration
   - Review server logs

3. **UI Not Loading**
   - Check if all dependencies are installed
   - Verify React Icons package
   - Check browser console for errors

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in backend environment variables.

## Support

For issues related to:
- **Razorpay Integration**: Check Razorpay documentation
- **Frontend Issues**: Review browser console and network tab
- **Backend Issues**: Check server logs and API responses 