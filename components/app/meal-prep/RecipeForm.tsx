"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, X, ChefHat } from "lucide-react"
import { IngredientList } from "./IngredientList"

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required")
})

const recipeSchema = z.object({
  instructions: z.string().min(1, "Instructions are required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required")
})

type RecipeFormData = z.infer<typeof recipeSchema>

interface RecipeFormProps {
  mealId?: string
  initialData?: Partial<RecipeFormData>
  onSubmit: (data: RecipeFormData) => void
  isLoading?: boolean
  trigger?: React.ReactNode
}

export function RecipeForm({
  mealId,
  initialData,
  onSubmit,
  isLoading = false,
  trigger
}: RecipeFormProps) {
  const [open, setOpen] = useState(false)
  const [ingredients, setIngredients] = useState<z.infer<typeof ingredientSchema>[]>(
    initialData?.ingredients || [{ name: "", quantity: "" }]
  )

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      instructions: initialData?.instructions || "",
      ingredients: ingredients
    }
  })

  const addIngredient = () => {
    const newIngredients = [...ingredients, { name: "", quantity: "" }]
    setIngredients(newIngredients)
    form.setValue("ingredients", newIngredients)
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index)
      setIngredients(newIngredients)
      form.setValue("ingredients", newIngredients)
    }
  }

  const updateIngredient = (index: number, field: keyof z.infer<typeof ingredientSchema>, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
    form.setValue("ingredients", newIngredients)
  }

  const handleSubmit = (data: RecipeFormData) => {
    const validIngredients = data.ingredients.filter(
      ingredient => ingredient.name.trim() && ingredient.quantity.trim()
    )
    
    if (validIngredients.length === 0) {
      form.setError("ingredients", { message: "At least one valid ingredient is required" })
      return
    }

    onSubmit({
      ...data,
      ingredients: validIngredients
    })
    setOpen(false)
    form.reset()
    setIngredients([{ name: "", quantity: "" }])
  }

  const handleCancel = () => {
    setOpen(false)
    form.reset()
    setIngredients([{ name: "", quantity: "" }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Recipe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            {initialData ? "Edit Recipe" : "Create New Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter cooking instructions..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Ingredients</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ingredient
                </Button>
              </div>

              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Ingredient name"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, "name", e.target.value)}
                          />
                          <Input
                            placeholder="Quantity (e.g., 1 cup, 2 tbsp, 100g)"
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                          />
                        </div>
                        {ingredients.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                            className="mt-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {form.formState.errors.ingredients && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.ingredients.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : initialData ? "Update Recipe" : "Create Recipe"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}