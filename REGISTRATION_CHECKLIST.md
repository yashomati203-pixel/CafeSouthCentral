# 📋 Launch Registration Checklist

Use this checklist to track all the accounts and approvals you need to obtain before going live.

## 🔴 Critical Path (Do These First)
*These block the technical integration and can take time to approve.*

### 1. WhatsApp Business API (Meta)
- [ ] **Create Meta Business Account:** Go to [business.facebook.com](https://business.facebook.com/).
- [ ] **Create App:** Create a "Business" app in [Meta Developers](https://developers.facebook.com/).
- [ ] **Add WhatsApp Product:** Add "WhatsApp" to your app.
- [ ] **Add Phone Number:** Add a phone number that is NOT currently registered on WhatsApp personal/business apps.
- [ ] **Get Credentials:** Get `Phone Number ID` and `Access Token` (Permanent token recommended for prod).
- [ ] **Payment Method:** Add payment method in Meta Business settings (first 1000 convos/month are free).

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
