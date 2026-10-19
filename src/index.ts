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
  statutoryMarginRate: number; // 8.0%
  totalAnnualRate: number; // e.g. 13.0%
  dailyInterestAmount: number;
  accruedInterestAmount: number;
  statutoryCompensationAmount: number; // £40, £70, or £100
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
export function calculateLatePaymentInterest(input: LatePaymentInput): LatePaymentResult {
  const invoiceAmount = Math.max(0, Number(input.invoiceAmount) || 0);
  const due = parseDate(input.dueDate);
  const settle = input.settlementDate ? parseDate(input.settlementDate) : new Date();

  const diffTime = settle.getTime() - due.getTime();
  const rawDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysOverdue = Math.max(0, rawDays);

  const boeBaseRate = Number.isFinite(input.bankOfEnglandBaseRate) ? Number(input.bankOfEnglandBaseRate) : 5.0;
  const statutoryMargin = 8.0;
  const totalAnnualRate = boeBaseRate + statutoryMargin;

  // Daily statutory interest = (Debt * Annual Rate) / 365
  const dailyInterest = invoiceAmount > 0 ? (invoiceAmount * (totalAnnualRate / 100)) / 365 : 0;
  const accruedInterest = daysOverdue > 0 ? dailyInterest * daysOverdue : 0;

  // Fixed compensation tier under Late Payment Act 1998
  let compensation = 0;
  if (invoiceAmount > 0 && daysOverdue > 0) {
    if (invoiceAmount < 1000) {
      compensation = 40;
    } else if (invoiceAmount < 10000) {
      compensation = 70;
    } else {
      compensation = 100;
    }
  }

  const roundedDaily = roundToTwoDecimals(dailyInterest);
  const roundedAccrued = roundToTwoDecimals(accruedInterest);
  const totalClaimable = roundToTwoDecimals(invoiceAmount + roundedAccrued + compensation);

  return {
    invoiceAmount,
    dueDate: toIsoDateString(due),
    settlementDate: toIsoDateString(settle),
    daysOverdue,
    bankOfEnglandBaseRate: boeBaseRate,
    statutoryMarginRate: statutoryMargin,
    totalAnnualRate,
    dailyInterestAmount: roundedDaily,
    accruedInterestAmount: roundedAccrued,
    statutoryCompensationAmount: compensation,
    totalClaimableAmount: totalClaimable,
    statutoryReference: "Section 6, Late Payment of Commercial Debts (Interest) Act 1998"
  };
}

/**
 * Generates an official statutory late payment demand notice text for insertion
 * into emails or formal letters.
 */
export function generateStatutoryDemandNotice(
  result: LatePaymentResult,
  options: {
    invoiceReference: string;
    creditorName: string;
    debtorName: string;
  }
): string {
  return [
    `FORMAL NOTICE OF STATUTORY LATE PAYMENT COMPENSATION AND INTEREST`,
    ``,
    `To: ${options.debtorName || "Accounts Payable"}`,
    `From: ${options.creditorName || "Creditor"}`,
    `Date: ${result.settlementDate}`,
    `Invoice Reference: ${options.invoiceReference}`,
    ``,
    `Please be advised that Invoice ${options.invoiceReference} for £${result.invoiceAmount.toFixed(2)} was due for settlement on ${result.dueDate} and is now ${result.daysOverdue} days overdue.`,
    ``,
    `Under the Late Payment of Commercial Debts (Interest) Act 1998, we are exercising our statutory right to claim interest and compensation charges:`,
    `- Principal Outstanding Debt: £${result.invoiceAmount.toFixed(2)}`,
    `- Statutory Interest (${result.totalAnnualRate.toFixed(1)}% per annum for ${result.daysOverdue} days): £${result.accruedInterestAmount.toFixed(2)}`,
    `- Fixed Statutory Debt Recovery Compensation: £${result.statutoryCompensationAmount.toFixed(2)}`,
    `- Total Balance Now Due: £${result.totalClaimableAmount.toFixed(2)}`,
    ``,
    `Statutory interest continues to accrue daily at £${result.dailyInterestAmount.toFixed(2)} until complete settlement is received.`,
    ``,
    `Online verification: https://invoicycle.com/calculators/uk-late-payment-interest`
  ].join("\n");
}

function parseDate(input: string | Date): Date {
  if (input instanceof Date) return input;
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function toIsoDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

function roundToTwoDecimals(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}
