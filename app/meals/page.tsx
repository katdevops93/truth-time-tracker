"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/app/Layout"
import { MealList } from "@/components/app/meal-prep/MealList"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MealForm } from "@/components/app/meal-prep/MealForm"
import { Plus, ChefHat } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useMeals, useCreateMeal, type Meal } from "@/lib/hooks/meal-prep"

export default function MealsPage() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  
  const initialPage = parseInt(searchParams.get('page') || '1')
  const initialSearch = searchParams.get('search') || ''

  useEffect(() => {
    setPage(initialPage)
    setSearchQuery(initialSearch)
  }, [initialPage, initialSearch])

  const { data, isLoading, error } = useMeals(page, 10, searchQuery)
  const createMealMutation = useCreateMeal()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    if (searchQuery) params.set('search', searchQuery)
    window.history.pushState({}, '', `${window.location.pathname}?${params}`)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    if (query) params.set('search', query)
    else params.delete('search')
    window.history.pushState({}, '', `${window.location.pathname}?${params}`)
  }

  const handleMealCreated = (data: any) => {
    createMealMutation.mutate(data)
    setCreateDialogOpen(false)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error loading meals</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <MealList
        meals={data?.meals || []}
        pagination={data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 }}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onCreateMeal={() => setCreateDialogOpen(true)}
        isLoading={isLoading}
      />

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Meal</DialogTitle>
          </DialogHeader>
          <MealForm
            onSubmit={handleMealCreated}
            isLoading={createMealMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  )
}