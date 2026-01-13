export const useManage_Table_Modal = () => {
  const edit_table_modal = useState("edit_table_modal", () => ({
    isOpen: false,
    table_id: "",
  }));
  const add_table_modal = useState("add_table_modal", () => false);

  // table_id is set a parameter cause is need the id to update the table.
  const open_edit_table_modal = (table_id: string) => {
    edit_table_modal.value.isOpen = true;
    edit_table_modal.value.table_id = table_id;
  };

  const close_edit_table_modal = () => {
    edit_table_modal.value.isOpen = false;
  };

  const open_add_table_modal = () => {
    add_table_modal.value = true;
  };

  const close_add_table_modal = () => {
    add_table_modal.value = false;
  };

  return {
    edit_table_modal,
    add_table_modal,
    open_add_table_modal,
    close_edit_table_modal,
    open_edit_table_modal,
    close_add_table_modal,
  };
};
