const initialState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "getAllCategoriesRequest":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "getAllCategoriesSuccess":
      console.log('Categories received in reducer:', action.payload);
      return {
        ...state,
        isLoading: false,
        categories: action.payload || [],
        error: null,
      };
    case "getAllCategoriesFailed":
      console.error('Categories fetch failed:', action.payload);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        categories: [],
      };
    default:
      return state;
  }
}; 