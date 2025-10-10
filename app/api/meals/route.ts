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

    const where = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    const [meals, total] = await Promise.all([
      prisma.meal.findMany({
        where,
        include: {
          recipes: {
            include: {
              ingredients: true
            }
          }
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.meal.count({ where })
    ])

    return NextResponse.json({
      meals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error retrieving meals:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve meals' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const mealDate = date ? new Date(date) : new Date()

    const meal = await prisma.meal.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        date: mealDate,
        userId,
        recipes: recipes ? {
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
      message: 'Meal created successfully',
      meal 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating meal:', error)
    return NextResponse.json({ 
      error: 'Failed to create meal' 
    }, { status: 500 })
  }
}