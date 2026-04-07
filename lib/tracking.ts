"use client";

// Tracking utility functions for Facebook, TikTok, and Google events

declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

export const fireEvent = {
  viewContent: (contentName: string, value: number) => {
    if (window.fbq) window.fbq('track', 'ViewContent', { content_name: contentName, value, currency: 'MAD' });
    if (window.ttq) window.ttq.track('ViewContent', { contents: [{ content_name: contentName, price: value }], value, currency: 'MAD' });
  },
  
  selectOffer: (offerName: string, value: number) => {
    if (window.fbq) window.fbq('track', 'AddToCart', { content_name: offerName, value, currency: 'MAD' });
    if (window.ttq) window.ttq.track('AddToCart', { contents: [{ content_name: offerName, price: value }], value, currency: 'MAD' });
  },

  lead: (source: string) => {
    if (window.fbq) window.fbq('track', 'Lead', { content_name: source });
    if (window.ttq) window.ttq.track('SubmitForm', { contents: [{ content_name: source }] });
  },

  purchase: (orderId: string, value: number) => {
    if (window.fbq) window.fbq('track', 'Purchase', { order_id: orderId, value, currency: 'MAD' });
    if (window.ttq) window.ttq.track('CompletePayment', { contents: [{ content_name: 'Pack Nokia' }], value, currency: 'MAD' });
    if (window.gtag) {
       window.gtag('event', 'purchase', {
         transaction_id: orderId,
         value: value,
         currency: 'MAD'
       });
    }
  }
};
