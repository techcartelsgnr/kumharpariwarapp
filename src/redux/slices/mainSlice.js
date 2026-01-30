import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import mainServices from "../services/mainServices";

/* ===============================
   🔹 BUSINESS CATEGORIES
================================ */
export const fetchBusinessCategories = createAsyncThunk(
  'main/fetchBusinessCategories',
  async (token, thunkAPI) => {
    try {
      return await mainServices.getBusinessCategories(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || 'Failed to load categories'
      );
    }
  }
);

/* ===============================
   🔹 FETCH BUSINESS SUBCATEGORIES
================================ */
export const fetchBusinessSubCategories = createAsyncThunk(
  "main/fetchBusinessSubCategories",
  async ({ token, businessId }, thunkAPI) => {
    try {
      return await mainServices.getBusinessSubCategories(
        token,
        businessId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to load sub categories"
      );
    }
  }
);

/* ===============================
   🔹 FETCH CONTACTS BY SUBCATEGORY
================================ */
export const fetchContactsBySubCategory = createAsyncThunk(
  "main/fetchContactsBySubCategory",
  async ({ token, subCategoryId, page = 1 }, thunkAPI) => {
    try {
      return await mainServices.getContactsBySubCategory(
        token,
        subCategoryId,
        page
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to load contacts"
      );
    }
  }
);

/* ===============================
   🔹 FETCH GUEST HOUSES
================================ */
// export const fetchGuestHouses = createAsyncThunk(
//   "main/fetchGuestHouses",
//   async ({ page = 1 }, thunkAPI) => {
//     try {
//       return await mainServices.getGuestHouses(page);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error?.message || "Failed to load guest houses"
//       );
//     }
//   }
// );


export const fetchGuestHouses = createAsyncThunk(
  "main/fetchGuestHouses",
  async ({ page, token }, thunkAPI) => {
    try {
      return await mainServices.getGuestHouses(page, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
        "Unauthenticated"
      );
    }
  }
);





/* ===============================
   🔹 SLICE
================================ */
const mainSlice = createSlice({
  name: 'main',
  initialState: {
    businessCategories: [],
    loadingCategories: false,
    categoryError: null,
    // ⭐ Sub Categories
    businessSubCategories: [],
    loadingSubCategories: false,
    subCategoryError: null,

    // ⭐ Contacts
    contacts: [],
    contactsLoading: false,
    contactsError: null,
    contactsPagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 10,
      nextPage: null,
      prevPage: null,
    },
    // Guest House
    guestHouses: [],
    guestHousesLoading: false,
    guestHousesError: null,
    guestHousePagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 6,
      nextPage: null,
      prevPage: null,
    },

  },
  reducers: {},
  extraReducers: (builder) => {

    /* ===== FETCH BUSINESS CATEGORIES ===== */
    builder.addCase(fetchBusinessCategories.pending, (state) => {
      state.loadingCategories = true;
      state.categoryError = null;
    });

    builder.addCase(fetchBusinessCategories.fulfilled, (state, action) => {
      state.loadingCategories = false;
      state.businessCategories = action.payload;
    });

    builder.addCase(fetchBusinessCategories.rejected, (state, action) => {
      state.loadingCategories = false;
      state.categoryError = action.payload;
    });

    /* ===== FETCH BUSINESS SUB CATEGORIES ===== */
    builder.addCase(fetchBusinessSubCategories.pending, (state) => {
      state.loadingSubCategories = true;
      state.subCategoryError = null;
    });

    builder.addCase(fetchBusinessSubCategories.fulfilled, (state, action) => {
      state.loadingSubCategories = false;
      state.businessSubCategories = action.payload;
    });

    builder.addCase(fetchBusinessSubCategories.rejected, (state, action) => {
      state.loadingSubCategories = false;
      state.subCategoryError = action.payload;
    });

    /* ===== FETCH CONTACTS BY SUBCATEGORY ===== */
    builder.addCase(fetchContactsBySubCategory.pending, (state) => {
      state.contactsLoading = true;
      state.contactsError = null;
    });

    builder.addCase(fetchContactsBySubCategory.fulfilled, (state, action) => {
      state.contactsLoading = false;
      state.contacts = action.payload.contacts;
      state.contactsPagination = action.payload.pagination;
    });

    builder.addCase(fetchContactsBySubCategory.rejected, (state, action) => {
      state.contactsLoading = false;
      state.contactsError = action.payload;
    });

    /* ===== FETCH GUEST HOUSES ===== */
    builder.addCase(fetchGuestHouses.pending, (state) => {
      state.guestHousesLoading = true;
      state.guestHousesError = null;
    });

    builder.addCase(fetchGuestHouses.fulfilled, (state, action) => {
      state.guestHousesLoading = false;

      // ✅ Slice / pagination support
      if (action.payload.pagination.currentPage === 1) {
        state.guestHouses = action.payload.guesthouses;
      } else {
        state.guestHouses = [
          ...state.guestHouses,
          ...action.payload.guesthouses,
        ];
      }

      state.guestHousePagination = action.payload.pagination;
    });

    builder.addCase(fetchGuestHouses.rejected, (state, action) => {
      state.guestHousesLoading = false;
      state.guestHousesError = action.payload;
    });




  },
});

export default mainSlice.reducer;
