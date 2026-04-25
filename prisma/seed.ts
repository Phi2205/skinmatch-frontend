import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.concern.deleteMany();
  await prisma.skinType.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create skin types
  const normalSkin = await prisma.skinType.create({
    data: { name: 'Normal' },
  });

  const oilySkin = await prisma.skinType.create({
    data: { name: 'Oily' },
  });

  const drySkin = await prisma.skinType.create({
    data: { name: 'Dry' },
  });

  const combinationSkin = await prisma.skinType.create({
    data: { name: 'Combination' },
  });

  const sensitiveSkin = await prisma.skinType.create({
    data: { name: 'Sensitive' },
  });

  // Create concerns
  const acneConcern = await prisma.concern.create({
    data: { name: 'Acne' },
  });

  const wrinklesConcern = await prisma.concern.create({
    data: { name: 'Wrinkles' },
  });

  const drynessConcern = await prisma.concern.create({
    data: { name: 'Dryness' },
  });

  const oilinessConcern = await prisma.concern.create({
    data: { name: 'Oiliness' },
  });

  const sensitivityConcern = await prisma.concern.create({
    data: { name: 'Sensitivity' },
  });

  const pigmentationConcern = await prisma.concern.create({
    data: { name: 'Pigmentation' },
  });

  // Create ingredients
  const hyaluronicAcid = await prisma.ingredient.create({
    data: {
      name: 'Hyaluronic Acid',
      description: 'Powerful humectant that holds up to 1000x its weight in water',
    },
  });

  const niacinamide = await prisma.ingredient.create({
    data: {
      name: 'Niacinamide',
      description: 'Helps balance sebum production and improves skin barrier',
    },
  });

  const vitaminC = await prisma.ingredient.create({
    data: {
      name: 'Vitamin C',
      description: 'Powerful antioxidant that brightens and protects skin',
    },
  });

  const retinol = await prisma.ingredient.create({
    data: {
      name: 'Retinol',
      description: 'Reduces fine lines and wrinkles while improving skin texture',
    },
  });

  const glycerin = await prisma.ingredient.create({
    data: {
      name: 'Glycerin',
      description: 'Natural humectant that hydrates and softens skin',
    },
  });

  const salicylicAcid = await prisma.ingredient.create({
    data: {
      name: 'Salicylic Acid',
      description: 'Beta hydroxy acid that exfoliates and prevents breakouts',
    },
  });

  const aloe = await prisma.ingredient.create({
    data: {
      name: 'Aloe Vera',
      description: 'Soothes and hydrates irritated skin',
    },
  });

  // Create categories
  const cleansers = await prisma.category.create({
    data: {
      name: 'Cleansers',
      slug: 'cleansers',
      description: 'Gentle and effective cleansing products',
    },
  });

  const moisturizers = await prisma.category.create({
    data: {
      name: 'Moisturizers',
      slug: 'moisturizers',
      description: 'Hydrating moisturizers for all skin types',
    },
  });

  const serums = await prisma.category.create({
    data: {
      name: 'Serums & Treatments',
      slug: 'serums-treatments',
      description: 'Concentrated treatments for specific skin concerns',
    },
  });

  const sunscreen = await prisma.category.create({
    data: {
      name: 'Sunscreen',
      slug: 'sunscreen',
      description: 'UV protection for healthy skin',
    },
  });

  const masks = await prisma.category.create({
    data: {
      name: 'Face Masks',
      slug: 'face-masks',
      description: 'Intensive treatments and face masks',
    },
  });

  // Create products
  const products = [
    {
      name: 'Gentle Foaming Cleanser',
      slug: 'gentle-foaming-cleanser',
      description: 'Soft foam cleanser that removes impurities without stripping',
      longDescription:
        'Our gentle foaming cleanser removes makeup and impurities while maintaining your skin\'s natural pH balance. Perfect for all skin types, especially sensitive and combination skin.',
      price: 28,
      compareAtPrice: 35,
      categoryId: cleansers.id,
      imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      ],
      stock: 50,
      size: '150ml',
      skinTypeIds: [normalSkin.id, combinationSkin.id, sensitiveSkin.id],
      concernIds: [],
      ingredientIds: [glycerin.id],
      metaTitle: 'Gentle Foaming Cleanser - Silvor Care',
      metaDescription: 'Effective cleanser for all skin types',
    },
    {
      name: 'Hydrating Essence Toner',
      slug: 'hydrating-essence-toner',
      description: 'Lightweight hydrating toner with hyaluronic acid',
      longDescription:
        'This essence toner provides lightweight hydration and prepares your skin for better absorption of serums and moisturizers. Contains hyaluronic acid for deep hydration.',
      price: 32,
      compareAtPrice: 42,
      categoryId: serums.id,
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',
      ],
      stock: 45,
      size: '200ml',
      skinTypeIds: [normalSkin.id, drySkin.id, combinationSkin.id],
      concernIds: [drynessConcern.id],
      ingredientIds: [hyaluronicAcid.id, glycerin.id],
      metaTitle: 'Hydrating Essence Toner - Silvor Care',
      metaDescription: 'Deep hydration for all skin types',
    },
    {
      name: 'Anti-Acne Serum',
      slug: 'anti-acne-serum',
      description: 'Salicylic acid serum for acne-prone skin',
      longDescription:
        'Our powerful anti-acne serum contains salicylic acid to exfoliate pores and prevent breakouts. Also includes niacinamide to balance sebum production.',
      price: 38,
      compareAtPrice: 48,
      categoryId: serums.id,
      imageUrl: 'https://images.unsplash.com/photo-1596517980799-9f4c8cb08bac?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1596517980799-9f4c8cb08bac?w=500&h=500&fit=crop',
      ],
      stock: 35,
      size: '30ml',
      skinTypeIds: [oilySkin.id, combinationSkin.id],
      concernIds: [acneConcern.id, oilinessConcern.id],
      ingredientIds: [salicylicAcid.id, niacinamide.id],
      metaTitle: 'Anti-Acne Serum - Silvor Care',
      metaDescription: 'Combat acne with salicylic acid',
    },
    {
      name: 'Vitamin C Brightening Serum',
      slug: 'vitamin-c-brightening-serum',
      description: 'Stabilized vitamin C for brightening and protection',
      longDescription:
        'This potent vitamin C serum brightens dark spots and pigmentation while providing powerful antioxidant protection. Boosts collagen production for youthful skin.',
      price: 45,
      compareAtPrice: 60,
      categoryId: serums.id,
      imageUrl: 'https://images.unsplash.com/photo-1599496257149-076fab403c4d?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1599496257149-076fab403c4d?w=500&h=500&fit=crop',
      ],
      stock: 40,
      size: '30ml',
      skinTypeIds: [normalSkin.id, oilySkin.id, combinationSkin.id],
      concernIds: [pigmentationConcern.id, wrinklesConcern.id],
      ingredientIds: [vitaminC.id],
      metaTitle: 'Vitamin C Brightening Serum - Silvor Care',
      metaDescription: 'Brighten and protect with vitamin C',
    },
    {
      name: 'Retinol Night Cream',
      slug: 'retinol-night-cream',
      description: 'Advanced retinol treatment for anti-aging',
      longDescription:
        'Our night cream features encapsulated retinol to minimize irritation while maximizing results. Reduces fine lines, wrinkles, and improves overall skin texture over time.',
      price: 52,
      compareAtPrice: 70,
      categoryId: moisturizers.id,
      imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      ],
      stock: 30,
      size: '50ml',
      skinTypeIds: [normalSkin.id, oilySkin.id],
      concernIds: [wrinklesConcern.id],
      ingredientIds: [retinol.id],
      metaTitle: 'Retinol Night Cream - Silvor Care',
      metaDescription: 'Powerful anti-aging retinol treatment',
    },
    {
      name: 'Daily Hydrating Moisturizer',
      slug: 'daily-hydrating-moisturizer',
      description: 'Lightweight moisturizer for daily use',
      longDescription:
        'This lightweight moisturizer hydrates without feeling heavy. Perfect for morning use or as a base for makeup. Contains hyaluronic acid and niacinamide.',
      price: 35,
      compareAtPrice: 45,
      categoryId: moisturizers.id,
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',
      ],
      stock: 60,
      size: '100ml',
      skinTypeIds: [normalSkin.id, drySkin.id, combinationSkin.id, sensitiveSkin.id],
      concernIds: [drynessConcern.id, sensitivityConcern.id],
      ingredientIds: [hyaluronicAcid.id, niacinamide.id],
      metaTitle: 'Daily Hydrating Moisturizer - Silvor Care',
      metaDescription: 'Hydration for all skin types',
    },
    {
      name: 'Mineral Sunscreen SPF 50',
      slug: 'mineral-sunscreen-spf-50',
      description: 'Mineral sunscreen for sensitive skin',
      longDescription:
        'Our mineral sunscreen provides broad-spectrum UV protection with zinc oxide and titanium dioxide. Reef-safe and perfect for sensitive skin.',
      price: 40,
      compareAtPrice: 50,
      categoryId: sunscreen.id,
      imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      ],
      stock: 55,
      size: '50ml',
      skinTypeIds: [normalSkin.id, drySkin.id, sensitiveSkin.id],
      concernIds: [sensitivityConcern.id],
      ingredientIds: [],
      metaTitle: 'Mineral Sunscreen SPF 50 - Silvor Care',
      metaDescription: 'Reef-safe mineral sunscreen',
    },
    {
      name: 'Soothing Clay Mask',
      slug: 'soothing-clay-mask',
      description: 'Calming mask for sensitive skin',
      longDescription:
        'This soothing clay mask reduces redness and irritation with aloe vera and calming ingredients. Perfect for sensitive skin prone to irritation.',
      price: 32,
      compareAtPrice: 42,
      categoryId: masks.id,
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',
      ],
      stock: 25,
      size: '75ml',
      skinTypeIds: [sensitiveSkin.id, normalSkin.id],
      concernIds: [sensitivityConcern.id],
      ingredientIds: [aloe.id],
      metaTitle: 'Soothing Clay Mask - Silvor Care',
      metaDescription: 'Calm and soothe irritated skin',
    },
  ];

  for (const productData of products) {
    const { skinTypeIds, concernIds, ingredientIds, ...rest } = productData;
    await prisma.product.create({
      data: {
        ...rest,
        skinTypes: {
          connect: skinTypeIds.map((id) => ({ id })),
        },
        concerns: {
          connect: concernIds.map((id) => ({ id })),
        },
        ingredients: {
          connect: ingredientIds.map((id) => ({ id })),
        },
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
