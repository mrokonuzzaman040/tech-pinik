// Facebook Pixel and Conversions API integration

interface FacebookPixelEvent {
  event_name: string;
  event_time: number;
  action_source: 'website';
  event_source_url: string;
  user_data: {
    em?: string; // email (hashed)
    ph?: string; // phone (hashed)
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_ids?: string[];
    content_type?: string;
    content_name?: string;
    content_category?: string;
    num_items?: number;
    order_id?: string;
    delivery_category?: string;
  };
}

interface FacebookConversionResponse {
  events_received: number;
  messages: string[];
  fbtrace_id: string;
}

export class FacebookPixelManager {
  private pixelId: string;
  private accessToken: string;
  private testEventCode?: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.pixelId = process.env.FACEBOOK_PIXEL_ID || '';
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN || '';
    this.testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE;

    if (!this.pixelId || !this.accessToken) {
      console.warn('Facebook Pixel configuration missing. Please set FACEBOOK_PIXEL_ID and FACEBOOK_ACCESS_TOKEN environment variables.');
    }
  }

  /**
   * Initialize Facebook Pixel on the client side
   */
  static initializePixel(pixelId: string): string {
    return `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
  }

  /**
   * Send event to Facebook Conversions API
   */
  async sendConversionEvent(event: Partial<FacebookPixelEvent>): Promise<FacebookConversionResponse | null> {
    if (!this.pixelId || !this.accessToken) {
      console.warn('Facebook Pixel not configured, skipping conversion event');
      return null;
    }

    try {
      const eventData: FacebookPixelEvent = {
        event_name: event.event_name || 'PageView',
        event_time: event.event_time || Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: event.event_source_url || (typeof window !== 'undefined' ? window.location.href : ''),
        user_data: event.user_data || {},
        custom_data: event.custom_data || {}
      };

      const payload = {
        data: [eventData],
        ...(this.testEventCode && { test_event_code: this.testEventCode })
      };

      const response = await fetch(`${this.baseUrl}/${this.pixelId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Facebook Conversions API error: ${response.status} ${response.statusText}`);
      }

      const result: FacebookConversionResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Facebook Conversions API error:', error);
      return null;
    }
  }

  /**
   * Track page view
   */
  async trackPageView(url?: string, userData?: FacebookPixelEvent['user_data']): Promise<void> {
    await this.sendConversionEvent({
      event_name: 'PageView',
      event_source_url: url,
      user_data: userData
    });
  }

  /**
   * Track view content event
   */
  async trackViewContent(
    contentId: string,
    contentName: string,
    contentCategory?: string,
    value?: number,
    currency: string = 'BDT',
    userData?: FacebookPixelEvent['user_data']
  ): Promise<void> {
    await this.sendConversionEvent({
      event_name: 'ViewContent',
      user_data: userData,
      custom_data: {
        content_ids: [contentId],
        content_name: contentName,
        content_category: contentCategory,
        content_type: 'product',
        value: value,
        currency: currency
      }
    });
  }

  /**
   * Track add to cart event
   */
  async trackAddToCart(
    contentId: string,
    contentName: string,
    value: number,
    currency: string = 'BDT',
    userData?: FacebookPixelEvent['user_data']
  ): Promise<void> {
    await this.sendConversionEvent({
      event_name: 'AddToCart',
      user_data: userData,
      custom_data: {
        content_ids: [contentId],
        content_name: contentName,
        content_type: 'product',
        value: value,
        currency: currency
      }
    });
  }

  /**
   * Track initiate checkout event
   */
  async trackInitiateCheckout(
    contentIds: string[],
    value: number,
    numItems: number,
    currency: string = 'BDT',
    userData?: FacebookPixelEvent['user_data']
  ): Promise<void> {
    await this.sendConversionEvent({
      event_name: 'InitiateCheckout',
      user_data: userData,
      custom_data: {
        content_ids: contentIds,
        content_type: 'product',
        value: value,
        currency: currency,
        num_items: numItems
      }
    });
  }

  /**
   * Track purchase event
   */
  async trackPurchase(
    orderId: string,
    contentIds: string[],
    value: number,
    numItems: number,
    currency: string = 'BDT',
    userData?: FacebookPixelEvent['user_data']
  ): Promise<void> {
    await this.sendConversionEvent({
      event_name: 'Purchase',
      user_data: userData,
      custom_data: {
        order_id: orderId,
        content_ids: contentIds,
        content_type: 'product',
        value: value,
        currency: currency,
        num_items: numItems
      }
    });
  }

  /**
   * Track search event
   */
  async trackSearch(
    searchString: string,
    userData?: FacebookPixelEvent['user_data']
  ): Promise<void> {
    await this.sendConversionEvent({
      event_name: 'Search',
      user_data: userData,
      custom_data: {
        content_category: searchString
      }
    });
  }

  /**
   * Hash email for Facebook Pixel (SHA-256)
   */
  static async hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash phone number for Facebook Pixel (SHA-256)
   */
  static async hashPhone(phone: string): Promise<string> {
    // Remove all non-digit characters and add country code if missing
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCountryCode = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(phoneWithCountryCode);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get user data for Facebook Pixel from request
   */
  static getUserDataFromRequest(request: Request, email?: string, phone?: string): FacebookPixelEvent['user_data'] {
    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '';

    return {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
      ...(email && { em: email }), // Should be hashed
      ...(phone && { ph: phone })  // Should be hashed
    };
  }
}

// Export a default instance
export const facebookPixel = new FacebookPixelManager();

// Extend Window interface for Facebook Pixel
declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}

// Client-side pixel tracking functions
export const clientPixelTrack = {
  pageView: () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  },

  viewContent: (contentId: string, contentName: string, value?: number, currency: string = 'BDT') => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [contentId],
        content_name: contentName,
        content_type: 'product',
        value: value,
        currency: currency
      });
    }
  },

  addToCart: (contentId: string, contentName: string, value: number, currency: string = 'BDT') => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [contentId],
        content_name: contentName,
        content_type: 'product',
        value: value,
        currency: currency
      });
    }
  },

  initiateCheckout: (contentIds: string[], value: number, numItems: number, currency: string = 'BDT') => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: contentIds,
        content_type: 'product',
        value: value,
        currency: currency,
        num_items: numItems
      });
    }
  },

  purchase: (orderId: string, contentIds: string[], value: number, numItems: number, currency: string = 'BDT') => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        order_id: orderId,
        content_ids: contentIds,
        content_type: 'product',
        value: value,
        currency: currency,
        num_items: numItems
      });
    }
  },

  search: (searchString: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Search', {
        search_string: searchString
      });
    }
  }
};