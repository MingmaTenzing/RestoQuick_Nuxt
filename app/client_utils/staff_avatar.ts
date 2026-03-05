import type { Staff } from "~/generated/prisma/browser";

export function getStaffInitials(staff: Staff) {
  const firstInitial = staff?.firstname?.trim().charAt(0).toUpperCase() ?? "";
  const lastInitial = staff?.lastName?.trim().charAt(0).toUpperCase() ?? "";
  return `${firstInitial}${lastInitial}` || "NA";
}
