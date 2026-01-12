export const useManage_Table_Modal = () => {
  const edit_table_modal = useState("edit_table_modal", () => false);
  const add_table_modal = useState("add_table_modal", () => false);

  const open_edit_table_mdoal = () => {
    edit_table_modal.value = true;
  };

  const close_edit_table_mdoal = () => {
    edit_table_modal.value = false;
  };

  const open_add_table_mdoal = () => {
    add_table_modal.value = true;
  };

  const close_add_table_mdoal = () => {
    add_table_modal.value = false;
  };

  return {
    edit_table_modal,
    add_table_modal,
    open_add_table_mdoal,
    close_edit_table_mdoal,
    open_edit_table_mdoal,
    close_add_table_mdoal,
  };
};
