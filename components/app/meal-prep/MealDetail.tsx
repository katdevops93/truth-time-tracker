"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ChefHat, Package } from "lucide-react"
import { format } from "date-fns"

interface Ingredient {
  id: string
  name: string
  quantity: string
}

interface Recipe {
  id: string
  instructions: string
  ingredients: Ingredient[]
}

interface Meal {
  id: string
  title: string
  description?: string
  date: string
  createdAt: string
  updatedAt: string
  recipes: Recipe[]
}

interface MealDetailProps {
  meal: Meal
}

export function MealDetail({ meal }: MealDetailProps) {
  const totalIngredients = meal.recipes.flatMap(recipe => recipe.ingredients).length

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {format(new Date(meal.date), "EEEE, MMMM dd, yyyy")}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Created {format(new Date(meal.createdAt), "MMM dd, yyyy 'at' h:mm a")}
        </div>
      </div>

      {meal.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{meal.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meal.recipes.length}</div>
            <p className="text-xs text-muted-foreground">
              {meal.recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIngredients}</div>
            <p className="text-xs text-muted-foreground">
              {totalIngredients === 1 ? "ingredient" : "ingredients"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Planned</Badge>
          </CardContent>
        </Card>
      </div>

      {meal.recipes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Recipes & Instructions
          </h3>
          
          <div className="grid gap-4">
            {meal.recipes.map((recipe, index) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Recipe {index + 1}
                  </CardTitle>
                  <CardDescription>
                    {recipe.ingredients.length} {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Instructions</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {recipe.instructions}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Ingredients
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {recipe.ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="flex justify-between text-sm">
                          <span className="font-medium">{ingredient.name}</span>
                          <span className="text-muted-foreground">{ingredient.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {meal.recipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No recipes yet</h3>
            <p className="text-muted-foreground">
              This meal doesn't have any recipes. Add some recipes to get started!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}