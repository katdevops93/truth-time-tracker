"use client"

import { useParams, useRouter } from "next/navigation"
import { Layout } from "@/components/app/Layout"
import { MealDetail } from "@/components/app/meal-prep/MealDetail"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMeal, useDeleteMeal } from "@/lib/hooks/meal-prep"

export default function MealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const mealId = params.id as string

  const { data: meal, isLoading, error } = useMeal(mealId)
  const deleteMealMutation = useDeleteMeal()

  const handleDelete = () => {
    if (!meal) return
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${meal.title}"? This action cannot be undone.`
    )
    
    if (confirmed) {
      deleteMealMutation.mutate(mealId, {
        onSuccess: () => {
          router.push('/meals')
        }
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            {error instanceof Error ? error.message : 'Error loading meal'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error && error.message === 'Meal not found' 
              ? 'The meal you\'re looking for doesn\'t exist or has been deleted.'
              : 'An unexpected error occurred while loading this meal.'
            }
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button asChild>
              <Link href="/meals">Back to Meals</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!meal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Meal not found</h2>
          <p className="text-muted-foreground mb-4">
            The meal you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/meals">Back to Meals</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/meals">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{meal.title}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/meals/${meal.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" onClick={handleDelete} disabled={deleteMealMutation.isPending}>
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMealMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      <MealDetail meal={meal} />
      </div>
    </Layout>
  )
}