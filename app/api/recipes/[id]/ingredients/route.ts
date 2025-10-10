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

    const recipe = await prisma.recipe.findFirst({
      where: {
        id: params.id,
        meal: {
          userId
        }
      }
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    const ingredients = await prisma.ingredient.findMany({
      where: { recipeId: params.id },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ ingredients })

  } catch (error) {
    console.error('Error retrieving ingredients:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve ingredients' 
    }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, quantity } = await request.json()

    if (!name || !quantity || typeof name !== 'string' || typeof quantity !== 'string') {
      return NextResponse.json({ 
        error: 'Name and quantity are required and must be strings' 
      }, { status: 400 })
    }

    const recipe = await prisma.recipe.findFirst({
      where: {
        id: params.id,
        meal: {
          userId
        }
      }
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        recipeId: params.id,
        name: name.trim(),
        quantity: quantity.trim()
      }
    })

    return NextResponse.json({ 
      message: 'Ingredient created successfully',
      ingredient 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating ingredient:', error)
    return NextResponse.json({ 
      error: 'Failed to create ingredient' 
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

    const { ingredients } = await request.json()

    if (!Array.isArray(ingredients)) {
      return NextResponse.json({ 
        error: 'Ingredients must be an array' 
      }, { status: 400 })
    }

    const recipe = await prisma.recipe.findFirst({
      where: {
        id: params.id,
        meal: {
          userId
        }
      }
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({
        where: { recipeId: params.id }
      })

      for (const ingredient of ingredients) {
        if (ingredient.name && ingredient.quantity) {
          await tx.ingredient.create({
            data: {
              recipeId: params.id,
              name: ingredient.name.trim(),
              quantity: ingredient.quantity.trim()
            }
          })
        }
      }
    })

    const updatedIngredients = await prisma.ingredient.findMany({
      where: { recipeId: params.id },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ 
      message: 'Ingredients updated successfully',
      ingredients: updatedIngredients 
    })

  } catch (error) {
    console.error('Error updating ingredients:', error)
    return NextResponse.json({ 
      error: 'Failed to update ingredients' 
    }, { status: 500 })
  }
}