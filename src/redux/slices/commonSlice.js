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


// ===============================
// 📸 Fetch Gallery
// ===============================
export const fetchGallery = createAsyncThunk(
  "common/fetchGallery",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { images } = await commanServices.getGallery(token);
      return images;
    } catch (error) {
      return rejectWithValue("Unable to load gallery");
    }
  }
);


// ===============================
// 📸 Fetch Terms
// ===============================
export const fetchTerms = createAsyncThunk(
  'moreRepo/fetchTerms',
  async ({ token }, thunkAPI) => {
    try {
      const response = await commanServices.getTerms({ token });
      return response;
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e.message ||
        'Something went wrong';

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===============================
// 📸 Fetch AboutUS
// ===============================
export const fetchAbout = createAsyncThunk(
  'moreRepo/fetchAbout',
  async ({ token }, thunkAPI) => {
    try {
      const response = await commanServices.getAbout({ token });
      return response;
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e.message ||
        'Something went wrong';

      return thunkAPI.rejectWithValue(message);
    }
  }
);


// ===============================
// 📸 Fetch My Contacts
// ===============================
export const fetchMyContacts = createAsyncThunk(
  "common/fetchMyContacts",
  async ({ token, page }, { rejectWithValue }) => {
    try {
      return await commanServices.getContacts({ token, page });
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to load contacts"
      );
    }
  }
);


export const fetchNewsByUserSlice = createAsyncThunk(
  "common/fetchNewsByUser",
  async ({ token, page }, { rejectWithValue }) => {
    try {
      return await commanServices.getNewsAddedByUser({ token, page });
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to load news"
      );
    }
  }
);

export const deleteNewsByUserSlice = createAsyncThunk(
  "common/deleteNewsByUser",
  async ({ token, news_id }, { rejectWithValue }) => {
    try {
      return await commanServices.deleteNewsByUser({ token, news_id });
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e.message ||
        "Failed to delete news";

      return rejectWithValue(message);
    }
  }
);


export const updateNewsByUserSlice = createAsyncThunk(
  "common/updateNewsByUser",
  async ({ token, news_id, title, desp, image }, { rejectWithValue }) => {
    try {
      return await commanServices.updateNewsByUser({
        token,
        news_id,
        title,
        desp,
        image,
      });
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e.message ||
        "Failed to update news";

      return rejectWithValue(message);
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
    // gallery
    gallery: [],
    galleryLoading: false,
    galleryError: null,
    // ✅ ADD THIS
    terms: null,
    termsLoading: false,
    termsError: null,
    // ✅ About US
    aboutus: null,
    aboutusLoading: false,
    aboutusError: null,
    // get my contacts
    contacts: [],
    contactsLoading: false,
    contactsError: null,
    contactsPagination: {
      currentPage: 1,
      total: 0,
      perPage: 0,
    },
    // get news by users
    news: [],
    newsLoading: false,
    newsError: null,
    newsPagination: {
      currentPage: 1,
      lastPage: 1,
      nextPage: null,
    },
    // new delete
    deleteNewsLoading: false,
    deleteNewsError: null,
    // update new
    updateNewsLoading: false,
    updateNewsError: null,

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
    /* ------------------ Get Galeery ------------------ */
    builder
      // FETCH GALLERY
      .addCase(fetchGallery.pending, state => {
        state.galleryLoading = true;
        state.galleryError = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.galleryLoading = false;
        state.gallery = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.galleryLoading = false;
        state.gallery = [];
        state.galleryError = action.payload;
      });

    /////////////////////// ------Terms Message----- /////////////////////////////
    builder
      .addCase(fetchTerms.pending, (state) => {
        state.termsLoading = true;
        state.termsError = null;
      })

      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.termsLoading = false;
        state.terms = action.payload?.data || action.payload;
      })

      .addCase(fetchTerms.rejected, (state, action) => {
        state.termsLoading = false;
        state.termsError = action.payload;
      });
    /////////////////////// ------About Us----- /////////////////////////////
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.aboutusLoading = true;
        state.aboutusError = null;
      })

      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.aboutusLoading = false;
        state.aboutus = action.payload?.data || action.payload;
      })

      .addCase(fetchAbout.rejected, (state, action) => {
        state.aboutusLoading = false;
        state.aboutusError = action.payload;
      });

    /* ------------------ MY CONTACTS ------------------ */
    builder.addCase(fetchMyContacts.pending, (state) => {
      state.contactsLoading = true;
      state.contactsError = null;
    })

    builder.addCase(fetchMyContacts.fulfilled, (state, action) => {
      state.contactsLoading = false;

      const requestedPage = action.meta.arg.page;

      if (requestedPage === 1) {
        // ✅ RESET LIST on refresh / first load
        state.contacts = action.payload.contacts;
      } else {
        // ✅ APPEND for pagination
        state.contacts = [
          ...state.contacts,
          ...action.payload.contacts,
        ];
      }

      state.contactsPagination = action.payload.pagination;
    });

    builder.addCase(fetchMyContacts.rejected, (state, action) => {
      state.contactsLoading = false;
      state.contactsError = action.payload;
    });

    /* ------------------ NEWS BY USER ------------------ */
    builder.addCase(fetchNewsByUserSlice.pending, (state) => {
      state.newsLoading = true;
      state.newsError = null;
    });

    builder.addCase(fetchNewsByUserSlice.fulfilled, (state, action) => {
      state.newsLoading = false;

      const requestedPage = action.meta.arg.page;

      if (requestedPage === 1) {
        // ✅ Reset on refresh / first page
        state.news = action.payload.news;
      } else {
        // ✅ Append for pagination
        state.news = [
          ...state.news,
          ...action.payload.news,
        ];
      }

      state.newsPagination = action.payload.pagination;
    });

    builder.addCase(fetchNewsByUserSlice.rejected, (state, action) => {
      state.newsLoading = false;
      state.newsError = action.payload;
    });


    /* ------------------ DELETE NEWS ------------------ */
    builder.addCase(deleteNewsByUserSlice.pending, (state) => {
      state.deleteNewsLoading = true;
      state.deleteNewsError = null;
    });

    builder.addCase(deleteNewsByUserSlice.fulfilled, (state, action) => {
      state.deleteNewsLoading = false;

      const deletedId = action.meta.arg.news_id;

      // ✅ Remove from UI instantly
      state.news = state.news.filter(item => item.id !== deletedId);

      if (action.payload?.message) {
        commanServices.showToast(action.payload.message);
      }
    });

    builder.addCase(deleteNewsByUserSlice.rejected, (state, action) => {
      state.deleteNewsLoading = false;
      state.deleteNewsError = action.payload;

      if (action.payload) {
        commanServices.showToast(action.payload);
      }
    });
    /* ------------------ UPDATE NEWS ------------------ */
    builder.addCase(updateNewsByUserSlice.pending, (state) => {
      state.updateNewsLoading = true;
      state.updateNewsError = null;
    });

    builder.addCase(updateNewsByUserSlice.fulfilled, (state, action) => {
      state.updateNewsLoading = false;

      const updatedId = action.meta.arg.news_id;

      // ✅ Update item inside list (NO REFRESH NEEDED ⚡)
      state.news = state.news.map(item =>
        item.id === updatedId
          ? {
            ...item,
            title: action.meta.arg.title,
            desp: action.meta.arg.desp,
            image: action.meta.arg.image?.uri || item.image,
          }
          : item
      );

      if (action.payload?.message) {
        commanServices.showToast(action.payload.message);
      }
    });

    builder.addCase(updateNewsByUserSlice.rejected, (state, action) => {
      state.updateNewsLoading = false;
      state.updateNewsError = action.payload;

      if (action.payload) {
        commanServices.showToast(action.payload);
      }
    });


  },
});

export const { clearSchoolInfo, clearUnreadCount, clearNotifications } = commonSlice.actions;

export default commonSlice.reducer;
