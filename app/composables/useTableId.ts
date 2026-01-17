export const useTableId = () => {
  //table_id is set for global state cause its easier to access later when using it for checkout and adding to order to database;
  const table_id = useState<string | string[] | undefined>(
    "table_id",
    () => "",
  );

  const set_table_id = (table_id_param: string | string[] | undefined) => {
    table_id.value = table_id_param;
  };

  return {
    table_id,
    set_table_id,
  };
};
