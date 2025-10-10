"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { MealDetail } from "./MealDetail"

interface Meal {
  id: string
  title: string
  description?: string
  date: string
  createdAt: string
  updatedAt: string
  recipes: {
    id: string
    instructions: string
    ingredients: {
      id: string
      name: string
      quantity: string
    }[]
  }[]
}

interface MealListProps {
  meals: Meal[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  onCreateMeal: () => void
  isLoading?: boolean
}

export function MealList({
  meals,
  pagination,
  onPageChange,
  onSearch,
  onCreateMeal,
  isLoading = false
}: MealListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meals</h2>
          <p className="text-muted-foreground">
            Manage your meal prep plans and recipes
          </p>
        </div>
        <Button onClick={onCreateMeal} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Meal
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No meals found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first meal"}
          </p>
          {!searchQuery && (
            <Button onClick={onCreateMeal}>
              <Plus className="mr-2 h-4 w-4" />
              Create Meal
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meals.map((meal) => (
              <Card key={meal.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <Dialog>
                  <DialogTrigger asChild>
                    <CardHeader onClick={() => setSelectedMeal(meal)}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{meal.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(meal.date), "MMM dd, yyyy")}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {meal.recipes.length} {meal.recipes.length === 1 ? "recipe" : "recipes"}
                        </Badge>
                      </div>
                      {meal.description && (
                        <CardDescription className="line-clamp-2">
                          {meal.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{meal.title}</DialogTitle>
                    </DialogHeader>
                    {selectedMeal && <MealDetail meal={selectedMeal} />}
                  </DialogContent>
                </Dialog>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Created {format(new Date(meal.createdAt), "MMM dd, yyyy")}
                    </div>
                    {meal.recipes.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Ingredients:</span>{" "}
                        {meal.recipes.flatMap(r => r.ingredients).length} total
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}