"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import MDEditor from "@uiw/react-md-editor"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { formSchema } from "@/lib/validation"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { createPitch } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pitch, setPitch] = useState("")
  // Add state to preserve form values
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
  })

  const { toast } = useToast()
  const router = useRouter()

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      // Clear previous errors
      setErrors({})

      const currentFormValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      }

      // Debug: Log the form values
      // console.log("Form values:", currentFormValues)
      // console.log("Pitch value:", pitch)

      // Store form values to preserve them if validation fails
      setFormValues({
        title: currentFormValues.title,
        description: currentFormValues.description,
        category: currentFormValues.category,
        link: currentFormValues.link,
      })

      // Validate the form data
      try {
        await formSchema.parseAsync(currentFormValues)
      //  console.log("Validation passed!")
      } catch (validationError) {
        console.log("Validation error:", validationError)
       // throw validationError
      }

      // Call the server action with the correct parameters
      const result = await createPitch(prevState, formData, pitch)

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        })

        // Clear form on success
        setFormValues({ title: "", description: "", category: "", link: "" })
        setPitch("")

        router.push(`/startup/${result._id}`)
      } else {
        // Handle server-side errors
        toast({
          title: "Error",
          description: result.error || "Failed to create pitch",
          variant: "destructive",
        })
      }

      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        const errorRecord: Record<string, string> = {}

        // Convert array of errors to single string per field
        Object.entries(fieldErrors).forEach(([key, messages]) => {
          if (messages && messages.length > 0) {
            errorRecord[key] = messages[0]
          }
        })

        setErrors(errorRecord)

        toast({
          title: "Validation Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        })

        return {
          ...prevState,
          error: "Validation failed",
          status: "ERROR",
          fieldErrors: errorRecord,
        }
      }

      console.error("Form submission error:", error)

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      })

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      }
    }
  }

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  })

  // Handle input changes to preserve values
  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={formValues.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formValues.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && <p className="startup-form_error">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          value={formValues.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />
        {errors.category && <p className="startup-form_error">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          value={formValues.link}
          onChange={(e) => handleInputChange("link", e.target.value)}
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => {
            setPitch(value as string)
            // Clear pitch error when user starts typing
            if (errors.pitch) {
              setErrors((prev) => ({ ...prev, pitch: "" }))
            }
          }}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  )
}

export default StartupForm
