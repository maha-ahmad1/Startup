import { z } from "zod"

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(50, "Category must be less than 50 characters"),
  link: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => {
      try {
        const urlObj = new URL(url)
        return urlObj.protocol === "http:" || urlObj.protocol === "https:"
      } catch {
        return false
      }
    }, "Please enter a valid HTTP or HTTPS URL"),
  pitch: z
    .string()
    .min(10, "Pitch must be at least 10 characters")
    .max(5000, "Pitch must be less than 5000 characters"),
})
