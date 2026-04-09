type ActiveTableSession = {
  id: string;
  tableId: string;
};

export default defineNuxtRouteMiddleware(async (to) => {
  const tableId = String(to.params.table_id ?? "").trim();

  console.log("im requireactive table session middleware");
  if (!tableId || tableId === "takeaway") {
    return;
  }

  const activeSession = await $fetch<ActiveTableSession | null>(
    `/api/table-sessions/active/${tableId}`,
  );

  if (!activeSession) {
    return navigateTo("/dashboard/pos/tables");
  }
});
