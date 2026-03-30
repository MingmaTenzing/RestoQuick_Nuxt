export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const body = await readBody(event);
  const option = await body.create_menu_option;

  const add_menu_option = await prisma.menuOption.create({
    data: option,
  });

  return add_menu_option;
});
