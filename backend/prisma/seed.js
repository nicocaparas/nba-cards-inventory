const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.card.create({
    data: {
      playerName: "Stephen Curry",
      year: 2018,
      cardBrand: "Panini Prizm",
      variant: "Silver",
      isRookie: false,
      isGraded: true,
      grader: "PSA",
      grade: 9.5,
      acquirePrice: 150.00,
      estimatedValue: 250.00,
      listedForSale: true,
      lastUpdated: new Date()
    }
  });
}

main()
  .then(() => console.log("✅ Card added"))
  .catch((e) => console.error("❌ Error seeding data:", e))
  .finally(() => prisma.$disconnect());
