const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const works = [
  { id: 4,  title: 'Directly in the cave',             category: 'Peinture', year: '2024', src: '/works/5_directly in the cave_oil painting_2024_100x75cm 2.JPG' },
  { id: 10, title: 'Peinture I',                       category: 'Peinture', year: '2024', src: '/works/FullSizeRender.JPG' },
  { id: 18, title: 'Peinture X',                       category: 'Peinture', year: '2024', src: '/works/IMG_7172.JPG' },
  { id: 9,  title: 'Death of the giants creatures',    category: 'Peinture', year: '2025', src: '/works/11_Death of the giants creatures, their death, creator of a new life_oil paintings_2025_150x100cm 2.JPG' },
  { id: 1,  title: 'I came across the rainforest',     category: 'Peinture', year: '2025', src: '/works/1_I came across the rainforest_oil painting_2025_75x60cm 2.JPG' },
  { id: 2,  title: 'See these creatures propagating',  category: 'Peinture', year: '2025', src: '/works/2_See these creatures propagating_oil painting_2025_40x60cm 2.JPG' },
  { id: 3,  title: 'Differents ways to bloom',         category: 'Peinture', year: '2025', src: '/works/4_Differents ways to bloom_oil painting_2025_50x75cm 2.JPG' },
  { id: 5,  title: 'Tree of life cycle',               category: 'Peinture', year: '2025', src: '/works/6_Tree of life cycle, two faces, plants and mushrooms breathing_oil paintings_2025_60x85cm 2.jpg' },
  { id: 6,  title: 'Cave floor, part 1',               category: 'Peinture', year: '2025', src: '/works/7_Cave floor, part 1 glowing mushroom_oil paintings_2025_80x50cm 2.JPG' },
  { id: 8,  title: 'The outcomes of this trippy life', category: 'Peinture', year: '2024', src: '/works/10_The outcomes of this trippy life, the strange lanscape blurred by the mist_oil paintings_2024_40x60cm 2.JPG' },
  { id: 11, title: 'Peinture II',                      category: 'Peinture', year: '2024', src: '/works/IMG_4681.PNG' },
  { id: 12, title: 'Peinture III',                     category: 'Peinture', year: '2024', src: '/works/IMG_6481 2.jpg' },
  { id: 13, title: 'Peinture IV',                      category: 'Peinture', year: '2024', src: '/works/IMG_7101.JPG' },
  { id: 14, title: 'Peinture V',                       category: 'Peinture', year: '2024', src: '/works/IMG_7105.JPG' },
  { id: 15, title: 'Peinture VI',                      category: 'Peinture', year: '2024', src: '/works/IMG_7107.JPG' },
  { id: 16, title: 'Peinture VII',                     category: 'Peinture', year: '2024', src: '/works/IMG_7132.JPG' },
  { id: 17, title: 'Peinture VIII',                    category: 'Peinture', year: '2024', src: '/works/IMG_7145.JPG' },
  { id: 19, title: 'Peinture IX',                      category: 'Peinture', year: '2024', src: '/works/IMG_7331.JPG' },
  { id: 20, title: 'Peinture XI',                      category: 'Peinture', year: '2024', src: '/works/IMG_7332.JPG' },
  { id: 21, title: 'Peinture XII',                     category: 'Peinture', year: '2024', src: '/works/IMG_7334.JPG' },
]

async function main() {
  const existing = await prisma.work.count()
  if (existing > 0) {
    console.log(`Seed ignoré — ${existing} œuvre(s) déjà en base.`)
    return
  }

  for (let i = 0; i < works.length; i++) {
    const w = works[i]
    await prisma.work.create({
      data: {
        title: w.title,
        category: w.category,
        year: w.year,
        imageUrl: w.src,
        order: i,
      },
    })
  }
  console.log(`${works.length} œuvres insérées.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
