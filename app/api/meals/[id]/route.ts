import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const meal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        userId
      },
      include: {
        recipes: {
          include: {
            ingredients: true
          }
        }
      }
    })

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    return NextResponse.json({ meal })

  } catch (error) {
    console.error('Error retrieving meal:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve meal' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, date, recipes } = await request.json()

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ 
        error: 'Title is required and must be a string' 
      }, { status: 400 })
    }

    const existingMeal = await prisma.meal.findFirst({
      where: { id: params.id, userId }
    })

    if (!existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    const meal = await prisma.meal.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        date: date ? new Date(date) : existingMeal.date,
        recipes: recipes ? {
          deleteMany: {},
          create: recipes.map((recipe: any) => ({
            instructions: recipe.instructions.trim(),
            ingredients: recipe.ingredients ? {
              create: recipe.ingredients.map((ingredient: any) => ({
                name: ingredient.name.trim(),
                quantity: ingredient.quantity.trim()
              }))
            } : undefined
          }))
        } : undefined
      },
      include: {
        recipes: {
          include: {
            ingredients: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Meal updated successfully',
      meal 
    })

  } catch (error) {
    console.error('Error updating meal:', error)
    return NextResponse.json({ 
      error: 'Failed to update meal' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingMeal = await prisma.meal.findFirst({
      where: { id: params.id, userId }
    })

    if (!existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    await prisma.meal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Meal deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting meal:', error)
    return NextResponse.json({ 
      error: 'Failed to delete meal' 
    }, { status: 500 })
  }
}