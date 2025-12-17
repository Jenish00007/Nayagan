const initialState = {
  deliveryMen: [],
  loading: false,
  error: null,
};

export const deliverymanReducer = (state = initialState, action) => {
  switch (action.type) {
    case "getAllDeliveryMenRequest":
    case "approveDeliveryManRequest":
    case "rejectDeliveryManRequest":
    case "editDeliveryManRequest":
    case "deleteDeliveryManRequest":
      return {
        ...state,
        loading: true,
      };
    case "getAllDeliveryMenSuccess":
      return {
        ...state,
        loading: false,
        deliveryMen: action.payload,
      };
    case "approveDeliveryManSuccess":
    case "rejectDeliveryManSuccess":
    case "editDeliveryManSuccess":
    case "deleteDeliveryManSuccess":
      return {
        ...state,
        loading: false,
      };
    case "getAllDeliveryMenFail":
    case "approveDeliveryManFail":
    case "rejectDeliveryManFail":
    case "editDeliveryManFail":
    case "deleteDeliveryManFail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}; 