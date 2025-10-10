import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const mealId = searchParams.get('mealId')

    const where = {
      meal: {
        userId
      },
      ...(mealId && { mealId }),
      ...(search && {
        instructions: { contains: search, mode: 'insensitive' as const }
      })
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: {
          meal: {
            select: {
              id: true,
              title: true,
              date: true
            }
          },
          ingredients: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.recipe.count({ where })
    ])

    return NextResponse.json({
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error retrieving recipes:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve recipes' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mealId, instructions, ingredients } = await request.json()

    if (!mealId || !instructions || typeof instructions !== 'string') {
      return NextResponse.json({ 
        error: 'Meal ID and instructions are required' 
      }, { status: 400 })
    }

    const meal = await prisma.meal.findFirst({
      where: { id: mealId, userId }
    })

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    const recipe = await prisma.recipe.create({
      data: {
        mealId,
        instructions: instructions.trim(),
        ingredients: ingredients ? {
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
      message: 'Recipe created successfully',
      recipe 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json({ 
      error: 'Failed to create recipe' 
    }, { status: 500 })
  }
}