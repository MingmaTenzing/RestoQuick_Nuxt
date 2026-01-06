export const useCompleted_Order_Modal = () => {
  const modal_state = useState("completed_order_modal", () => false);

  function open_completed_orders_modal() {
    modal_state.value = true;
    document.body.classList.add("overflow-hidden");
  }

  function close_completed_orders_modal() {
    modal_state.value = false;
    document.body.classList.remove("overflow-hidden");
  }

  return {
    modal_state,
    open_completed_orders_modal,
    close_completed_orders_modal,
  };
};
