export interface Staff {
  id: string;
  name: string;
  role: "Chef" | "Waiter" | "Bartender" | "aMnager" | "Cook" | "Kitchen Hand";
  email: string;
  phone: string;
  availability: string[];
}

export interface Shift {
  id: string; //should be later on added by database
  staffId: string;
  date: Date;
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
  // Monday (2025-11-03)
  {
    id: "s1",
    staffId: "1",
    date: "2025-11-03",
    startTime: "09:00",
    endTime: "17:00",
    position: "Kitchen",
  },
  {
    id: "s2",
    staffId: "2",
    date: "2025-11-03",
    startTime: "10:00",
    endTime: "18:00",
    position: "Floor",
  },
  {
    id: "s3",
    staffId: "5",
    date: "2025-11-03",
    startTime: "17:00",
    endTime: "23:00",
    position: "Bar",
  },

  // Tuesday (2025-11-04)
  {
    id: "s4",
    staffId: "3",
    date: "2025-11-04",
    startTime: "08:00",
    endTime: "16:00",
    position: "Kitchen",
  },
  {
    id: "s5",
    staffId: "4",
    date: "2025-11-04",
    startTime: "11:00",
    endTime: "19:00",
    position: "Floor",
  },
  {
    id: "s6",
    staffId: "5",
    date: "2025-11-04",
    startTime: "16:00",
    endTime: "22:00",
    position: "Bar",
  },

  // Wednesday (2025-11-05)
  {
    id: "s7",
    staffId: "1",
    date: "2025-11-05",
    startTime: "10:00",
    endTime: "18:00",
    position: "Kitchen",
  },
  {
    id: "s8",
    staffId: "2",
    date: "2025-11-05",
    startTime: "09:00",
    endTime: "17:00",
    position: "Floor",
  },
  {
    id: "s9",
    staffId: "3",
    date: "2025-11-05",
    startTime: "12:00",
    endTime: "20:00",
    position: "Bar",
  },

  // Thursday (2025-11-06)
  {
    id: "s10",
    staffId: "4",
    date: "2025-11-06",
    startTime: "09:00",
    endTime: "17:00",
    position: "Kitchen",
  },
  {
    id: "s11",
    staffId: "5",
    date: "2025-11-06",
    startTime: "17:00",
    endTime: "23:00",
    position: "Bar",
  },
  {
    id: "s12",
    staffId: "2",
    date: "2025-11-06",
    startTime: "11:00",
    endTime: "19:00",
    position: "Floor",
  },

  // Friday (2025-11-07)
  {
    id: "s13",
    staffId: "1",
    date: "2025-11-07",
    startTime: "08:00",
    endTime: "16:00",
    position: "Kitchen",
  },
  {
    id: "s14",
    staffId: "3",
    date: "2025-11-07",
    startTime: "17:00",
    endTime: "23:00",
    position: "Bar",
  },
  {
    id: "s15",
    staffId: "4",
    date: "2025-11-07",
    startTime: "12:00",
    endTime: "20:00",
    position: "Floor",
  },

  // Saturday (2025-11-08)
  {
    id: "s16",
    staffId: "2",
    date: "2025-11-08",
    startTime: "09:00",
    endTime: "17:00",
    position: "Floor",
  },
  {
    id: "s17",
    staffId: "3",
    date: "2025-11-08",
    startTime: "10:00",
    endTime: "18:00",
    position: "Kitchen",
  },
  {
    id: "s18",
    staffId: "5",
    date: "2025-11-08",
    startTime: "18:00",
    endTime: "00:00",
    position: "Bar",
  },

  // Sunday (2025-11-09)
  {
    id: "s19",
    staffId: "4",
    date: "2025-11-09",
    startTime: "09:00",
    endTime: "15:00",
    position: "Floor",
  },
  {
    id: "s20",
    staffId: "1",
    date: "2025-11-09",
    startTime: "10:00",
    endTime: "18:00",
    position: "Kitchen",
  },
  {
    id: "s21",
    staffId: "5",
    date: "2025-11-09",
    startTime: "17:00",
    endTime: "23:00",
    position: "Bar",
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
