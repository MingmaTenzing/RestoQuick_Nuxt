export interface Staff {
  id: string;
  name: string;
  role: "Chef" | "Waiter" | "Bartender" | "aMnager" | "Cook" | "Kitchen Hand";
  email: string;
  phone: string;
  availability: string[];
}

export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

// Mock data
export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Chef",
    email: "john@restaurant.com",
    phone: "555-0101",
    availability: ["mon", "tue", "wed", "thu", "fri"],
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Waiter",
    email: "jane@restaurant.com",
    phone: "555-0102",
    availability: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "Chef",
    email: "mike@restaurant.com",
    phone: "555-0103",
    availability: ["wed", "thu", "fri", "sat", "sun"],
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "Waiter",
    email: "sarah@restaurant.com",
    phone: "555-0104",
    availability: ["mon", "tue", "wed", "thu", "fri"],
  },
  {
    id: "5",
    name: "Tom Brown",
    role: "Bartender",
    email: "tom@restaurant.com",
    phone: "555-0105",
    availability: ["thu", "fri", "sat", "sun"],
  },
  {
    id: "6",
    name: "Emily Davis",
    role: "Waiter",
    email: "emily@restaurant.com",
    phone: "555-0106",
    availability: ["mon", "tue", "wed", "sat", "sun"],
  },
];

export const mockShifts: Shift[] = [
  {
    id: "s1",
    staffId: "1",
    date: "2025-01-27",
    startTime: "09:00",
    endTime: "17:00",
    position: "Kitchen",
  },
  {
    id: "s2",
    staffId: "2",
    date: "2025-01-27",
    startTime: "10:00",
    endTime: "18:00",
    position: "Floor",
  },
  {
    id: "s3",
    staffId: "5",
    date: "2025-01-27",
    startTime: "17:00",
    endTime: "23:00",
    position: "Bar",
  },
  {
    id: "s4",
    staffId: "3",
    date: "2025-01-28",
    startTime: "09:00",
    endTime: "17:00",
    position: "Kitchen",
  },
  {
    id: "s5",
    staffId: "4",
    date: "2025-01-28",
    startTime: "10:00",
    endTime: "18:00",
    position: "Floor",
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "l1",
    staffId: "2",
    startDate: "2025-02-01",
    endDate: "2025-02-03",
    reason: "Family vacation",
    status: "pending",
    submittedAt: "2025-01-20",
  },
  {
    id: "l2",
    staffId: "5",
    startDate: "2025-02-10",
    endDate: "2025-02-10",
    reason: "Medical appointment",
    status: "approved",
    submittedAt: "2025-01-22",
  },
];
