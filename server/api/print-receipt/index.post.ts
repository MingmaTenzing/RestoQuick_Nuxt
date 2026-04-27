
import { ThermalPrinter, PrinterTypes, BreakLine } from "node-thermal-printer";

type PrintableItem = {
  name: string;
  qty: number;
  amountCents: number;
};

type ReceiptPayload = {
  orderNumber?: string | number;
  orderNo?: string | number;
  table?: string | number;
  tableNumber?: string | number;
  customerName?: string;
  cashierName?: string;
  paymentMethod?: string;
  paidAmountCents?: number;
  paidAmount?: number;
  taxRate?: number;
  taxRatePercent?: number;
  taxAmountCents?: number;
  serviceChargeCents?: number;
  serviceCharge?: number;
  items?: Array<{
    itemName?: string;
    name?: string;
    quantity?: number;
    qty?: number;
    unitPrice?: number;
    unitPriceCents?: number;
    amount?: number;
    amountCents?: number;
  }>;
  order?: {
    items?: Array<{
      itemName?: string;
      name?: string;
      quantity?: number;
      qty?: number;
      unitPrice?: number;
      unitPriceCents?: number;
      amount?: number;
      amountCents?: number;
    }>;
    orderNo?: string | number;
    customerName?: string;
    table?: string | number;
    tableNumber?: string | number;
    paymentMethod?: string;
    paidAmountCents?: number;
    paidAmount?: number;
  };
};

function toCents(value: unknown): number {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.round(numeric);
}

function toCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function normalizeItems(payload: ReceiptPayload): PrintableItem[] {
  const rawItems = payload.items ?? payload.order?.items ?? [];

  return rawItems
    .map((item) => {
      const qty = Number(item.quantity ?? item.qty ?? 0);
      const label = String(item.itemName ?? item.name ?? "").trim();
      const amountCentsFromLine = toCents(item.amountCents ?? item.amount);
      const unitPriceCents =
        item.unitPriceCents != null ? toCents(item.unitPriceCents) : toCents(item.unitPrice);
      const lineAmountCents = amountCentsFromLine > 0 ? amountCentsFromLine : unitPriceCents * qty;

      return {
        name: label || "Item",
        qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
        amountCents: Math.max(lineAmountCents, 0),
      };
    })
    .filter((item) => item.name.length > 0);
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ReceiptPayload>(event);
  const items = normalizeItems(body);

  if (!items.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No order items found to print.",
    });
  }

  const printer = new ThermalPrinter({
    // IMPORTANT: use the command set your printer supports.
    // Most generic thermal printers use ESC/POS (EPSON mode).
    type: PrinterTypes.EPSON,
    width: 80, // Number of characters in one line
    interface: "tcp://192.168.1.250:3000", // Printer interface
    removeSpecialCharacters: true,
    lineCharacter: "=", // Set character for lines - default: "-"
    breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
    options: {
      // Additional options
      timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
    },
  });

  const orderNumber = body.orderNumber ?? body.orderNo ?? body.order?.orderNo;
  const tableRef = body.table ?? body.tableNumber ?? body.order?.table ?? body.order?.tableNumber;
  const customerName = body.customerName ?? body.order?.customerName ?? "Walk-in";
  const cashierName = body.cashierName ?? "N/A";
  const paymentMethod = body.paymentMethod ?? body.order?.paymentMethod ?? "N/A";

  const subtotalCents = items.reduce((sum, item) => sum + item.amountCents, 0);
  const taxRatePercent = Number(body.taxRatePercent ?? body.taxRate ?? 0);
  const computedTaxCents = Math.round(subtotalCents * (taxRatePercent / 100));
  const taxAmountCents = toCents(body.taxAmountCents ?? computedTaxCents);
  const serviceChargeCents = toCents(body.serviceChargeCents ?? body.serviceCharge);
  const totalCents = subtotalCents + taxAmountCents + serviceChargeCents;
  const paidAmountCents = toCents(body.paidAmountCents ?? body.paidAmount);
  const changeCents = Math.max(paidAmountCents - totalCents, 0);

  try {
    const isConnected = await printer.isPrinterConnected();

    if (!isConnected) {
      throw createError({
        statusCode: 503,
        statusMessage: "Printer not connected.",
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
    printer.println(`Receipt No: ${orderNumber ? String(orderNumber) : `RQ-${Date.now().toString().slice(-6)}`}`);
    printer.println(`Date: ${new Date().toLocaleString()}`);
    printer.println(`Table: ${tableRef ? String(tableRef) : "N/A"}   Cashier: ${cashierName}`);
    printer.println(`Customer: ${customerName}`);
    printer.drawLine();

    printer.bold(true);
    printer.println("Item              Qty    Amount");
    printer.bold(false);

    for (const item of items) {
      const name = item.name.padEnd(16).slice(0, 16);
      const qty = String(item.qty).padStart(3);
      const price = toCurrency(item.amountCents).padStart(9);
      printer.println(`${name}${qty}${price}`);
    }

    printer.drawLine();
    printer.alignRight();
    printer.println(`Subtotal:      ${toCurrency(subtotalCents)}`);
    if (taxAmountCents > 0) {
      printer.println(`Tax (${taxRatePercent}%):  ${toCurrency(taxAmountCents)}`);
    }
    if (serviceChargeCents > 0) {
      printer.println(`Service:       ${toCurrency(serviceChargeCents)}`);
    }
    printer.bold(true);
    printer.println(`TOTAL:         ${toCurrency(totalCents)}`);
    printer.bold(false);
    if (paidAmountCents > 0) {
      printer.println(`Paid:          ${toCurrency(paidAmountCents)}`);
      printer.println(`Change:        ${toCurrency(changeCents)}`);
    }
    printer.println(`Method:        ${paymentMethod}`);

    printer.newLine();
    printer.alignCenter();
    printer.println("Thank you for dining with us!");
    printer.println("Visit again :)");
    printer.newLine();
    printer.cut();

    await printer.execute();
    return {
      ok: true,
      itemCount: items.length,
      totalCents,
    };
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error("Failed to print receipt:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to print receipt.",
    });
  }
});