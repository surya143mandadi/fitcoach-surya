import type { Meal } from '../types'

// Nutrition targets (daily average)
export const NUTRITION_TARGETS = {
  kcalMin: 1850, kcalMax: 1900,
  proteinMin: 140, proteinMax: 150,
  waterMl: 2500
}

// Indian non-vegetarian meal suggestions (chicken, fish, prawns, lamb).
// Breakfast staples: soaked oats, chia, nuts, apple.
export const MEALS: Meal[] = [
  // Breakfast
  { id: 'oats_chia', name: 'Soaked oats + chia, nuts & apple', slot: 'breakfast', kcal: 420, proteinG: 18, veg: true,
    items: ['50g oats soaked overnight', '1 tbsp chia seeds', '15g mixed nuts (almonds/walnuts)', '1 apple', '200ml milk or curd'] },
  { id: 'egg_bhurji', name: 'Masala egg bhurji + oats', slot: 'breakfast', kcal: 400, proteinG: 30, veg: false,
    items: ['3 whole eggs + 2 whites scrambled with onion/tomato', '40g oats on the side', 'Coriander & green chilli'] },
  { id: 'chicken_oats_bowl', name: 'Protein oats + boiled eggs', slot: 'breakfast', kcal: 450, proteinG: 35, veg: false,
    items: ['50g oats', '1 scoop whey', '2 boiled eggs', '1 tbsp peanut butter', 'Half a banana'] },

  // Lunch
  { id: 'chicken_curry_rice', name: 'Grilled chicken curry + rice + salad', slot: 'lunch', kcal: 560, proteinG: 48, veg: false,
    items: ['180g chicken breast (light curry)', '120g cooked basmati rice', 'Cucumber-onion salad', '1 bowl dal (optional)'] },
  { id: 'fish_curry_roti', name: 'Fish curry + 2 roti + sabzi', slot: 'lunch', kcal: 520, proteinG: 42, veg: false,
    items: ['180g fish (basa/rohu, light gravy)', '2 phulka roti', 'Mixed veg sabzi', 'Salad'] },
  { id: 'prawn_pulao', name: 'Prawn pulao + raita', slot: 'lunch', kcal: 540, proteinG: 40, veg: false,
    items: ['150g prawns', '120g rice pulao', 'Cucumber raita (low-fat curd)'] },
  { id: 'lamb_keema', name: 'Lamb keema + 2 roti + salad', slot: 'lunch', kcal: 600, proteinG: 44, veg: false,
    items: ['150g lean lamb keema (peas, minimal oil)', '2 roti', 'Kachumber salad'] },

  // Dinner
  { id: 'tandoori_chicken', name: 'Tandoori chicken + veg + curd', slot: 'dinner', kcal: 480, proteinG: 52, veg: false,
    items: ['200g tandoori chicken (no cream)', 'Grilled/stir-fry veg', '1 bowl curd'] },
  { id: 'grilled_fish_veg', name: 'Grilled fish + sauteed greens', slot: 'dinner', kcal: 420, proteinG: 44, veg: false,
    items: ['200g grilled fish with lemon & spices', 'Sauteed beans/broccoli', 'Small salad'] },
  { id: 'prawn_stirfry', name: 'Prawn & veg stir-fry', slot: 'dinner', kcal: 400, proteinG: 40, veg: false,
    items: ['180g prawns', 'Capsicum, onion, greens', '1 tsp oil, spices', 'Optional half bowl rice'] },
  { id: 'egg_curry_roti', name: 'Egg curry + roti', slot: 'dinner', kcal: 450, proteinG: 30, veg: false,
    items: ['4 boiled eggs in light curry', '2 roti', 'Salad'] },

  // Snacks
  { id: 'whey_shake', name: 'Whey shake', slot: 'snack', kcal: 130, proteinG: 25, veg: true,
    items: ['1 scoop whey in water/milk'] },
  { id: 'curd_nuts', name: 'Greek curd + nuts', slot: 'snack', kcal: 200, proteinG: 18, veg: true,
    items: ['150g hung curd / Greek yogurt', '10g nuts'] },
  { id: 'boiled_eggs', name: '3 boiled eggs', slot: 'snack', kcal: 210, proteinG: 18, veg: false,
    items: ['3 boiled eggs', 'Salt, pepper, chilli flakes'] },
  { id: 'roasted_chana', name: 'Roasted chana + buttermilk', slot: 'snack', kcal: 180, proteinG: 12, veg: true,
    items: ['40g roasted chana', '1 glass buttermilk'] }
]

// A sample day that lands in the target range (used to seed & suggest).
export const SAMPLE_DAY_IDS = ['oats_chia', 'chicken_curry_rice', 'whey_shake', 'grilled_fish_veg', 'boiled_eggs']
