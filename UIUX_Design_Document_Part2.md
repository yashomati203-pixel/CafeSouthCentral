# Cafe South Central - UI/UX Design Document (Part 2)
**Continuation from Part 1**

---

## 6. Component Library

### 6.1 Buttons

**Primary Button (Main CTAs)**

```css
.btn-primary {
  /* Visual Style */
  background: var(--forest-green);
  color: var(--golden-yellow);
  border: none;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-green);
  
  /* Typography */
  font-family: 'Inter', sans-serif;
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.02em;
  
  /* Spacing */
  padding: 18px 42px;
  min-height: 56px;
  min-width: 120px;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Touch target */
  touch-action: manipulation;
}

.btn-primary:hover {
  background: var(--forest-green-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.btn-primary:active {
  background: var(--forest-green-700);
  transform: translateY(0);
  box-shadow: var(--shadow-active);
}

.btn-primary:disabled {
  background: var(--gray-200);
  color: var(--gray-400);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Loading state */
.btn-primary.loading {
  position: relative;
  color: transparent;
}

.btn-primary.loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  border: 3px solid var(--golden-yellow);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**HTML Implementation:**

```html
<!-- Default -->
<button class="btn-primary">Get My Meal</button>

<!-- With icon -->
<button class="btn-primary">
  <svg>...</svg>
  Add to Cart
</button>

<!-- Loading -->
<button class="btn-primary loading">
  Processing...
</button>

<!-- Disabled -->
<button class="btn-primary" disabled>
  Sold Out
</button>
```

**React Component:**

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  children,
  onClick
}) => {
  const sizeClasses = {
    small: 'px-6 py-2 text-sm min-h-[44px]',
    medium: 'px-10 py-4 text-base min-h-[56px]',
    large: 'px-14 py-5 text-lg min-h-[64px]'
  };
  
  return (
    <button
      className={`btn-${variant} ${sizeClasses[size]} ${loading ? 'loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

**Button Variants:**

| Variant | Use Case | Visual Example |
|---------|----------|----------------|
| **Primary** | Main CTAs (Place Order, Subscribe) | Forest green bg, golden yellow text |
| **Secondary** | Less important actions (View Details) | Golden yellow bg, forest green text |
| **Outline** | Tertiary actions (Cancel) | Transparent bg, forest green border |
| **Ghost** | Subtle actions (Close, Dismiss) | Transparent bg, hover shows beige |
| **Danger** | Destructive actions (Delete) | Red bg, white text |

**Size Guidelines:**

```css
/* Small (44px min height - touch target minimum) */
.btn-small {
  padding: 12px 24px;
  font-size: var(--text-sm);
  min-height: 44px;
}

/* Medium (56px - default) */
.btn-medium {
  padding: 18px 42px;
  font-size: var(--text-base);
  min-height: 56px;
}

/* Large (64px - hero CTAs) */
.btn-large {
  padding: 20px 56px;
  font-size: var(--text-lg);
  min-height: 64px;
}
```

---

### 6.2 Form Inputs

**Text Input**

```css
.input {
  /* Visual */
  width: 100%;
  background: var(--pure-white);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  
  /* Typography */
  font-family: 'Inter', sans-serif;
  font-size: var(--text-base);
  color: var(--gray-700);
  
  /* Spacing */
  padding: 14px 18px;
  min-height: 52px;
  
  /* Interaction */
  transition: all 0.2s ease;
}

.input::placeholder {
  color: var(--gray-400);
  font-weight: 400;
}

.input:focus {
  outline: none;
  border-color: var(--forest-green-light);
  box-shadow: 0 0 0 3px rgba(30, 58, 31, 0.1);
}

.input:disabled {
  background: var(--gray-100);
  color: var(--gray-400);
  cursor: not-allowed;
}

.input.error {
  border-color: var(--error);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.input.success {
  border-color: var(--success);
}
```

**Input with Label & Helper Text:**

```html
<div class="input-group">
  <!-- Label -->
  <label for="phone" class="input-label">
    Phone Number
  </label>
  
  <!-- Input -->
  <input 
    type="tel"
    id="phone"
    class="input"
    placeholder="9876543210"
    maxlength="10"
  />
  
  <!-- Helper text (normal) -->
  <span class="input-helper">
    Enter your 10-digit mobile number
  </span>
  
  <!-- Error message (shown when invalid) -->
  <span class="input-error hidden">
    Please enter a valid phone number
  </span>
</div>

<style>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gray-700);
}

.input-helper {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.input-error {
  font-size: var(--text-sm);
  color: var(--error);
  font-weight: 500;
}

.hidden {
  display: none;
}
</style>
```

**Input Variants:**

```html
<!-- Search Input -->
<div class="input-wrapper">
  <svg class="input-icon-left">...</svg>
  <input 
    type="search"
    class="input pl-12"
    placeholder="Search menu..."
  />
</div>

<!-- Textarea -->
<textarea 
  class="input"
  rows="4"
  placeholder="Special instructions (optional)"
  maxlength="200"
></textarea>

<!-- Select Dropdown -->
<select class="input">
  <option value="">Select category</option>
  <option value="breakfast">Breakfast</option>
  <option value="lunch">Lunch</option>
  <option value="snacks">Snacks</option>
</select>

<!-- Number Input (Quantity) -->
<div class="quantity-input">
  <button class="qty-btn">−</button>
  <input 
    type="number"
    class="qty-value"
    value="1"
    min="1"
    max="10"
  />
  <button class="qty-btn">+</button>
</div>

<style>
.quantity-input {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.qty-btn {
  background: var(--gray-100);
  border: none;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.qty-btn:hover {
  background: var(--gray-200);
}

.qty-value {
  border: none;
  width: 60px;
  text-align: center;
  font-weight: 600;
  font-size: var(--text-base);
}

.qty-value:focus {
  outline: none;
}
</style>
```

---

### 6.3 Cards

**Menu Item Card**

```html
<div class="menu-card">
  <!-- Image -->
  <div class="menu-card-image-wrapper">
    <img 
      src="/images/masala-dosa.jpg"
      alt="Masala Dosa with chutneys"
      class="menu-card-image"
      loading="lazy"
    />
    
    <!-- Veg indicator (absolute positioned) -->
    <div class="veg-indicator"></div>
    
    <!-- Badge overlay (if low stock) -->
    <div class="card-badge badge-warning">
      Only 3 left
    </div>
  </div>
  
  <!-- Content -->
  <div class="menu-card-content">
    <!-- Category tag -->
    <span class="card-category">South Indian</span>
    
    <!-- Title -->
    <h3 class="card-title">Masala Dosa</h3>
    
    <!-- Description -->
    <p class="card-description">
      Crispy rice crepe filled with spiced potato, served with coconut chutney and sambar
    </p>
    
    <!-- Footer (Price + CTA) -->
    <div class="card-footer">
      <span class="price">₹70</span>
      <button class="btn-primary btn-small">
        <svg>...</svg> Add
      </button>
    </div>
  </div>
</div>

<style>
.menu-card {
  background: var(--pure-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  transition: all 0.3s ease;
  cursor: pointer;
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--forest-green-100);
}

.menu-card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.menu-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.menu-card:hover .menu-card-image {
  transform: scale(1.05);
}

.veg-indicator {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 20px;
  height: 20px;
  border: 2px solid var(--success);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.95);
}

.veg-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: var(--success);
  border-radius: 50%;
}

.card-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-card-content {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.card-category {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--forest-green-light);
  font-weight: 600;
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-700);
  line-height: 1.3;
}

.card-description {
  font-size: var(--text-sm);
  color: var(--gray-500);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-2);
}

.price {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--forest-green);
}
</style>
```

**Order Card (History)**

```html
<div class="order-card">
  <!-- Header -->
  <div class="order-card-header">
    <div>
      <span class="order-id">ORD-20260201-1234</span>
      <span class="order-date">Feb 1, 2026 • 1:30 PM</span>
    </div>
    <div class="badge badge-success">Completed</div>
  </div>
  
  <!-- Items -->
  <div class="order-items">
    <div class="order-item">
      <span>1x Masala Dosa</span>
      <span>₹70</span>
    </div>
    <div class="order-item">
      <span>1x Filter Coffee</span>
      <span>₹30</span>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="order-card-footer">
    <div>
      <span class="order-total-label">Total</span>
      <span class="order-total">₹100</span>
    </div>
    <div class="order-actions">
      <button class="btn-outline btn-small">
        View Details
      </button>
      <button class="btn-secondary btn-small">
        Reorder
      </button>
    </div>
  </div>
</div>

<style>
.order-card {
  background: var(--pure-white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: all 0.2s ease;
}

.order-card:hover {
  border-color: var(--forest-green-light);
  box-shadow: var(--shadow-md);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-id {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gray-700);
}

.order-date {
  display: block;
  font-size: var(--text-sm);
  color: var(--gray-400);
  margin-top: 4px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-top: 1px solid var(--gray-100);
  border-bottom: 1px solid var(--gray-100);
  padding: var(--space-3) 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.order-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.order-total {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--forest-green);
  margin-top: 4px;
}

.order-actions {
  display: flex;
  gap: var(--space-2);
}
</style>
```

---

### 6.4 Badges & Status Indicators

```css
/* BASE BADGE */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

/* STATUS VARIANTS */
.badge-success {
  background: var(--success-light);
  color: var(--success);
  border: 1px solid var(--success);
}

.badge-warning {
  background: var(--warning-light);
  color: var(--warning);
  border: 1px solid var(--warning);
}

.badge-error {
  background: var(--error-light);
  color: var(--error);
  border: 1px solid var(--error);
}

.badge-info {
  background: var(--info-light);
  color: var(--info);
  border: 1px solid var(--info);
}

.badge-neutral {
  background: var(--gray-100);
  color: var(--gray-600);
  border: 1px solid var(--gray-300);
}

/* FRESH BADGE (Hero) */
.badge-fresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: var(--radius-full);
  border: 1px solid var(--forest-green-light);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest-green);
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

.badge-fresh::before {
  content: '●';
  color: var(--success);
  font-size: 16px;
}

/* VEG/NON-VEG INDICATORS */
.veg-indicator,
.non-veg-indicator {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  position: relative;
  flex-shrink: 0;
}

.veg-indicator {
  border: 2px solid var(--success);
}

.veg-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: var(--success);
  border-radius: 50%;
}

.non-veg-indicator {
  border: 2px solid var(--error);
}

.non-veg-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid var(--error);
}

/* NOTIFICATION BADGE (Count) */
.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--error);
  color: white;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

---

### 6.5 Modals & Drawers

**Modal (Item Details)**

```html
<!-- Backdrop -->
<div class="modal-backdrop" onclick="closeModal()"></div>

<!-- Modal Container -->
<div class="modal">
  <!-- Close button -->
  <button class="modal-close" onclick="closeModal()">
    <svg>...</svg>
  </button>
  
  <!-- Content -->
  <div class="modal-content">
    <!-- Image -->
    <img 
      src="/images/masala-dosa.jpg"
      alt="Masala Dosa"
      class="modal-image"
    />
    
    <!-- Header -->
    <div class="modal-header">
      <div class="veg-indicator"></div>
      <h2 class="modal-title">Masala Dosa</h2>
      <span class="modal-category">South Indian</span>
    </div>
    
    <!-- Body -->
    <div class="modal-body">
      <p class="modal-description">
        Crispy golden rice crepe filled with perfectly spiced potato masala, 
        served with fresh coconut chutney and piping hot sambar. 
        A South Indian breakfast classic.
      </p>
      
      <!-- Ingredients -->
      <div class="modal-section">
        <h4>Ingredients</h4>
        <p>Rice, Potatoes, Onions, Spices, Coconut, Lentils</p>
      </div>
      
      <!-- Nutritional Info -->
      <div class="modal-section">
        <h4>Nutritional Information</h4>
        <div class="nutrition-grid">
          <div><span>Calories</span> <strong>310</strong></div>
          <div><span>Protein</span> <strong>8g</strong></div>
          <div><span>Carbs</span> <strong>52g</strong></div>
          <div><span>Fat</span> <strong>7g</strong></div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="modal-footer">
      <!-- Quantity selector -->
      <div class="quantity-input">
        <button class="qty-btn">−</button>
        <input type="number" class="qty-value" value="1" />
        <button class="qty-btn">+</button>
      </div>
      
      <!-- Add to cart -->
      <button class="btn-primary">
        Add to Cart • ₹70
      </button>
    </div>
  </div>
</div>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
  animation: fade-in 0.2s ease;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background: var(--pure-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  z-index: var(--z-modal);
  overflow: hidden;
  animation: modal-slide-up 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: var(--shadow-md);
  transition: all 0.2s;
}

.modal-close:hover {
  background: white;
  transform: scale(1.1);
}

.modal-content {
  height: 100%;
  overflow-y: auto;
}

.modal-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.modal-header,
.modal-body {
  padding: var(--space-6);
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-700);
  margin: var(--space-2) 0;
}

.modal-category {
  font-size: var(--text-sm);
  color: var(--forest-green-light);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-description {
  font-size: var(--text-base);
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.modal-section {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-100);
}

.modal-section h4 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.nutrition-grid div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  background: var(--gray-50);
  border-radius: var(--radius-sm);
}

.modal-footer {
  padding: var(--space-6);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-100);
  display: flex;
  gap: var(--space-4);
  align-items: center;
  position: sticky;
  bottom: 0;
}

.modal-footer .btn-primary {
  flex: 1;
}
</style>
```

**Cart Drawer (Slide-in from right)**

```html
<!-- Backdrop -->
<div class="drawer-backdrop" onclick="closeCart()"></div>

<!-- Drawer -->
<div class="drawer drawer-right">
  <!-- Header -->
  <div class="drawer-header">
    <h3>Your Cart</h3>
    <button class="drawer-close" onclick="closeCart()">
      <svg>...</svg>
    </button>
  </div>
  
  <!-- Content -->
  <div class="drawer-content">
    <!-- Empty state (show if cart is empty) -->
    <div class="cart-empty">
      <svg>...</svg>
      <p>Your cart is empty</p>
      <button class="btn-primary" onclick="closeCart()">
        Browse Menu
      </button>
    </div>
    
    <!-- Cart items (show if cart has items) -->
    <div class="cart-items">
      <!-- Item -->
      <div class="cart-item">
        <img src="/images/masala-dosa-thumb.jpg" alt="" />
        <div class="cart-item-details">
          <h4>Masala Dosa</h4>
          <span class="cart-item-price">₹70</span>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-input-small">
            <button>−</button>
            <span>2</span>
            <button>+</button>
          </div>
          <button class="cart-item-remove">
            <svg>...</svg>
          </button>
        </div>
      </div>
      
      <!-- More items... -->
    </div>
    
    <!-- Subtotal -->
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <span class="price">₹140</span>
    </div>
  </div>
  
  <!-- Footer (sticky) -->
  <div class="drawer-footer">
    <button class="btn-primary btn-block">
      Proceed to Checkout
    </button>
  </div>
</div>

<style>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 420px;
  height: 100%;
  background: var(--pure-white);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  animation: slide-in-right 0.3s ease;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-header h3 {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-xl);
  color: var(--gray-700);
}

.drawer-close {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.drawer-close:hover {
  background: var(--gray-100);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  gap: var(--space-4);
}

.cart-empty svg {
  width: 80px;
  height: 80px;
  opacity: 0.3;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.cart-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius-md);
}

.cart-item img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
}

.cart-item-details h4 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--gray-700);
}

.cart-item-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.cart-item-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-end;
}

.quantity-input-small {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-input-small button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--gray-300);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.quantity-input-small span {
  width: 32px;
  text-align: center;
  font-weight: 600;
}

.cart-item-remove {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--error);
  padding: 4px;
}

.cart-subtotal {
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--soft-beige);
  border-radius: var(--radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-lg);
  font-weight: 600;
}

.drawer-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--gray-100);
  background: var(--pure-white);
}

.btn-block {
  width: 100%;
}
</style>
```

---

## 7. Page Designs & Layouts

### 7.1 Landing Page (Unauthenticated)

**Layout Structure:**

```
┌────────────────────────────────────────────────┐
│ NAVIGATION (Sticky)                            │
│ Logo | Menu | Subscriptions | Login/Sign Up   │
├────────────────────────────────────────────────┤
│                                                │
│ HERO SECTION                                   │
│ ┌───────────────┬──────────────────────────┐  │
│ │ Left Column   │ Right Column (Image)     │  │
│ │ - Headline    │ - Food Photography       │  │
│ │ - Subheadline │   (Masala Dosa + Sides)  │  │
│ │ - CTA Button  │                          │  │
│ │ - Tagline     │                          │  │
│ │               │ - "100% Fresh" Badge     │  │
│ └───────────────┴──────────────────────────┘  │
│                                                │
├────────────────────────────────────────────────┤
│ HOW IT WORKS (3 Steps)                         │
│ ┌──────────┬──────────┬──────────┐            │
│ │ Step 1   │ Step 2   │ Step 3   │            │
│ │ Browse   │ Order    │ Pickup   │            │
│ └──────────┴──────────┴──────────┘            │
├────────────────────────────────────────────────┤
│ BESTSELLERS (Carousel)                         │
│ ← [Card] [Card] [Card] [Card] →               │
├────────────────────────────────────────────────┤
│ SUBSCRIPTION TEASER                            │
│ "Never think about lunch again"                │
│ [Plan Comparison] [Subscribe CTA]              │
├────────────────────────────────────────────────┤
│ SOCIAL PROOF                                   │
│ - Customer Reviews                             │
│ - Stats (500+ orders, 4.8★ rating)            │
├────────────────────────────────────────────────┤
│ FOOTER                                         │
│ Logo | Links | Social | Legal                  │
└────────────────────────────────────────────────┘
```

**Hero Section Code:**

```html
<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <!-- Left Column (Text) -->
      <div class="hero-content">
        <h1 class="hero-display">
          <span class="text-forest-green">Hearty breakfast.</span><br>
          <span class="text-forest-green">Quick bites.</span><br>
          <span class="text-forest-green">Clean lunch.</span>
        </h1>
        
        <p class="hero-cta-text text-rich-brown">
          We've got a plate ready for you.
        </p>
        
        <button class="btn-primary btn-large">
          Get My Meal
        </button>
        
        <p class="tagline">
          "Deadlines can wait. Good food can't."
        </p>
      </div>
      
      <!-- Right Column (Image) -->
      <div class="hero-image-wrapper">
        <img 
          src="/images/hero-dosa.jpg"
          alt="Golden masala dosa with chutneys"
          class="hero-image"
        />
        
        <!-- Fresh Badge (Overlaid) -->
        <div class="badge-fresh">
          100% Fresh • Made Today
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--cream-white) 0%, var(--soft-beige) 100%);
  position: relative;
  overflow: hidden;
}

/* Decorative background elements */
.hero::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(30, 58, 31, 0.03) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
}

@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    text-align: center;
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.hero-image-wrapper {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
}

.hero-image-wrapper .badge-fresh {
  position: absolute;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
}
</style>
```

---

### 7.2 Menu Page

**Layout:**

```
┌────────────────────────────────────────────────┐
│ HEADER (Sticky)                                │
│ Logo | Search | Cart(3) | Profile              │
├────────────────────────────────────────────────┤
│ SECONDARY NAV (Sticky)                         │
│ [Menu] [Orders] [Subscription] [Profile]       │
├────────────────────────────────────────────────┤
│ FILTERS & SEARCH                               │
│ Search: [____________] | Veg ○ Non-Veg ○ All   │
│ Categories: [All] [Breakfast] [Lunch] [Snacks] │
├────────────────────────────────────────────────┤
│ MENU GRID                                      │
│ ┌────────┬────────┬────────┐                  │
│ │ Card 1 │ Card 2 │ Card 3 │                  │
│ ├────────┼────────┼────────┤                  │
│ │ Card 4 │ Card 5 │ Card 6 │                  │
│ └────────┴────────┴────────┘                  │
│                                                │
│ (Grid: 3 columns desktop, 2 tablet, 1 mobile) │
└────────────────────────────────────────────────┘

[CART DRAWER - Slides in from right when opened]
```

**Implementation:**

```tsx
// MenuPage.tsx
export default function MenuPage() {
  const [category, setCategory] = useState('all');
  const [dietType, setDietType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="menu-page">
      {/* Header */}
      <Header />
      
      {/* Secondary Nav */}
      <SecondaryNav active="menu" />
      
      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          {/* Search */}
          <div className="search-wrapper">
            <SearchIcon />
            <input 
              type="search"
              placeholder="Search for dosa, idli, coffee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Diet Filter */}
          <div className="diet-filter">
            <button 
              className={dietType === 'all' ? 'active' : ''}
              onClick={() => setDietType('all')}
            >
              All
            </button>
            <button 
              className={dietType === 'veg' ? 'active' : ''}
              onClick={() => setDietType('veg')}
            >
              <VegIcon /> Veg
            </button>
            <button 
              className={dietType === 'non-veg' ? 'active' : ''}
              onClick={() => setDietType('non-veg')}
            >
              <NonVegIcon /> Non-Veg
            </button>
          </div>
          
          {/* Category Tabs */}
          <div className="category-tabs">
            {['all', 'breakfast', 'lunch', 'snacks', 'beverages'].map(cat => (
              <button
                key={cat}
                className={category === cat ? 'active' : ''}
                onClick={() => setCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Menu Grid */}
      <div className="container">
        <div className="menu-grid">
          {filteredItems.map(item => (
            <MenuCard 
              key={item.id}
              item={item}
              onClick={() => openItemModal(item)}
            />
          ))}
        </div>
      </div>
      
      {/* Cart Drawer (conditionally rendered) */}
      {isCartOpen && <CartDrawer onClose={closeCart} />}
    </div>
  );
}
```

---

### 7.3 Order Tracking Page

**Layout:**

```
┌────────────────────────────────────────────────┐
│ BACK BUTTON | Order #ORD-20260201-1234         │
├────────────────────────────────────────────────┤
│                                                │
│ STATUS TIMELINE (Visual Stepper)               │
│ ┌─────┬─────┬─────┬─────┐                    │
│ │ ✓   │ ⏳  │  ○  │  ○  │                    │
│ │Rcvd │Prep │Ready│Done │                    │
│ └─────┴─────┴─────┴─────┘                    │
│                                                │
│ Status Message:                                │
│ "Your dosa is getting that perfect golden      │
│  crisp. Almost ready!"                         │
│                                                │
├────────────────────────────────────────────────┤
│ ORDER DETAILS                                  │
│ ┌────────────────────────────────────────┐    │
│ │ 1x Masala Dosa           ₹70           │    │
│ │ 1x Filter Coffee         ₹30           │    │
│ ├────────────────────────────────────────┤    │
│ │ Subtotal                 ₹100          │    │
│ │ ──────────────────────────────         │    │
│ │ TOTAL                    ₹100          │    │
│ └────────────────────────────────────────┘    │
│                                                │
│ Pickup Time: ASAP (Est. 1:15 PM)              │
│ Order Placed: 1:00 PM                          │
│                                                │
│ Special Instructions:                          │
│ "Less oil in chutney"                          │
│                                                │
├────────────────────────────────────────────────┤
│ QR CODE (for pickup)                           │
│ ┌────────────────┐                            │
│ │    [QR CODE]   │                            │
│ │                │                            │
│ └────────────────┘                            │
│ Show this code at counter                      │
│                                                │
├────────────────────────────────────────────────┤
│ ACTIONS                                        │
│ [Cancel Order] (if within 2 min)               │
│ [Download Receipt]                             │
└────────────────────────────────────────────────┘
```

**Status Timeline Component:**

```tsx
interface OrderStatus {
  status: 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED';
  message: string;
}

const statusConfig = {
  RECEIVED: {
    message: "We've received your order and it's in the queue!",
    color: 'var(--success)'
  },
  PREPARING: {
    message: "Your food is being freshly prepared. We're making it perfect!",
    color: 'var(--warning)'
  },
  READY: {
    message: "Your order is ready! Please proceed to the counter.",
    color: 'var(--info)'
  },
  COMPLETED: {
    message: "Enjoy your meal! Thanks for choosing us.",
    color: 'var(--gray-500)'
  }
};

function StatusTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const steps = ['RECEIVED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentIndex = steps.indexOf(currentStatus);
  
  return (
    <div className="status-timeline">
      {/* Visual stepper */}
      <div className="stepper">
        {steps.map((step, index) => (
          <div 
            key={step}
            className={`step ${index <= currentIndex ? 'completed' : 'pending'}`}
          >
            <div className="step-icon">
              {index < currentIndex && <CheckIcon />}
              {index === currentIndex && <LoadingSpinner />}
              {index > currentIndex && <CircleIcon />}
            </div>
            <div className="step-label">
              {step.charAt(0) + step.slice(1).toLowerCase()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Status message */}
      <div className="status-message">
        {statusConfig[currentStatus].message}
      </div>
      
      {/* Estimated time (if PREPARING) */}
      {currentStatus === 'PREPARING' && (
        <div className="estimated-time">
          Estimated ready time: <strong>5 minutes</strong>
        </div>
      )}
    </div>
  );
}
```

---

This completes Part 2. Would you like me to create Part 3 covering:
- Section 8: Interaction Design Patterns (hover states, transitions, gestures)
- Section 9: Responsive Design Strategy (mobile-first approach, breakpoints)
- Section 10: Accessibility & Inclusive Design
- Section 11: Animation & Motion Design
- Section 12: Design QA & Testing
- Section 13: Handoff Specifications

Let me know if you'd like the complete document or if there are specific sections you'd like me to focus on!
