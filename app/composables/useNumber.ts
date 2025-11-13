export const useNumber = () => {
  const number = useState("useNumber", () => 1);

  function add() {
    number.value++;
  }
  function less() {
    number.value--;
  }

  return {
    number,
    add,
    less,
  };
};
