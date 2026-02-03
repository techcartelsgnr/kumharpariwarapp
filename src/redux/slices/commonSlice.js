import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commanServices from "../services/commanServices";


export const fetchSlider = createAsyncThunk(
  "common/fetchSlider",
  async (token, thunkAPI) => {
    try {
      return await commanServices.getSlider(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || 'Failed to load slider'
      );
    }
  }
);


// ===============================
// ⭐ Fetch Thought Of The Day (AUTH)
// ===============================
export const fetchThoughtOfTheDay = createAsyncThunk(
  "common/fetchThoughtOfTheDay",
  async (token, { rejectWithValue }) => {
    try {
      const { thought } = await commanServices.getThoughtOfTheDay(token);
      return thought;
    } catch (error) {
      return rejectWithValue("Failed to load thought of the day");
    }
  }
);



// ===============================
// ⭐ Fetch Our Proud Members
// ===============================
export const fetchOurProud = createAsyncThunk(
  "common/fetchOurProud",
  async (token, { rejectWithValue }) => {
    try {
      const { prouds, pagination } =
        await commanServices.getOurProud(token);

      return { prouds, pagination };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to load Our Proud data"
      );
    }
  }
);



// 🔥 ASYNC ACTION (API CALL)
export const fetchSchoolInfo = createAsyncThunk(
  "common/fetchSchoolInfo",
  async (token, { rejectWithValue }) => {
    try {
      const res = await commanServices.getSchoolInfo(token);
      return res.schoolInfo; // returned from API
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// ===============================
// ⭐ Get Marks Summary
// ===============================
export const getMarksSummaryData = createAsyncThunk(
  "common/getMarksSummaryData",
  async ({ token, exam_id }, { rejectWithValue }) => {
    try {
      const { marksSummary } = await commanServices.getMarksSummary(token, exam_id);
      return marksSummary;
    } catch (error) {
      console.log("Marks Summary Error:", error);
      return rejectWithValue("Unable to load marks summary");
    }
  }
);


// ===============================
// ⭐ Fetch Notifications
// ===============================
export const fetchNotifications = createAsyncThunk(
  "common/fetchNotifications",
  async (token, { rejectWithValue }) => {
    try {
      const { count, notifications } =
        await commanServices.getNotifications(token);

      return { count, notifications };
    } catch (error) {
      return rejectWithValue("Unable to load notifications");
    }
  }
);


// 🔥 MAIN COMMON SLICE
const commonSlice = createSlice({
  name: "common",

  initialState: {
    loading: false,
    schoolInfo: null,
    error: null,
    // getMarksSummaryData

    // ⭐ Thought of the Day
    thoughtOfTheDay: null,
    thoughtLoading: false,
    thoughtError: null,

    marksSummary: {
      exams: [],
      exam: null,
      overall: null,
      subjects: [],
    },
    marksLoading: false,
    marksError: null,
    // notification badge
    notifications: [],
    notificationsLoading: false,
    unreadCount: 0,   // from API "count"

    sliderImages: [],
    sliderLoading: false,
    sliderError: null,

    /* ⭐ Our Proud */
    ourProud: [],
    ourProudPagination: {
      currentPage: 1,
      total: 0,
      perPage: 0,
    },
    ourProudLoading: false,
    ourProudError: null,

  },
  reducers: {
    clearSchoolInfo: (state) => {
      state.schoolInfo = null;
      state.error = null;
      state.loading = false;
    },
    // getMarksSummaryData
    clearMarks(state) {
      state.marksSummary = {
        exams: [],
        exam: null,
        overall: null,
        subjects: [],
      };
      state.marksError = null;
      state.marksLoading = false;
    },
    // Notification reducers
    clearUnreadCount(state) {
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },

  extraReducers: (builder) => {

    /* ===== SLIDER ===== */
    builder.addCase(fetchSlider.pending, (state) => {
      state.sliderLoading = true;
      state.sliderError = null;
    });

    builder.addCase(fetchSlider.fulfilled, (state, action) => {
      state.sliderLoading = false;
      state.sliderImages = action.payload.images; // ✅ FIX
    });

    builder.addCase(fetchSlider.rejected, (state, action) => {
      state.sliderLoading = false;
      state.sliderError = action.payload;
    });


    /* ------------------ THOUGHT OF THE DAY ------------------ */
    builder
      .addCase(fetchThoughtOfTheDay.pending, (state) => {
        state.thoughtLoading = true;
        state.thoughtError = null;
      })
      .addCase(fetchThoughtOfTheDay.fulfilled, (state, action) => {
        state.thoughtLoading = false;
        state.thoughtOfTheDay = action.payload;
      })
      .addCase(fetchThoughtOfTheDay.rejected, (state, action) => {
        state.thoughtLoading = false;
        state.thoughtError = action.payload;
      });

    /* ------------------ OUR PROUD ------------------ */
    builder
      .addCase(fetchOurProud.pending, (state) => {
        state.ourProudLoading = true;
        state.ourProudError = null;
      })

      .addCase(fetchOurProud.fulfilled, (state, action) => {
        state.ourProudLoading = false;
        state.ourProud = action.payload.prouds;
        state.ourProudPagination = action.payload.pagination;
      })

      .addCase(fetchOurProud.rejected, (state, action) => {
        state.ourProudLoading = false;
        state.ourProudError =
          action.payload || "Unable to fetch Our Proud";
      });


    /* ------------------ SCHOOL INFO ------------------ */
    builder
      .addCase(fetchSchoolInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSchoolInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolInfo = action.payload;
      })

      .addCase(fetchSchoolInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch school info";
      });

    /* ------------------ MARKS SUMMARY ------------------ */
    builder
      .addCase(getMarksSummaryData.pending, state => {
        state.marksLoading = true;
        state.marksError = null;
      })
      .addCase(getMarksSummaryData.fulfilled, (state, action) => {
        state.marksLoading = false;
        state.marksSummary = {
          exams: action.payload?.exams || [],
          exam: action.payload?.exam || null,
          overall: action.payload?.overall || null,
          subjects: action.payload?.subjects || [],
        };
      })
      .addCase(getMarksSummaryData.rejected, (state, action) => {
        state.marksLoading = false;
        state.marksError = action.payload || "Failed to fetch marks summary";
      });


    /* ------------------ Fetch Notifications ------------------ */
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.count; // 🔔 badge count
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notificationsLoading = false;
      });


  },
});

export const { clearSchoolInfo, clearUnreadCount, clearNotifications } = commonSlice.actions;

export default commonSlice.reducer;
