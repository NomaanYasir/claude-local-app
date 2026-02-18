const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async function main(){
  const prisma = new PrismaClient();
  try{
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email: 'student@example.com' },
      update: { password: hash },
      create: { email: 'student@example.com', password: hash, name: 'Seed Student' }
    });
    console.log('password reset to Password123!');
  }catch(e){
    console.error('reset error', e);
    process.exit(1);
  }finally{
    await prisma.$disconnect();
  }
})();
