# 📋 Launch Registration Checklist

Use this checklist to track all the accounts and approvals you need to obtain before going live.

## 🔴 Critical Path (Do These First)
*These block the technical integration and can take time to approve.*

### 1. DLT Registration (Mandatory for SMS)
- [ ] **Register with Operator:** Create account on [Jio DLT](https://trueconnect.jio.com) or [SmartPing (Videocon)](https://smartping.live/entity/login).
    - **Cost:** ~₹5,900 (Lifetime)
    - **Documents Needed:** Business PAN, GST Certificate, Authorized Signatory Letter, Proof of Address.
    - **Wait Time:** 3-7 Days.
- [ ] **Register Header (Sender ID):** E.g., `CAFESC` (6 chars).
- [ ] **Register Content Templates:** "Your OTP is {#var#}..."

### 2. SMS Provider Account
- [ ] **Sign up:** [Msg91](https://msg91.com/) or [2Factor](https://2factor.in/).
- [ ] **Verify KYC:** Upload business documents.
- [ ] **Link DLT:** Connect your approved DLT Principal Entity ID (PEID) to the SMS panel.
- [ ] **Buy Credits:** Purchase initial transactional credit pack (approx ₹1,000).

### 3. Payment Gateway (Razorpay)
- [ ] **Sign up:** [Razorpay](https://razorpay.com/).
- [ ] **Complete KYC:** Upload Business PAN, GST, Bank Account details (Cancelled Cheque).
- [ ] **Website/App URL:** They will check your website (even a staging link works).
- [ ] **Policy Pages:** You MUST have Terms & Conditions, Privacy Policy, Refund Policy, and Contact Us pages on your site (Razorpay requirement).
    - **Wait Time:** 2-4 Days for full activation.

---

## 🟡 Technical Infrastructure (Quick Setup)
*These are instant but required for the app to run.*

### 4. Domain Name
- [ ] **Purchase Domain:** [GoDaddy](https://godaddy.com) or [Namecheap](https://namecheap.com).
    - **Cost:** ~₹1,000/year.
- [ ] **DNS Management:** (Will later point to Vercel).

### 5. Infrastructure Accounts (Free Tiers)
- [ ] **GitHub:** For code repository.
- [ ] **Vercel:** For hosting the frontend. Sign up with GitHub.
- [ ] **Supabase:** For database. Sign up with GitHub.
- [ ] **Resend:** For email notifications. Sign up and verify your domain (requires DNS access).

---

## 🟢 Operational (Before Launch)

### 6. Legal & Policy Docs
- [ ] **Terms of Service:** Draft for the website.
- [ ] **Privacy Policy:** Draft for the website.
- [ ] **Refund/Cancellation Policy:** Crucial for Razorpay approval.
- [ ] **Contact Information:** Physical address, phone, and email must be visible on the site.

### 7. Google Services (Optional but Recommended)
- [ ] **Google Cloud Console:** Create project if using Google Login or Maps in future.
- [ ] **Google Business Profile:** Register "Cafe South Central" on Google Maps for SEO.
