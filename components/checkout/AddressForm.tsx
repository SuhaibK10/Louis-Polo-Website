'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/checkout/AddressForm.tsx
// Delivery address form within the checkout flow.
// Pre-fills if user has a saved default address.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import type { Address } from '@/types'

interface AddressFormProps {
  value:    Partial<Address>
  onChange: (field: keyof Address, value: string) => void
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Lakshadweep', 'Andaman and Nicobar Islands',
]

const inputClass = `
  w-full border border-lp-border-light dark:border-lp-border-dark
  bg-transparent
  text-[13px] text-lp-ink dark:text-lp-mist
  placeholder:text-lp-muted-light dark:placeholder:text-lp-muted-dark
  px-3.5 py-3
  focus:outline-none focus:border-lp-gold dark:focus:border-lp-gold
  transition-colors duration-200
`

const labelClass = `
  block text-[9px] tracking-lp-wider uppercase
  text-lp-muted-light dark:text-lp-muted-dark mb-1.5
`

export function AddressForm({ value, onChange }: AddressFormProps) {
  return (
    <div className="space-y-4">

      {/* Name + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            placeholder="Aryan Gupta"
            value={value.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Phone *</label>
          <input
            type="tel"
            placeholder="9876543210"
            value={value.phone ?? ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className={inputClass}
            maxLength={10}
            required
          />
        </div>
      </div>

      {/* Address line 1 */}
      <div>
        <label className={labelClass}>Address Line 1 *</label>
        <input
          type="text"
          placeholder="House/Flat no., Street name"
          value={value.line1 ?? ''}
          onChange={(e) => onChange('line1', e.target.value)}
          className={inputClass}
          required
        />
      </div>

      {/* Address line 2 */}
      <div>
        <label className={labelClass}>Address Line 2</label>
        <input
          type="text"
          placeholder="Area, Landmark (optional)"
          value={value.line2 ?? ''}
          onChange={(e) => onChange('line2', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* City + State + Pincode */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>City *</label>
          <input
            type="text"
            placeholder="Mumbai"
            value={value.city ?? ''}
            onChange={(e) => onChange('city', e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Pincode *</label>
          <input
            type="text"
            placeholder="400001"
            value={value.pincode ?? ''}
            onChange={(e) => onChange('pincode', e.target.value)}
            className={inputClass}
            maxLength={6}
            pattern="\d{6}"
            required
          />
        </div>
      </div>

      {/* State */}
      <div>
        <label className={labelClass}>State *</label>
        <select
          value={value.state ?? ''}
          onChange={(e) => onChange('state', e.target.value)}
          className={`${inputClass} cursor-pointer`}
          required
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
