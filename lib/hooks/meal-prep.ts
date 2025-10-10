import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { toast } from "sonner"

// Types
export interface Meal {
  id: string
  title: string
  description?: string
  date: string
  createdAt: string
  updatedAt: string
  recipes: Recipe[]
}

export interface Recipe {
  id: string
  instructions: string
  ingredients: Ingredient[]
  mealId?: string
  meal?: {
    id: string
    title: string
    date: string
  }
}

export interface Ingredient {
  id: string
  name: string
  quantity: string
  recipeId: string
}

export interface MealsResponse {
  meals: Meal[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface RecipesResponse {
  recipes: Recipe[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// API functions
async function fetchMeals(page: number = 1, limit: number = 10, search?: string): Promise<MealsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  
  const response = await fetch(`/api/meals?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch meals')
  }
  
  return response.json()
}

async function fetchMeal(id: string): Promise<Meal> {
  const response = await fetch(`/api/meals/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Meal not found')
    }
    throw new Error('Failed to fetch meal')
  }
  
  return response.json()
}

async function createMeal(data: {
  title: string
  description?: string
  date: string
  recipes?: Array<{
    instructions: string
    ingredients: Array<{ name: string; quantity: string }>
  }>
}): Promise<Meal> {
  const response = await fetch('/api/meals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create meal')
  }

  return response.json()
}

async function updateMeal(id: string, data: {
  title: string
  description?: string
  date?: string
  recipes?: Array<{
    instructions: string
    ingredients: Array<{ name: string; quantity: string }>
  }>
}): Promise<Meal> {
  const response = await fetch(`/api/meals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update meal')
  }

  return response.json()
}

async function deleteMeal(id: string): Promise<void> {
  const response = await fetch(`/api/meals/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete meal')
  }
}

async function fetchRecipes(page: number = 1, limit: number = 10, search?: string, mealId?: string): Promise<RecipesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(mealId && { mealId })
  })
  
  const response = await fetch(`/api/recipes?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch recipes')
  }
  
  return response.json()
}

async function fetchRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`/api/recipes/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Recipe not found')
    }
    throw new Error('Failed to fetch recipe')
  }
  
  return response.json()
}

async function createRecipe(data: {
  mealId: string
  instructions: string
  ingredients?: Array<{ name: string; quantity: string }>
}): Promise<Recipe> {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create recipe')
  }

  return response.json()
}

async function updateRecipe(id: string, data: {
  instructions: string
  ingredients?: Array<{ name: string; quantity: string }>
}): Promise<Recipe> {
  const response = await fetch(`/api/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update recipe')
  }

  return response.json()
}

async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`/api/recipes/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete recipe')
  }
}

async function fetchIngredients(recipeId: string): Promise<Ingredient[]> {
  const response = await fetch(`/api/recipes/${recipeId}/ingredients`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch ingredients')
  }
  
  return response.json()
}

async function createIngredient(recipeId: string, data: {
  name: string
  quantity: string
}): Promise<Ingredient> {
  const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create ingredient')
  }

  return response.json()
}

async function updateIngredients(recipeId: string, ingredients: Array<{
  name: string
  quantity: string
}>): Promise<Ingredient[]> {
  const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  })

  if (!response.ok) {
    throw new Error('Failed to update ingredients')
  }

  return response.json()
}

// Hooks
export function useMeals(page: number = 1, limit: number = 10, search?: string) {
  return useQuery({
    queryKey: ['meals', page, limit, search],
    queryFn: () => fetchMeals(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => fetchMeal(id),
    enabled: !!id,
    retry: false,
  })
}

export function useCreateMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMeal,
    onMutate: async (newMeal) => {
      await queryClient.cancelQueries({ queryKey: ['meals'] })
      
      const previousMeals = queryClient.getQueryData(['meals'])
      
      queryClient.setQueryData(['meals'], (old: MealsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          meals: [newMeal as Meal, ...old.meals],
          pagination: {
            ...old.pagination,
            total: old.pagination.total + 1
          }
        }
      })

      return { previousMeals }
    },
    onError: (err, newMeal, context) => {
      queryClient.setQueryData(['meals'], context?.previousMeals)
      toast.error('Failed to create meal')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
    onSuccess: () => {
      toast.success('Meal created successfully')
    }
  })
}

export function useUpdateMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateMeal>[1]) => 
      updateMeal(id, data),
    onMutate: async ({ id, ...data }) => {
      await queryClient.cancelQueries({ queryKey: ['meals'] })
      await queryClient.cancelQueries({ queryKey: ['meal', id] })
      
      const previousMeal = queryClient.getQueryData(['meal', id])
      
      queryClient.setQueryData(['meal', id], (old: Meal | undefined) => {
        if (!old) return old
        return { ...old, ...data }
      })

      return { previousMeal }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['meal', variables.id], context?.previousMeal)
      toast.error('Failed to update meal')
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['meal', variables.id] })
    },
    onSuccess: () => {
      toast.success('Meal updated successfully')
    }
  })
}

export function useDeleteMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMeal,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['meals'] })
      
      const previousMeals = queryClient.getQueryData(['meals'])
      
      queryClient.setQueryData(['meals'], (old: MealsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          meals: old.meals.filter(meal => meal.id !== id),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1
          }
        }
      })

      return { previousMeals }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['meals'], context?.previousMeals)
      toast.error('Failed to delete meal')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
    onSuccess: () => {
      toast.success('Meal deleted successfully')
    }
  })
}

export function useRecipes(page: number = 1, limit: number = 10, search?: string, mealId?: string) {
  return useQuery({
    queryKey: ['recipes', page, limit, search, mealId],
    queryFn: () => fetchRecipes(page, limit, search, mealId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id),
    enabled: !!id,
    retry: false,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['meal', data.mealId] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recipe created successfully')
    },
    onError: () => {
      toast.error('Failed to create recipe')
    }
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateRecipe>[1]) => 
      updateRecipe(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] })
      toast.success('Recipe updated successfully')
    },
    onError: () => {
      toast.error('Failed to update recipe')
    }
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recipe deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete recipe')
    }
  })
}

export function useIngredients(recipeId: string) {
  return useQuery({
    queryKey: ['ingredients', recipeId],
    queryFn: () => fetchIngredients(recipeId),
    enabled: !!recipeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recipeId, ...data }: { recipeId: string } & Parameters<typeof createIngredient>[1]) => 
      createIngredient(recipeId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients', variables.recipeId] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', data.recipeId] })
      toast.success('Ingredient added successfully')
    },
    onError: () => {
      toast.error('Failed to add ingredient')
    }
  })
}

export function useUpdateIngredients() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recipeId, ingredients }: { recipeId: string; ingredients: Parameters<typeof updateIngredients>[1] }) => 
      updateIngredients(recipeId, ingredients),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['ingredients', variables.recipeId], data)
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.recipeId] })
      toast.success('Ingredients updated successfully')
    },
    onError: () => {
      toast.error('Failed to update ingredients')
    }
  })
}