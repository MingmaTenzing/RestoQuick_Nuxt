import { ThermalPrinter, PrinterTypes, BreakLine } from "node-thermal-printer";
import type { TableSessionWithOrders } from "~~/types/table_session_with_orders";

type PrintReceiptRequestBody = {
  printerIp?: string;
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const sessionId = getRouterParam(event, "session_id");
  const body = await readBody<PrintReceiptRequestBody>(event);
  const printerIp = body?.printerIp?.trim();

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "session_id is required",
    });
  }

  if (!printerIp) {
    throw createError({
      statusCode: 400,
      statusMessage: "printerIp is required in request body",
    });
  }

  if (!/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(printerIp)) {
    throw createError({
      statusCode: 400,
      statusMessage: "printerIp must be a valid IPv4 address (optional :port)",
    });
  }

  const printerTarget = printerIp.includes(":")
    ? printerIp
    : `${printerIp}:9100`;

  const tableSessionWithOrders: TableSessionWithOrders | null =
    await prisma.tableSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        table: true,
        orders: {
          include: {
            table: true,
            items: {
              include: {
                menuItem: true,
                orderItemOptions: {
                  include: {
                    menuOption: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

  if (!tableSessionWithOrders) {
    throw createError({
      statusCode: 404,
      statusMessage: "No session found for this id",
    });
  }

  const printer = new ThermalPrinter({
    // IMPORTANT: use the command set your printer supports.
    // Most generic thermal printers use ESC/POS (EPSON mode).
    type: PrinterTypes.EPSON,
    width: 80, // Number of characters in one line
    interface: `tcp://${printerTarget}`, // Printer interface from checkout page
    removeSpecialCharacters: true,
    lineCharacter: "=", // Set character for lines - default: "-"
    breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
    options: {
      // Additional options
      timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
    },
  });

  const printableItems = tableSessionWithOrders.orders.flatMap((order) =>
    order.items.map((item) => ({
      name: item.itemName,
      qty: item.quantity,
      amountCents: item.unitPriceCents * item.quantity,
      options: item.orderItemOptions.map((option) => ({
        name: option.menuOption?.name ?? "Option",
        qty: option.quantity,
        priceCents: option.priceCents,
      })),
    })),
  );

  const totalCents = tableSessionWithOrders.orders.reduce(
    (sum, order) => sum + order.totalAmountCents,
    0,
  );

  function formatMoney(value: number) {
    return `$${(value / 100).toFixed(2)}`;
  }
  try {
    const isConnected = await printer.isPrinterConnected();

    if (!isConnected) {
      throw createError({
        statusCode: 503,
        statusMessage: `Printer not connected at ${printerTarget}`,
      });
    }

    printer.clear();
    printer.alignCenter();
    printer.bold(true);
    printer.println("RESTO QUICK");
    printer.bold(false);
    printer.println("123 Market Street, Kathmandu");
    printer.println("Phone: +977-9800000000");
    printer.newLine();
    printer.drawLine();

    printer.alignLeft();
    printer.println(`Receipt No: ${tableSessionWithOrders.id}`);
    printer.println(`Date: ${new Date().toLocaleString()}`);
    printer.println(`Table: ${tableSessionWithOrders.table.number}`);
    printer.drawLine();

    const itemNameWidth = 26;
    const qtyWidth = 4;
    const amountWidth = 10;

    printer.bold(true);
    printer.println(
      `${"Item".padEnd(itemNameWidth)}${"Qty".padStart(qtyWidth)}${"Amount".padStart(amountWidth)}`,
    );
    printer.bold(false);

    for (const item of printableItems) {
      const name = item.name.padEnd(itemNameWidth).slice(0, itemNameWidth);
      const qty = String(item.qty).padStart(qtyWidth);
      const price = formatMoney(item.amountCents).padStart(amountWidth);
      printer.bold(true);
      printer.println(`${name}${qty}${price}`);
      printer.bold(false);

      for (const option of item.options) {
        const optionName = `  + ${option.name}`
          .padEnd(itemNameWidth)
          .slice(0, itemNameWidth);
        const optionQty = String(option.qty).padStart(qtyWidth);
        const optionPrice = formatMoney(option.priceCents).padStart(
          amountWidth,
        );
        printer.println(`${optionName}${optionQty}${optionPrice}`);
      }
    }

    printer.drawLine();
    printer.alignRight();
    printer.bold(true);
    printer.println(`TOTAL:         ${formatMoney(totalCents)}`);
    printer.bold(false);

    printer.newLine();
    printer.alignCenter();
    printer.println("Thank you for dining with us!");
    printer.println("Visit again :)");
    printer.newLine();
    printer.cut();

    await printer.execute();
    console.log("Session receipt printed successfully.");
    return {
      ok: true,
      sessionId: tableSessionWithOrders.id,
      printerTarget,
      itemCount: printableItems.length,
      totalCents,
    };
  } catch (error) {
    console.error("Failed to print session receipt:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to print session receipt.",
    });
  }
});
