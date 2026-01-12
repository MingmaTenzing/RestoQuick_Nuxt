export const useManage_Table_Modal = () => {
  const edit_table_modal = useState("edit_table_modal", () => false);
  const add_table_modal = useState("add_table_modal", () => false);
  const selected_table = useState("selected_table", () => null as any);

  // this boolean is used for being watched to fetch data in the manage table page
  // the tables will be fetched automatically when the edit or add table modal is closed.
  const modal_boolean_for_fetching = useState(
    "modal_boolean_for_fetching",
    () => false
  );

  const open_edit_table_mdoal = (table?: any) => {
    if (table) selected_table.value = table;
    edit_table_modal.value = true;
  };

  const close_edit_table_mdoal = () => {
    edit_table_modal.value = false;
    selected_table.value = null;

    modal_boolean_for_fetching.value = !modal_boolean_for_fetching.value; //just changing the value to opposite to trigger watch callack in the fetch call.
  };

  const open_add_table_mdoal = () => {
    add_table_modal.value = true;
  };

  const close_add_table_mdoal = () => {
    add_table_modal.value = false;
    modal_boolean_for_fetching.value = !modal_boolean_for_fetching.value; // same here just changing the reactive value that's being watched on the table fetching.
  };

  return {
    edit_table_modal,
    add_table_modal,
    selected_table,
    open_add_table_mdoal,
    close_edit_table_mdoal,
    open_edit_table_mdoal,
    close_add_table_mdoal,
    modal_boolean_for_fetching,
  };
};
