import { prisma } from '@/lib/db'

const sampleMeals = [
  {
    title: "Weekly Meal Prep - Chicken & Vegetables",
    description: "Healthy meal prep with grilled chicken, roasted vegetables, and quinoa for the entire week",
    date: new Date('2024-01-15'),
    recipes: [
      {
        instructions: `1. Preheat oven to 400°F (200°C)
2. Season chicken breasts with olive oil, garlic powder, paprika, salt, and pepper
3. Cut vegetables into bite-sized pieces and toss with olive oil and seasonings
4. Arrange chicken and vegetables on baking sheets
5. Bake for 25-30 minutes until chicken is cooked through and vegetables are tender
6. Cook quinoa according to package directions
7. Portion into meal prep containers with quinoa, chicken, and vegetables
8. Store in refrigerator for up to 4 days`,
        ingredients: [
          { name: "Chicken breasts", quantity: "4 lbs" },
          { name: "Broccoli", quantity: "2 heads" },
          { name: "Bell peppers", quantity: "3 pieces" },
          { name: "Red onion", quantity: "1 large" },
          { name: "Zucchini", quantity: "2 medium" },
          { name: "Olive oil", quantity: "1/4 cup" },
          { name: "Garlic powder", quantity: "2 tsp" },
          { name: "Paprika", quantity: "1 tsp" },
          { name: "Salt", quantity: "1 tsp" },
          { name: "Black pepper", quantity: "1/2 tsp" },
          { name: "Quinoa", quantity: "2 cups dry" }
        ]
      }
    ]
  },
  {
    title: "Sunday Comfort Food - Beef Stew",
    description: "Hearty beef stew perfect for meal prep and freezing",
    date: new Date('2024-01-14'),
    recipes: [
      {
        instructions: `1. Cut beef into 1-inch cubes and season with salt and pepper
2. Heat oil in large pot and brown beef on all sides, then remove and set aside
3. Sauté onions, carrots, and celery until softened
4. Add garlic and cook for 1 minute
5. Add tomato paste and cook for 2 minutes
6. Return beef to pot and add beef broth, red wine, and herbs
7. Bring to simmer, then reduce heat and cover
8. Cook for 2-3 hours until beef is tender
9. Add potatoes and carrots and cook for additional 30 minutes
10. Season to taste and let cool before portioning`,
        ingredients: [
          { name: "Beef chuck", quantity: "3 lbs" },
          { name: "Onions", quantity: "2 large" },
          { name: "Carrots", quantity: "4 medium" },
          { name: "Celery", quantity: "3 stalks" },
          { name: "Potatoes", quantity: "4 medium" },
          { name: "Beef broth", quantity: "6 cups" },
          { name: "Red wine", quantity: "1 cup" },
          { name: "Tomato paste", quantity: "2 tbsp" },
          { name: "Garlic", quantity: "4 cloves" },
          { name: "Thyme", quantity: "2 tsp" },
          { name: "Bay leaves", quantity: "2 leaves" },
          { name: "Olive oil", quantity: "2 tbsp" }
        ]
      }
    ]
  },
  {
    title: "Mediterranean Bowl Prep",
    description: "Fresh and colorful Mediterranean grain bowls with falafel and tahini dressing",
    date: new Date('2024-01-13'),
    recipes: [
      {
        instructions: `1. Cook quinoa according to package directions and let cool
2. Roast chickpeas with olive oil and spices at 400°F for 20 minutes
3. Prepare homemade or store-bought falafel according to instructions
4. Chop cucumber, tomatoes, red onion, and parsley for salad
5. Make tahini dressing by whisking tahini, lemon juice, garlic, and water
6. Assemble bowls with quinoa base, topped with falafel, roasted chickpeas, and fresh vegetables
7. Drizzle with tahini dressing and store components separately`,
        ingredients: [
          { name: "Quinoa", quantity: "2 cups dry" },
          { name: "Chickpeas", quantity: "2 cans" },
          { name: "Falafel", quantity: "12 pieces" },
          { name: "Cucumber", quantity: "2 medium" },
          { name: "Tomatoes", quantity: "3 medium" },
          { name: "Red onion", quantity: "1 medium" },
          { name: "Fresh parsley", quantity: "1 bunch" },
          { name: "Tahini", quantity: "1/2 cup" },
          { name: "Lemon juice", quantity: "1/4 cup" },
          { name: "Garlic", quantity: "2 cloves" },
          { name: "Olive oil", quantity: "2 tbsp" },
          { name: "Cumin", quantity: "1 tsp" }
        ]
      }
    ]
  },
  {
    title: "Asian Stir-Fry Meal Prep",
    description: "Quick and healthy vegetable stir-fry with tofu and sesame ginger sauce",
    date: new Date('2024-01-12'),
    recipes: [
      {
        instructions: `1. Press tofu to remove excess water and cut into cubes
2. Prepare brown rice according to package directions
3. Mix soy sauce, sesame oil, ginger, garlic, and honey for sauce
4. Heat wok or large pan over high heat with oil
5. Stir-fry tofu until golden brown, then remove
6. Stir-fry vegetables in batches until crisp-tender
7. Return tofu to pan and add sauce
8. Toss everything together and garnish with sesame seeds and green onions
9. Portion with rice for complete meals`,
        ingredients: [
          { name: "Firm tofu", quantity: "2 blocks" },
          { name: "Brown rice", quantity: "2 cups dry" },
          { name: "Broccoli", quantity: "1 head" },
          { name: "Bell peppers", quantity: "2 pieces" },
          { name: "Snap peas", quantity: "1 cup" },
          { name: "Carrots", quantity: "2 medium" },
          { name: "Soy sauce", quantity: "1/4 cup" },
          { name: "Sesame oil", quantity: "2 tbsp" },
          { name: "Fresh ginger", quantity: "1 tbsp" },
          { name: "Garlic", quantity: "3 cloves" },
          { name: "Honey", quantity: "1 tbsp" },
          { name: "Sesame seeds", quantity: "2 tbsp" }
        ]
      }
    ]
  },
  {
    title: "Mexican Fiesta Burrito Bowls",
    description: "Flavorful burrito bowls with seasoned ground beef, beans, and fresh toppings",
    date: new Date('2024-01-11'),
    recipes: [
      {
        instructions: `1. Cook rice according to package directions
2. Brown ground beef with taco seasoning
3. Heat black beans and corn
4. Make pico de gallo with diced tomatoes, onions, cilantro, and lime juice
5. Prepare guacamole with avocados, lime juice, and seasonings
6. Assemble bowls with rice base, topped with beef, beans, corn, and fresh toppings
7. Add cheese, sour cream, and tortilla chips if desired
8. Store components separately for best freshness`,
        ingredients: [
          { name: "Ground beef", quantity: "2 lbs" },
          { name: "Rice", quantity: "2 cups dry" },
          { name: "Black beans", quantity: "2 cans" },
          { name: "Corn", quantity: "1 can" },
          { name: "Tomatoes", quantity: "4 medium" },
          { name: "Onions", quantity: "2 medium" },
          { name: "Cilantro", quantity: "1 bunch" },
          { name: "Limes", quantity: "4 pieces" },
          { name: "Avocados", quantity: "4 pieces" },
          { name: "Cheddar cheese", quantity: "2 cups shredded" },
          { name: "Sour cream", quantity: "1 cup" },
          { name: "Taco seasoning", quantity: "3 tbsp" }
        ]
      }
    ]
  },
  {
    title: "Italian Pasta Primavera",
    description: "Fresh pasta with seasonal vegetables and homemade marinara sauce",
    date: new Date('2024-01-10'),
    recipes: [
      {
        instructions: `1. Cook pasta according to package directions
2. Make marinara sauce by sautéing garlic and onions, adding crushed tomatoes, and simmering
3. Roast vegetables with olive oil and Italian herbs at 425°F for 20 minutes
4. Combine cooked pasta with marinara sauce and roasted vegetables
5. Top with fresh basil and parmesan cheese
6. Let cool before portioning into containers
7. Refrigerate for up to 3 days or freeze for longer storage`,
        ingredients: [
          { name: "Penne pasta", quantity: "2 lbs" },
          { name: "Crushed tomatoes", quantity: "2 cans" },
          { name: "Zucchini", quantity: "3 medium" },
          { name: "Cherry tomatoes", quantity: "2 pints" },
          { name: "Red bell peppers", quantity: "2 pieces" },
          { name: "Onions", quantity: "2 medium" },
          { name: "Garlic", quantity: "6 cloves" },
          { name: "Fresh basil", quantity: "1 bunch" },
          { name: "Parmesan cheese", quantity: "1 cup grated" },
          { name: "Olive oil", quantity: "1/4 cup" },
          { name: "Italian seasoning", quantity: "2 tsp" },
          { name: "Red pepper flakes", quantity: "1/2 tsp" }
        ]
      }
    ]
  }
]

async function createSampleMeals(userId: string) {
  console.log('Creating sample meals...')
  
  for (const mealData of sampleMeals) {
    try {
      const meal = await prisma.meal.create({
        data: {
          title: mealData.title,
          description: mealData.description,
          date: mealData.date,
          userId,
          recipes: {
            create: mealData.recipes.map(recipe => ({
              instructions: recipe.instructions,
              ingredients: {
                create: recipe.ingredients.map(ingredient => ({
                  name: ingredient.name,
                  quantity: ingredient.quantity
                }))
              }
            }))
          }
        },
        include: {
          recipes: {
            include: {
              ingredients: true
            }
          }
        }
      })
      
      console.log(`✅ Created meal: ${meal.title}`)
      console.log(`   Recipes: ${meal.recipes.length}`)
      console.log(`   Total ingredients: ${meal.recipes.reduce((sum, recipe) => sum + recipe.ingredients.length, 0)}`)
    } catch (error) {
      console.error(`❌ Failed to create meal: ${mealData.title}`, error)
    }
  }
}

async function seedMealPrepData() {
  try {
    console.log('🌱 Starting meal prep data seeding...')
    
    // Get or create a test user (you might need to adjust this based on your auth setup)
    let testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    })
    
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User'
        }
      })
      console.log(`✅ Created test user: ${testUser.email}`)
    } else {
      console.log(`📝 Using existing user: ${testUser.email}`)
    }
    
    // Check if meals already exist for this user
    const existingMeals = await prisma.meal.count({
      where: { userId: testUser.id }
    })
    
    if (existingMeals > 0) {
      console.log(`📊 User already has ${existingMeals} meals. Skipping seed data creation.`)
      console.log('💡 To regenerate seed data, delete existing meals first.')
      return
    }
    
    // Create sample meals
    await createSampleMeals(testUser.id)
    
    // Get final statistics
    const totalMeals = await prisma.meal.count({ where: { userId: testUser.id } })
    const totalRecipes = await prisma.recipe.count({
      where: { meal: { userId: testUser.id } }
    })
    const totalIngredients = await prisma.ingredient.count({
      where: { recipe: { meal: { userId: testUser.id } } }
    })
    
    console.log('\n🎉 Meal prep data seeding completed!')
    console.log(`📊 Summary for user ${testUser.email}:`)
    console.log(`   Meals: ${totalMeals}`)
    console.log(`   Recipes: ${totalRecipes}`)
    console.log(`   Ingredients: ${totalIngredients}`)
    
  } catch (error) {
    console.error('❌ Error seeding meal prep data:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedMealPrepData()
    .then(() => {
      console.log('✅ Seeding completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedMealPrepData, createSampleMeals }