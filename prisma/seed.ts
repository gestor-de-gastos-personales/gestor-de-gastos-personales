import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
const categoriasPorDefecto = [
  { id: 1, nombre: 'Alimentación', default: true },
  { id: 2, nombre: 'Transporte', default: true },
  { id: 3, nombre: 'Vivienda', default: true },
  { id: 4, nombre: 'Ocio y Entretenimiento', default: true },
  { id: 5, nombre: 'Salud y Bienestar', default: true },
  { id: 6, nombre: 'Servicios y Facturas', default: true },
  { id: 7, nombre: 'Educación y Desarrollo', default: true },
  { id: 8, nombre: 'Ropa y Calzado', default: true },
  { id: 9, nombre: 'Suscripciones y Tecnología', default: true },
  { id: 10, nombre: 'Mascotas', default: true },
  { id: 11, nombre: 'Viajes y Vacaciones', default: true },
  { id: 12, nombre: 'Impuestos y Finanzas', default: true },
  { id: 13, nombre: 'Otros / Varios', default: true },
];

  for (const cat of categoriasPorDefecto) {
    await prisma.categoria.upsert({
      where: { id: cat.id },
      update: {
        nombre: cat.nombre,
        default: true,
      },
      create: {
        id: cat.id,
        nombre: cat.nombre,
        default: true,
      },
    });
  }

  console.log('Seed ejecutado: Categorías por defecto sincronizadas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });