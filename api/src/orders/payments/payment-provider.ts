import { Injectable } from '@nestjs/common';
import { CurrencyCode } from '../../plans/plan.schema';
import { PaymentProviderKey } from '../order.schema';

export interface PaymentIntent {
  orderId: string;
  amount: number;
  currency: CurrencyCode;
}

/**
 * Abstraction over payment gateways. Real adapters (Paymob, Stripe) plug in
 * here later — the rest of the system only ever talks to this interface.
 */
export interface PaymentProvider {
  readonly key: PaymentProviderKey;
  /** Begin a payment; returns the provider's reference for later confirmation. */
  createPayment(intent: PaymentIntent): Promise<{ reference: string }>;
  /** Confirm/capture a previously created payment. */
  confirmPayment(reference: string): Promise<{ success: boolean }>;
}

/** Mock Paymob adapter — no real keys; always succeeds. */
@Injectable()
export class PaymobProvider implements PaymentProvider {
  readonly key = 'paymob' as const;

  createPayment(intent: PaymentIntent): Promise<{ reference: string }> {
    return Promise.resolve({
      reference: `pmb_${intent.orderId}_${Math.random().toString(36).slice(2, 10)}`,
    });
  }

  confirmPayment(): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  }
}

/** Mock Stripe adapter — no real keys; always succeeds. */
@Injectable()
export class StripeProvider implements PaymentProvider {
  readonly key = 'stripe' as const;

  createPayment(intent: PaymentIntent): Promise<{ reference: string }> {
    return Promise.resolve({
      reference: `pi_${intent.orderId}_${Math.random().toString(36).slice(2, 10)}`,
    });
  }

  confirmPayment(): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  }
}
