"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { RecipeForm } from "./RecipeForm"

const recipeSchema = z.object({
  instructions: z.string().min(1, "Instructions are required"),
  ingredients: z.array(z.object({
    name: z.string().min(1, "Ingredient name is required"),
    quantity: z.string().min(1, "Quantity is required")
  })).min(1, "At least one ingredient is required")
})

const mealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Meal date is required",
  }),
  recipes: z.array(recipeSchema).optional()
})

type MealFormData = z.infer<typeof mealSchema>

interface MealFormProps {
  initialData?: Partial<MealFormData>
  onSubmit: (data: MealFormData) => void
  isLoading?: boolean
}

export function MealForm({
  initialData,
  onSubmit,
  isLoading = false
}: MealFormProps) {
  const [recipes, setRecipes] = useState<z.infer<typeof recipeSchema>[]>([])

  const form = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || new Date(),
      recipes: initialData?.recipes || []
    }
  })

  const handleSubmit = (data: MealFormData) => {
    const submissionData = {
      ...data,
      recipes: recipes.length > 0 ? recipes : undefined
    }
    onSubmit(submissionData)
    form.reset()
    setRecipes([])
  }

  const addRecipe = (recipeData: z.infer<typeof recipeSchema>) => {
    setRecipes([...recipes, recipeData])
  }

  const removeRecipe = (index: number) => {
    setRecipes(recipes.filter((_, i) => i !== index))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weekly Meal Prep, Sunday Dinner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add a description for this meal..."
                  className="min-h-20"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Add any notes about this meal prep session
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Meal Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date for this meal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recipes</h3>
              <p className="text-sm text-muted-foreground">
                Add recipes to include in this meal
              </p>
            </div>
            <RecipeForm
              trigger={
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipe
                </Button>
              }
              onSubmit={addRecipe}
            />
          </div>

          {recipes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No recipes added yet. Add a recipe to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recipes.map((recipe, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Recipe {index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRecipe(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {recipe.ingredients.length} {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">Instructions</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {recipe.instructions}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Ingredients</h4>
                        <div className="text-xs text-muted-foreground">
                          {recipe.ingredients.slice(0, 3).map(ing => ing.name).join(", ")}
                          {recipe.ingredients.length > 3 && ` +${recipe.ingredients.length - 3} more`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Meal"}
          </Button>
        </div>
      </form>
    </Form>
  )
}