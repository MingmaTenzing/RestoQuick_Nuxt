import {
  ThermalPrinter,
  PrinterTypes,
  BreakLine,
} from "node-thermal-printer";

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
const order = [
  { name: "Chicken Momo", qty: 2, price: 8.5 },
  { name: "Buff Chowmein", qty: 1, price: 7.0 },
  { name: "Lemon Soda", qty: 3, price: 2.25 },
];

const subtotal = order.reduce((sum, item) => sum + item.qty * item.price, 0);
const taxRate = 0.13;
const tax = subtotal * taxRate;
const serviceCharge = 1.5;
const total = subtotal + tax + serviceCharge;
const paid = 50;
const change = paid - total;

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

async function printMockReceipt() {
  try {
    const isConnected = await printer.isPrinterConnected();

    if (!isConnected) {
      console.error("Printer not connected");
      return;
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
    printer.println(`Receipt No: RQ-${Date.now().toString().slice(-6)}`);
    printer.println(`Date: ${new Date().toLocaleString()}`);
    printer.println("Table: T07   Server: Maya");
    printer.drawLine();

    printer.bold(true);
    printer.println("Item              Qty    Amount");
    printer.bold(false);

    for (const item of order) {
      const amount = item.qty * item.price;
      const name = item.name.padEnd(16).slice(0, 16);
      const qty = String(item.qty).padStart(3);
      const price = formatMoney(amount).padStart(9);
      printer.println(`${name}${qty}${price}`);
    }

    printer.drawLine();
    printer.alignRight();
    printer.println(`Subtotal:      ${formatMoney(subtotal)}`);
    printer.println(`Tax (13%):     ${formatMoney(tax)}`);
    printer.println(`Service:       ${formatMoney(serviceCharge)}`);
    printer.bold(true);
    printer.println(`TOTAL:         ${formatMoney(total)}`);
    printer.bold(false);
    printer.println(`Cash:          ${formatMoney(paid)}`);
    printer.println(`Change:        ${formatMoney(change)}`);

    printer.newLine();
    printer.alignCenter();
    printer.println("Thank you for dining with us!");
    printer.println("Visit again :)");
    printer.newLine();
    printer.cut();

    await printer.execute();
    console.log("Mock receipt printed successfully.");
  } catch (error) {
    console.error("Failed to print mock receipt:", error);
  }
}

printMockReceipt();
