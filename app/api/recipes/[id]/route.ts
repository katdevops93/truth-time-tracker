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
      },
      include: {
        meal: {
          select: {
            id: true,
            title: true,
            date: true
          }
        },
        ingredients: true
      }
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json({ recipe })

  } catch (error) {
    console.error('Error retrieving recipe:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve recipe' 
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

    const { instructions, ingredients } = await request.json()

    if (!instructions || typeof instructions !== 'string') {
      return NextResponse.json({ 
        error: 'Instructions are required and must be a string' 
      }, { status: 400 })
    }

    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        id: params.id,
        meal: {
          userId
        }
      }
    })

    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    const recipe = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        instructions: instructions.trim(),
        ingredients: ingredients ? {
          deleteMany: {},
          create: ingredients.map((ingredient: any) => ({
            name: ingredient.name.trim(),
            quantity: ingredient.quantity.trim()
          }))
        } : undefined
      },
      include: {
        meal: {
          select: {
            id: true,
            title: true,
            date: true
          }
        },
        ingredients: true
      }
    })

    return NextResponse.json({ 
      message: 'Recipe updated successfully',
      recipe 
    })

  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json({ 
      error: 'Failed to update recipe' 
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

    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        id: params.id,
        meal: {
          userId
        }
      }
    })

    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    await prisma.recipe.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Recipe deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json({ 
      error: 'Failed to delete recipe' 
    }, { status: 500 })
  }
}