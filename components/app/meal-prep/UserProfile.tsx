"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Clock, Utensils, Target } from "lucide-react"

const profileSchema = z.object({
  dietaryPreferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  cookingSkillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  preferredCookingTime: z.number().min(15).max(480).optional(),
  mealPrepFrequency: z.enum(["daily", "weekly", "bi-weekly", "monthly"]).optional(),
  servingsPerMeal: z.number().min(1).max(20).optional(),
  favoriteCuisines: z.array(z.string()).optional(),
  avoidIngredients: z.array(z.string()).optional(),
  notificationsEnabled: z.boolean().default(true),
  shoppingListEnabled: z.boolean().default(true)
})

type ProfileFormData = z.infer<typeof profileSchema>

interface UserProfileProps {
  initialData?: Partial<ProfileFormData>
  onSave: (data: ProfileFormData) => void
  isLoading?: boolean
}

export function UserProfile({
  initialData,
  onSave,
  isLoading = false
}: UserProfileProps) {
  const [newDietaryPreference, setNewDietaryPreference] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [newFavoriteCuisine, setNewFavoriteCuisine] = useState("")
  const [newAvoidIngredient, setNewAvoidIngredient] = useState("")

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dietaryPreferences: initialData?.dietaryPreferences || [],
      allergies: initialData?.allergies || [],
      cookingSkillLevel: initialData?.cookingSkillLevel || "intermediate",
      preferredCookingTime: initialData?.preferredCookingTime || 60,
      mealPrepFrequency: initialData?.mealPrepFrequency || "weekly",
      servingsPerMeal: initialData?.servingsPerMeal || 4,
      favoriteCuisines: initialData?.favoriteCuisines || [],
      avoidIngredients: initialData?.avoidIngredients || [],
      notificationsEnabled: initialData?.notificationsEnabled ?? true,
      shoppingListEnabled: initialData?.shoppingListEnabled ?? true
    }
  })

  const addToArray = (field: keyof ProfileFormData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = form.getValues(field) as string[] || []
      const newArray = [...currentArray, value.trim()]
      form.setValue(field, newArray)
      setter("")
    }
  }

  const removeFromArray = (field: keyof ProfileFormData, index: number) => {
    const currentArray = form.getValues(field) as string[] || []
    const newArray = currentArray.filter((_, i) => i !== index)
    form.setValue(field, newArray)
  }

  const handleSubmit = (data: ProfileFormData) => {
    onSave(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Meal Prep Profile</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Cooking Preferences
                </CardTitle>
                <CardDescription>
                  Tell us about your cooking style and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cookingSkillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredCookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Cooking Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="15"
                          max="480"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Average time you prefer to spend cooking
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mealPrepFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Prep Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How often do you meal prep?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="servingsPerMeal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings per Meal</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of servings you typically prepare
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Dietary Information
                </CardTitle>
                <CardDescription>
                  Help us customize your meal recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Vegetarian, Keto, Paleo"
                      value={newDietaryPreference}
                      onChange={(e) => setNewDietaryPreference(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArray("dietaryPreferences", newDietaryPreference, setNewDietaryPreference)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addToArray("dietaryPreferences", newDietaryPreference, setNewDietaryPreference)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("dietaryPreferences") || []).map((preference, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer"
                        onClick={() => removeFromArray("dietaryPreferences", index)}>
                        {preference} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <FormLabel>Allergies</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Nuts, Dairy, Gluten"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArray("allergies", newAllergy, setNewAllergy)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addToArray("allergies", newAllergy, setNewAllergy)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("allergies") || []).map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="cursor-pointer"
                        onClick={() => removeFromArray("allergies", index)}>
                        {allergy} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <FormLabel>Ingredients to Avoid</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Mushrooms, Cilantro"
                      value={newAvoidIngredient}
                      onChange={(e) => setNewAvoidIngredient(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArray("avoidIngredients", newAvoidIngredient, setNewAvoidIngredient)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addToArray("avoidIngredients", newAvoidIngredient, setNewAvoidIngredient)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("avoidIngredients") || []).map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer"
                        onClick={() => removeFromArray("avoidIngredients", index)}>
                        {ingredient} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <FormLabel>Favorite Cuisines</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Italian, Mexican, Thai"
                      value={newFavoriteCuisine}
                      onChange={(e) => setNewFavoriteCuisine(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArray("favoriteCuisines", newFavoriteCuisine, setNewFavoriteCuisine)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addToArray("favoriteCuisines", newFavoriteCuisine, setNewFavoriteCuisine)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("favoriteCuisines") || []).map((cuisine, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer"
                        onClick={() => removeFromArray("favoriteCuisines", index)}>
                        {cuisine} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Notifications & Features
              </CardTitle>
              <CardDescription>
                Configure your meal prep reminders and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notificationsEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Meal Prep Reminders</FormLabel>
                      <FormDescription>
                        Get notifications for meal prep planning
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shoppingListEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Shopping Lists</FormLabel>
                      <FormDescription>
                        Automatically generate shopping lists from meals
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}