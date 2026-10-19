/**
 * Invoicycle UK Statutory Late Payment Interest & Compensation Calculator
 * Governed by the Late Payment of Commercial Debts (Interest) Act 1998.
 * Online Interactive Tool: https://invoicycle.com/calculators/uk-late-payment-interest
 */
export interface LatePaymentInput {
    /**
     * Principal debt or unpaid invoice amount in GBP.
     */
    invoiceAmount: number;
    /**
     * Due date of the invoice (ISO string 'YYYY-MM-DD' or Date object).
     */
    dueDate: string | Date;
    /**
     * Date up to which interest is calculated (defaults to current date).
     */
    settlementDate?: string | Date;
    /**
     * The Bank of England base rate percentage (e.g. 5.0 for 5.0%).
     * Statutory interest is calculated as (Base Rate + 8%).
     * @default 5.0
     */
    bankOfEnglandBaseRate?: number;
}
export interface LatePaymentResult {
    invoiceAmount: number;
    dueDate: string;
    settlementDate: string;
    daysOverdue: number;
    bankOfEnglandBaseRate: number;
    statutoryMarginRate: number;
    totalAnnualRate: number;
    dailyInterestAmount: number;
    accruedInterestAmount: number;
    statutoryCompensationAmount: number;
    totalClaimableAmount: number;
    statutoryReference: string;
}
/**
 * Calculates statutory interest and fixed late fee compensation under the
 * Late Payment of Commercial Debts (Interest) Act 1998.
 *
 * @example
 * ```ts
 * import { calculateLatePaymentInterest } from "invoicycle-late-payment-calculator";
 *
 * const claim = calculateLatePaymentInterest({
 *   invoiceAmount: 3500,
 *   dueDate: "2026-08-01",
 *   settlementDate: "2026-09-15",
 *   bankOfEnglandBaseRate: 5.0
 * });
 *
 * console.log(claim.daysOverdue); // 45
 * console.log(claim.accruedInterestAmount); // £56.09
 * console.log(claim.statutoryCompensationAmount); // £70
 * console.log(claim.totalClaimableAmount); // £3626.09
 * ```
 */
export declare function calculateLatePaymentInterest(input: LatePaymentInput): LatePaymentResult;
/**
 * Generates an official statutory late payment demand notice text for insertion
 * into emails or formal letters.
 */
export declare function generateStatutoryDemandNotice(result: LatePaymentResult, options: {
    invoiceReference: string;
    creditorName: string;
    debtorName: string;
}): string;
