# Project Cost Estimation
**Project:** Cafe South Central - Web App v1
**Date:** February 3, 2026
**Version:** 1.0

---

## 1. Executive Summary

The initial launch strategy prioritizes a **Low-Burn Model** by leveraging generous "Free Tiers" from top-tier infrastructure providers. The primary costs during the launch phase will be **variable** (pay-as-you-grow) rather than fixed monthly fees.

**Estimated Monthly Fixed Cost (Launch):** ₹0
**Estimated One-Time Cost:** ₹6,900 (approx)

---

## 2. Infrastructure Costs (Recurring)

We will use the **Free Tiers** for the first phase of growth. These tiers are sufficient for up to thousands of users per month.

| Service | Provider | Tier | Monthly Cost | Limits / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **B2C Hosting** | Vercel | Hobby (Free) | **₹0** | Bandwidth limits apply. Excellent for launch. |
| **Database** | Supabase | Free | **₹0** | 500MB storage is plenty for initial text/order data. |
| **Caching** | Upstash Redis | Free | **₹0** | 10,000 requests/day free. |
| **Image Storage** | Supabase Storage | Free | **₹0** | Included in Supabase free tier (up to 1GB). |
| **Monitoring** | Vercel Analytics | Free | **₹0** | Basic views and error tracking. |

**Upgrade Trigger:** When daily active users exceed ~1,000 consistently, we may need to upgrade to Vercel Pro ($20/mo) and Supabase Pro ($25/mo).

---

## 3. Operational Costs (Variable / Pay-Per-Use)

These costs occur *only when you make money* (receive orders) or when users log in.

| Service | Provider | Unit Cost | Estimated Monthly (for 100 orders/day) |
| :--- | :--- | :--- | :--- |
| **SMS (OTP)** | Msg91 / 2Factor | ~₹0.20 - ₹0.25 per SMS | **₹600 - ₹750** *(Assuming 1 login = 1 order. Bulk packs reduce cost)* |
| **Payments** | Razorpay | 2% per transaction | **Variable** *(e.g., ₹20 on a ₹1000 order)* |
| **Email** | Resend | Free (up to 3,000 / mo) | **₹0** *(Sufficient for 100 orders/day)* |

**Note on SMS:**
*   **Twilio (REJECTED):** ~₹7.00/SMS (Too expensive for India model).
*   **Recommendation:** Buy a prepaid credit pack of ₹1,000 - ₹2,000 from Msg91/2Factor to start.

---

## 4. Compliance & One-Time Costs

Mandatory fees to legally operate digital communications and branding in India.

| Item | Necessity | Cost (Approx) | Frequency |
| :--- | :--- | :--- | :--- |
| **Domain Name** | Brand Identity | ₹800 - ₹1,000 | Yearly |
| **DLT Registration** | TRAI Compliance (Mandatory for SMS) | ₹5,900 | **One-Time (Lifetime)** |
| **Business Registration** | Legal Identity | Varies | One-Time |

**What is DLT?**
Distributed Ledger Technology registration is required by TRAI for any business sending SMS to Indian numbers. You must register your entity (Cafe South Central) and your Headers (e.g., "CAFESC") with a telecom operator like Jio, Airtel, or Vodafone-Idea.

---

## 5. Total Launch Budget

### **One-Time Setup**
*   **Domain:** ₹1,000
*   **DLT Registration:** ₹5,900
*   **Initial SMS Credits:** ₹1,000
*   **Total:** **~₹7,900**

### **Monthly Running Cost (at Launch)**
*   **Fixed:** ₹0
*   **Variable:** ~₹0.25 per customer login
*   **Total:** **Minimal (scales with revenue)**
