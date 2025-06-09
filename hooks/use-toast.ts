"use client"

import type React from "react"

import { toast as sonnerToast } from "sonner"
import type { ExternalToast } from "sonner"

export interface ToastProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

type Toast = Omit<ToastProps, "id">

// Main toast function that wraps Sonner
function toast({ title, description, action, variant = "default", duration, ...props }: Toast) {
  const options: ExternalToast = {
    description,
    action,
    duration,
    ...props,
  }

  // Handle different variants
  switch (variant) {
    case "destructive":
      return sonnerToast.error(title, options)
    default:
      return sonnerToast(title, options)
  }
}

// Additional toast methods for convenience
toast.success = (title: React.ReactNode, options?: ExternalToast) => sonnerToast.success(title, options)

toast.error = (title: React.ReactNode, options?: ExternalToast) => sonnerToast.error(title, options)

toast.info = (title: React.ReactNode, options?: ExternalToast) => sonnerToast.info(title, options)

toast.warning = (title: React.ReactNode, options?: ExternalToast) => sonnerToast.warning(title, options)

toast.loading = (title: React.ReactNode, options?: ExternalToast) => sonnerToast.loading(title, options)

toast.promise = sonnerToast.promise

toast.dismiss = (id?: string | number) => sonnerToast.dismiss(id)

// Hook that provides the toast function and state
function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
  }
}

export { useToast, toast }
