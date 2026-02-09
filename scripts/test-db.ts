import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const userCount = await prisma.user.count()
    const interviewCount = await prisma.interview.count()
    console.log('✅ Connection Successful!')
    console.log(`📊 Users: ${userCount}`)
    console.log(`📊 Interviews: ${interviewCount}`)
  } catch (error) {
    console.error('❌ Connection Failed!')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
