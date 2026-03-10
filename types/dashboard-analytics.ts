export interface DashboardKpiCard {
  title: string;
  value: string;
  change: string;
  description: string;
  insight: string;
  icon: string;
  accent: string;
}

export interface DashboardLabeledCountRow {
  label: string;
  count: number;
}

export interface DashboardTopSellingItem {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  orderCount: number;
  revenue: number;
  availability: "Available" | "Unavailable";
}

export interface DashboardBookingRow {
  id: string;
  customerName: string;
  when: string;
  guests: string;
  status: string;
  specialRequest?: string | null;
}

export interface DashboardStockAlertRow {
  id: string;
  name: string;
  reorderAt: string;
  current: string;
}

export interface DashboardLeaveRequestRow {
  id: string;
  staffName: string;
  dates: string;
  status: string;
}
