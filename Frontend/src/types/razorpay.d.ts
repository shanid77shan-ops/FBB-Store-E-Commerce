interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
  }
  
  interface RazorpayInstance {
    open: () => void;
    close: () => void;
  }
  
  declare global {
    interface Window {
      Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
  }