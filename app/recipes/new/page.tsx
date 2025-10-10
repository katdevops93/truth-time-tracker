"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/app/Layout"
import { RecipeForm } from "@/components/app/meal-prep/RecipeForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useRecipes, useCreateRecipe, useMeals } from "@/lib/hooks/meal-prep"

export default function NewRecipePage() {
  const router = useRouter()
  const [selectedMealId, setSelectedMealId] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)

  const { data: mealsData, isLoading: mealsLoading } = useMeals(1, 100)
  const createRecipeMutation = useCreateRecipe()

  const meals = mealsData?.meals || []

  const handleCreateRecipe = (data: any) => {
    if (!selectedMealId) {
      alert('Please select a meal for this recipe')
      return
    }

    createRecipeMutation.mutate({
      mealId: selectedMealId,
      instructions: data.instructions,
      ingredients: data.ingredients
    }, {
      onSuccess: () => {
        router.push(`/meals/${selectedMealId}`)
      }
    })
  }

  const handleCreateNewMeal = () => {
    router.push('/meals?create=true')
  }

  if (mealsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/meals">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Recipe</h1>
        </div>
        <p className="text-muted-foreground">
          Add a new recipe to one of your existing meals, or create a new meal first.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Recipe Details
              </CardTitle>
              <CardDescription>
                Enter the cooking instructions and ingredients for your recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMealId ? (
                <RecipeForm
                  mealId={selectedMealId}
                  onSubmit={handleCreateRecipe}
                  isLoading={createRecipeMutation.isPending}
                />
              ) : (
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Meal First</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose an existing meal or create a new one to add this recipe to.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Meal</CardTitle>
              <CardDescription>
                Select which meal this recipe belongs to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meals && meals.length > 0 ? (
                <Select value={selectedMealId} onValueChange={setSelectedMealId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meal" />
                  </SelectTrigger>
                  <SelectContent>
                    {meals.map((meal) => (
                      <SelectItem key={meal.id} value={meal.id}>
                        {meal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    No meals found. Create your first meal to get started.
                  </p>
                  <Button onClick={handleCreateNewMeal} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Meal
                  </Button>
                </div>
              )}
              
              {selectedMealId && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-1">
                    Selected Meal:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {meals?.find(m => m.id === selectedMealId)?.title}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need a New Meal?</CardTitle>
              <CardDescription>
                Create a new meal to organize your recipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateNewMeal} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Meal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  )
}