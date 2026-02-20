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

// ===============================
// 👥 Fetch Karyakarini
// ===============================
export const fetchKaryakarini = createAsyncThunk(
  "main/fetchKaryakarini",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { karyakarini } = await mainServices.getKaryakarini(token);
      console.log('Main Slice --- LN---98', karyakarini);
      return karyakarini;

    } catch (error) {
      return rejectWithValue("Unable to load karyakarini");
    }
  }
);


// ===============================
// 👤 Fetch Karyakarini Members
// ===============================
export const fetchKaryakariniMembers = createAsyncThunk(
  "main/fetchKaryakariniMembers",
  async ({ token, karyakariniId }, { rejectWithValue }) => {
    try {
      const { members } = await mainServices.getKaryakariniMembers(
        token,
        karyakariniId
      );
      return members; // ✅ array
    } catch (error) {
      return rejectWithValue("Unable to load karyakarini members");
    }
  }
);


// ===============================
// 🏨 Fetch Hostel By ID
// ===============================
export const fetchHostelById = createAsyncThunk(
  "hostel/fetchHostelById",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const { hostels } = await mainServices.getHostelById(token, id);
      return hostels;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch hostel"
      );
    }
  }
);

// ===============================
// 📰 Fetch News
// ===============================
export const fetchNews = createAsyncThunk(
  "main/fetchNews",
  async ({ token, page = 1 }, thunkAPI) => {
    try {
      return await mainServices.getNews(token, page);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to load news"
      );
    }
  }
);


// ===============================
// 🏙️ Fetch Cities
// ===============================
export const fetchCities = createAsyncThunk(
  "main/fetchCities",
  async ({ token }, thunkAPI) => {
    try {
      const { cities } = await mainServices.getCities(token);
      return cities;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to load cities"
      );
    }
  }
);

// search keyword
export const fetchSearchResults = createAsyncThunk(
  "main/fetchSearchResults",
  async (
    { token, keyword = "", city_id = null, category_id = null, page = 1 },
    thunkAPI
  ) => {
    try {
      return await mainServices.getSearchResults(
        token,
        keyword,
        city_id,
        category_id,
        page
      );
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.message || "Search failed"
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

    karyakarini: [],
    karyakariniLoading: false,
    karyakariniError: null,

    karyakariniMembers: [],
    karyakariniMembersLoading: false,
    karyakariniMembersError: null,

    hostelDetails: [],
    hostelLoading: false,
    hostelError: null,

    // News
    news: [],
    newsLoading: false,
    newsError: null,
    newsPagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 6,
      nextPage: null,
      prevPage: null,
    },
    // Cities
    cities: [],
    citiesLoading: false,
    citiesError: null,
    // searchresults
    searchResults: [],
    searchLoading: false,
    searchError: null,
    searchPagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
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

    builder
      // ===============================
      // 👥 KARYAKARINI
      // ===============================
      .addCase(fetchKaryakarini.pending, state => {
        state.karyakariniLoading = true;
        state.karyakariniError = null;
      })
      .addCase(fetchKaryakarini.fulfilled, (state, action) => {
        state.karyakariniLoading = false;
        state.karyakarini = action.payload;
      })
      .addCase(fetchKaryakarini.rejected, (state, action) => {
        state.karyakariniLoading = false;
        state.karyakarini = [];
        state.karyakariniError = action.payload;
      });

    /* ===== FETCH KARYAKARINI MEMBERS ===== */
    builder.addCase(fetchKaryakariniMembers.pending, (state) => {
      state.karyakariniMembersLoading = true;
      state.karyakariniMembersError = null;
    });

    builder.addCase(fetchKaryakariniMembers.fulfilled, (state, action) => {
      state.karyakariniMembersLoading = false;
      state.karyakariniMembers = action.payload; // ✅ always array
    });

    builder.addCase(fetchKaryakariniMembers.rejected, (state, action) => {
      state.karyakariniMembersLoading = false;
      state.karyakariniMembers = [];
      state.karyakariniMembersError = action.payload;
    });

    // ✅ Hostel Detail
    builder.addCase(fetchHostelById.pending, (state) => {
      state.hostelLoading = true;
      state.hostelError = null;
    })

    builder.addCase(fetchHostelById.fulfilled, (state, action) => {
      state.hostelLoading = false;
      state.hostelDetails = action.payload;
    })

    builder.addCase(fetchHostelById.rejected, (state, action) => {
      state.hostelLoading = false;
      state.hostelError = action.payload;
    });

    /* ===== FETCH NEWS ===== */
    builder.addCase(fetchNews.pending, (state) => {
      state.newsLoading = true;
      state.newsError = null;
    });

    builder.addCase(fetchNews.fulfilled, (state, action) => {
      state.newsLoading = false;

      // ✅ Pagination Merge (same logic as Guest Houses)
      if (action.payload.pagination.currentPage === 1) {
        state.news = action.payload.news;
      } else {
        state.news = [
          ...state.news,
          ...action.payload.news,
        ];
      }

      state.newsPagination = action.payload.pagination;
    });

    builder.addCase(fetchNews.rejected, (state, action) => {
      state.newsLoading = false;
      state.newsError = action.payload;
    });

    /* ===== FETCH CITIES ===== */
    builder.addCase(fetchCities.pending, (state) => {
      state.citiesLoading = true;
      state.citiesError = null;
    });

    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state.citiesLoading = false;
      state.cities = action.payload;   // ✅ array of cities
    });

    builder.addCase(fetchCities.rejected, (state, action) => {
      state.citiesLoading = false;
      state.citiesError = action.payload;
    });
    /* ===== SEARCH CONTACTS ===== */
    builder.addCase(fetchSearchResults.pending, (state) => {
      state.searchLoading = true;
      state.searchError = null;
    });

    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.searchLoading = false;

      const { contacts, pagination } = action.payload;

      if (pagination.currentPage === 1) {
        state.searchResults = contacts;   // ✅ fresh search
      } else {
        state.searchResults = [
          ...state.searchResults,
          ...contacts,
        ]; // ✅ pagination append
      }

      state.searchPagination = pagination;
    });

    builder.addCase(fetchSearchResults.rejected, (state, action) => {
      state.searchLoading = false;
      state.searchError = action.payload;
    });







  },
});

export default mainSlice.reducer;
