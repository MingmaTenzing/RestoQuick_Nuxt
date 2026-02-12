import { z } from "zod";

// Enums
export const RoleSchema = z.enum([
  "Chef",
  "Waiter",
  "Bartender",
  "Manager",
  "Cook",
  "Kitchen_Hand",
]);
export const LeaveStatusSchema = z.enum(["pending", "approved", "rejected"]);
export const WeekDaySchema = z.enum([
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
]);
export const EmploymentTypeSchema = z.enum(["PartTime", "FullTime", "Casual"]);
export const BookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);
export const MenuCategorySchema = z.enum([
  "APPETIZER",
  "MAIN_COURSE",
  "DESSERT",
  "BEVERAGE",
  "SIDE",
  "SALAD",
]);
export const OrderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
]);
export const OrderTypeSchema = z.enum(["TAKEAWAY", "DINING", "UBER"]);
export const StockCategorySchema = z.enum([
  "INGREDIENTS",
  "BEVERAGES",
  "SUPPLIES",
  "OTHER",
]);

export const StaffSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastName: z.string(),
  role: z.lazy(() => RoleSchema),
  email: z.string(),
  phone: z.string(),
  employmentType: z.lazy(() => EmploymentTypeSchema),
  perHourRate: z.number(),
  availability: z.array(z.lazy(() => WeekDaySchema)),
  joined_date: z.string(),
  shifts: z.array(z.lazy(() => ShiftSchema)),
  leaveRequests: z.array(z.lazy(() => LeaveRequestSchema)),
  profile_photo_url: z.string(),
});

// Simplified schemas for OpenAI agents (no lazy references)
export const StaffSchemaSimple = z.object({
  id: z.string(),
  firstname: z.string(),
  lastName: z.string(),
  role: RoleSchema,
  email: z.string(),
  phone: z.string(),
  employmentType: EmploymentTypeSchema,
  perHourRate: z.number(),
  availability: z.array(WeekDaySchema),
  joined_date: z.string(),
  profile_photo_url: z.string(),
});

export const Shift_with_Staff_Schema = z.object({
  id: z.string(),
  staffId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  position: z.string(),
  staff: StaffSchema,
});

// Simplified schema for OpenAI agents (no lazy references)
export const Shift_with_Staff_Schema_Simple = z.object({
  id: z.string(),
  staffId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  position: z.string(),
  staff: StaffSchemaSimple,
});

export const LeaveRequestSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string(),
  status: z.lazy(() => LeaveStatusSchema),
  submittedAt: z.date(),
  // staff: relation to Staff
});

export const TableSchema = z.object({
  id: z.string(),
  number: z.string(),
  capacity: z.number(),
  bookings: z.array(z.lazy(() => BookingSchema)),
  orders: z.array(z.lazy(() => OrderSchema)),
});

export const BookingSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  bookingTime: z.date(),
  guestCount: z.number(),
  specialRequest: z.string().optional(),
  status: z.lazy(() => BookingStatusSchema),
  tableId: z.string().optional(),
  // table: relation to Table
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Booking = z.infer<typeof BookingSchema>;

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  priceCents: z.number(),
  category: z.lazy(() => MenuCategorySchema),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean(),
  orderItems: z.array(z.lazy(() => OrderItemSchema)),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNo: z.number(),
  checkoutSessionId: z.string(),
  status: z.lazy(() => OrderStatusSchema),
  totalAmountCents: z.number(),
  orderType: z.lazy(() => OrderTypeSchema),
  customerName: z.string(),
  tableId: z.string().optional(),
  // table: relation to Table
  items: z.array(z.lazy(() => OrderItemSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const OrderItemSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  quantity: z.number(),
  unitPriceCents: z.number(),
  specialInstructions: z.string().optional(),
  orderId: z.string(),
  // order: relation to Order
  createdAt: z.date(),
  updatedAt: z.date(),
  // menuItem: relation to MenuItem
  menuItemId: z.string().optional(),
});

export const StockItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.lazy(() => StockCategorySchema),
  currentStock: z.number(),
  unit: z.string(),
  reorderLevel: z.number(),
  reorderQuantity: z.number(),
  supplier: z.string().optional(),
  lastRestocked: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
