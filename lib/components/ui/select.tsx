"use client"

import * as React from "react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <select
        ref={ref}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

// Compatibility shims for shadcn-style API
// These components provide a compatible API surface but use native HTML select elements
// SelectTrigger and SelectValue are not rendered as the native select handles the trigger display
const SelectTrigger = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => null

const SelectValue = ({ placeholder }: { placeholder?: string }) => null

// SelectContent passes through children as they become option elements in the select
const SelectContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <>{children}</>
)

const SelectItem = ({ value, children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) => (
  <option value={value} {...props}>{children}</option>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
