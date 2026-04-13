// ─────────────────────────────────────────────────────────────────────────────
// lib/utils.ts
// Shared utility functions used across the entire app.
// Keep functions pure and well-named.
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind Class Merger ────────────────────────────────────────────────────

// Combines clsx + tailwind-merge for clean conditional class names
// Usage: cn('base-class', condition && 'conditional-class', 'another-class')
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Price Formatting ─────────────────────────────────────────────────────────

// Format price in Indian Rupee format
// Input: 8500 → Output: '₹8,500'
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    // No decimal places for whole numbers
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Convert INR to paise for Razorpay
// Input: 8500 (INR) → Output: 850000 (paise)
export function toPaise(inr: number): number {
  return inr * 100
}

// ─── Slug Generation ──────────────────────────────────────────────────────────

// Generate URL-safe slug from a product name
// Input: 'SkyTrail Blue 20"' → Output: 'skytrail-blue-20inch'
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/"/g, 'inch')      // convert inch symbol to text
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-')       // spaces to hyphens
    .replace(/-+/g, '-')        // collapse multiple hyphens
}

// ─── Order Number Generation ──────────────────────────────────────────────────

// Generate human-readable order number
// Format: LP-YYYY-XXXXX (e.g. LP-2025-00001)
export function generateOrderNumber(count: number): string {
  const year = new Date().getFullYear()
  const padded = String(count).padStart(5, '0')
  return `LP-${year}-${padded}`
}

// ─── Phone Number Formatting ──────────────────────────────────────────────────

// Format phone for display
// Input: '9328789287' → Output: '+91 93287 89287'
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  return phone
}

// Normalize phone for Supabase/Twilio — always +91 prefix
// Input: '9328789287' or '+919328789287' → Output: '+919328789287'
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  return phone
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

// Format order date for display
// Input: '2025-11-15T10:30:00Z' → Output: '15 Nov 2025'
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

// ─── Truncate Text ────────────────────────────────────────────────────────────

// Truncate long text with ellipsis
// Input: 'A very long description...', 50 → 'A very long description...'
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

// ─── Size Order ───────────────────────────────────────────────────────────────

// Used to display product sizes in a consistent order
export const SIZE_ORDER = ['20"', '24"', '28"', 'Set of 3', 'One Size'] as const

// ─── Color Mapping ────────────────────────────────────────────────────────────

// Maps product color names to hex values for swatches
// Add new colors here as they come in
export const COLOR_HEX_MAP: Record<string, string> = {
  'Blue':         '#1E88E5',
  'Grey':         '#9E9E9E',
  'Yellow':       '#FDD835',
  'Black':        '#212121',
  'Rosegold':     '#B76E79',
  'Pink':         '#EC407A',
  'Green':        '#43A047',
  'Carbon Fiber': '#2C2C2C',
  'Silver Brush': '#C0C0C0',
  'Gun Metal':    '#4A4A4A',
  'Red':          '#C0392B',
  'Teal':         '#2C9E8F',
  'Brown':        '#7D5A3C',
  'White':        '#F5F2EC',
}

// Get hex for a color name — fallback to grey if unknown
export function getColorHex(colorName: string): string {
  return COLOR_HEX_MAP[colorName] ?? '#9E9E9E'
}
