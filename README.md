# invoicycle-late-payment-calculator

[![npm version](https://img.shields.io/npm/v/invoicycle-late-payment-calculator.svg)](https://www.npmjs.com/package/invoicycle-late-payment-calculator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Invoicycle](https://img.shields.io/badge/Official-Invoicycle%20Tool-00d084)](https://invoicycle.com)

A zero-dependency, type-safe calculation library for statutory interest and debt recovery compensation under the UK **Late Payment of Commercial Debts (Interest) Act 1998**.

Maintained by [Invoicycle](https://invoicycle.com) — the free online invoice builder and client-side financial document studio.

---

## Interactive Web Calculator

Calculate statutory interest and automatically generate legal late payment demand letters online for free:
👉 **[UK Late Payment Interest & Compensation Calculator](https://invoicycle.com/calculators/uk-late-payment-interest)**

---

## Features

- **Statutory Interest Rate**: Automatically calculates interest at the Bank of England Base Rate + **8% statutory margin**.
- **Tiered Fixed Debt Recovery Compensation**: Automatically applies statutory compensation under Section 6 of the Late Payment Act:
  - **£40** for debts under £1,000
  - **£70** for debts between £1,000 and £9,999.99
  - **£100** for debts of £10,000 or more
- **Daily Accrual Calculations**: Accurately determines daily interest accumulation across overdue periods.
- **Formal Demand Notice Generator**: Generates copy-paste statutory demand letters ready to send to non-paying debtors.
- **Zero Dependencies**: Lightweight, fast, and works seamlessly in Node.js, Deno, Bun, and the browser.

---

## Installation

```bash
npm install invoicycle-late-payment-calculator
```

Or using Yarn / pnpm:

```bash
yarn add invoicycle-late-payment-calculator
pnpm add invoicycle-late-payment-calculator
```

---

## Quick Start

```typescript
import { calculateLatePaymentInterest } from "invoicycle-late-payment-calculator";

const claim = calculateLatePaymentInterest({
  invoiceAmount: 3500,
  dueDate: "2026-08-01",
  settlementDate: "2026-09-15",
  bankOfEnglandBaseRate: 5.0
});

console.log(claim);
```

### Output

```json
{
  "invoiceAmount": 3500,
  "dueDate": "2026-08-01",
  "settlementDate": "2026-09-15",
  "daysOverdue": 45,
  "bankOfEnglandBaseRate": 5.0,
  "statutoryMarginRate": 8.0,
  "totalAnnualRate": 13.0,
  "dailyInterestAmount": 1.25,
  "accruedInterestAmount": 56.09,
  "statutoryCompensationAmount": 70,
  "totalClaimableAmount": 3626.09,
  "statutoryReference": "Section 6, Late Payment of Commercial Debts (Interest) Act 1998"
}
```

---

## Related Invoicing & Compliance Tools

- [Invoicycle Free Invoice Studio](https://invoicycle.com/invoices/new) — Create professional, branded PDF invoices online for free.
- [UK CIS & Reverse Charge Invoice Generator](https://invoicycle.com/compliance/uk-cis-invoice-generator) — Deduct 20% or 30% labour with HMRC reverse charge VAT.
- [PDF Invoice to Excel Converter](https://invoicycle.com/pdf-invoice-to-excel) — Client-side private tabular extraction tool.
- [Free Payment Terms Calculator](https://invoicycle.com/tools/payment-terms-calculator) — Calculate Net 30, Net 60, and EOM payment schedules.

---

## License

MIT © [Sarmad Hussain](https://invoicycle.com) & [Invoicycle](https://invoicycle.com).
