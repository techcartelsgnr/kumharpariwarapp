import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Platform } from "react-native";

const authAxios = axios.create({
  baseURL: 'https://kumharpariwar.com/api/',
  headers: {
    'Content-Type': 'application/json',
    'Acess-Control-Allow-Origin': '*',
    Accept: 'application/json',
  },
});

// ---------------------------
// GET SLIDER IMAGES (SchoolMate)
// ---------------------------
const getSlider = async (token) => {
  console.log('getSlider token:', token);

  try {
    const res = await authAxios.get('/get_slider', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('slider raw response:', res.data);

    // ✅ Correct path from API
    const sliderList = res.data?.data?.slider || [];

    // ✅ Convert to usable format
    const images = sliderList.map(item => ({
      id: item.id,
      img: `https://kumharpariwar.com${item.image}`, // ✅ full URL
      name: item.name,
      order: item.order,
    }));

    console.log('slider images formatted:', images);

    return { images };
  } catch (error) {
    console.log('Slider API Error:', error?.response?.data || error.message);
    return { images: [] };
  }
};

// ================================
// 📌 Get Thought of the Day (AUTH)
// ================================
const getThoughtOfTheDay = async (token) => {
  try {
    const res = await authAxios.get("/thought_of_theday", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token, // ✅ REQUIRED
      },
    });

    const data = res?.data?.data || null;

    if (!data) {
      return { thought: null };
    }

    return {
      thought: {
        id: data.id,
        image: data.image
          ? `https://kumharpariwar.com${data.image}`
          : null,
        created_at: data.created_at ?? "",
      },
    };
  } catch (error) {
    console.log(
      "Thought Of The Day API Error:",
      error?.response?.data || error.message
    );
    return { thought: null };
  }
};

// ================================
// 📌 Get Our Proud Members (AUTH)
// ================================
const getOurProud = async (token) => {
  try {
    const res = await authAxios.get("/our_proud", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token, // ✅ REQUIRED
      },
    });

    const proudList = res?.data?.data?.prouds?.data || [];

    const prouds = proudList.map(item => ({
      id: item.id,
      name: item.name ?? "",
      description: item.desp ?? "",
      designation: item.designation ?? "",
      image: item.image ?? null,
      email: item.email ?? "",
      call: item.call ?? "",
      isVerified: item.is_verify === "1",
    }));

    return {
      prouds,
      pagination: {
        currentPage: res?.data?.data?.prouds?.current_page ?? 1,
        total: res?.data?.data?.prouds?.total ?? prouds.length,
        perPage: res?.data?.data?.prouds?.per_page ?? prouds.length,
      },
    };

  } catch (error) {
    console.log(
      "Our Proud API Error:",
      error?.response?.data || error.message
    );

    return {
      prouds: [],
      pagination: { currentPage: 1, total: 0, perPage: 0 },
    };
  }
};

// ================================
// 📌 Get Notifications
// ================================
const getNotifications = async (token) => {
  try {
    const res = await authAxios.get("/notification", {
      headers: token
        ? { Authorization: "Bearer " + token }
        : undefined,
    });

    const list = res?.data?.data || [];

    return {
      count: list.length,
      notifications: list.map(item => ({
        id: item.id,
        title: item.title,
        message: item.description,
        targetType: item.target_type,
        createdAt: item.created_at,
      })),
    };
  } catch (error) {
    console.log("Notifications API Error:", error?.response?.data || error.message);
    return {
      count: 0,
      notifications: [],
    };
  }
};

/* ===============================
   Add News by User
=============================== */
const addNewsByUser = async ({ token, title, desp, image }) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("desp", desp);

  if (image?.uri) {
    formData.append("image", {
      uri:
        Platform.OS === "ios"
          ? image.uri.replace("file://", "")
          : image.uri,
      type: image.type || "image/jpeg",
      name: image.name || `news_${Date.now()}.jpg`,
    });
  }

  console.log("📦 FormData prepared");
  console.log("Title:", title);
  console.log("Description:", desp);
  console.log("Image:", image);

  const response = await authAxios.post(
    "/addnews_by_user",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }
  );

  console.log("✅ Add News API Response:", response.data);

  return response.data;
};


/* ===============================
   📌 Add Contact (AUTH)
=============================== */
const addContact = async ({
  token,
  name,
  category,
  subcategory,
  mobile,
  designation,
  location,
  gender,
  image, // { uri, type, name } OR null
}) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("category", category);
  formData.append("subcategory", subcategory);
  formData.append("mobile", mobile);
  formData.append("designation", designation);
  formData.append("location", location);
  formData.append("gender", gender);
  

  if (image?.uri) {
    formData.append("image", {
      uri:
        Platform.OS === "ios"
          ? image.uri.replace("file://", "")
          : image.uri,
      type: image.type || "image/jpeg",
      name: image.name || `contact_${Date.now()}.jpg`,
    });
  }

  // 🔍 Debug logs (safe to remove later)
  console.log("📤 Add Contact Data:");
  console.log({
    name,
    category,
    subcategory,
    mobile,
    designation,
    location,
    gender,
    image,
  });

  const response = await authAxios.post(
    "/add_contact",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }
  );

  console.log("✅ Add Contact API Response:", response.data);

  return response.data;
};



/* ===============================
   📸 Get Gallery (AUTH REQUIRED)
================================ */
const getGallery = async (token) => {
  try {
    const res = await authAxios.get("/gallery", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const images = (res?.data?.data || []).map(item => ({
      id: item.id,
      title: item.title ?? "",
      type: item.type ?? "image",
      img: item.file_path, // ✅ already full URL
      createdAt: item.created_at,
    }));

    return { images };
  } catch (error) {
    console.log(
      "Gallery API Error:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

// Terms & Conditions API
const getTerms = async ({ token }) => {
  const res = await authAxios.get('/get_cmspage/terms-condition', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; 
};

// Terms & Conditions API
const getAbout = async ({ token }) => {
  const res = await authAxios.get('/get_cmspage/about-us', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; 
};

/* ===============================
   📇 Get My Contacts (AUTH)
================================ */
const getContacts = async ({ token, page }) => {
  console.log("📄 Fetch Contacts Page:", page);

  const res = await authAxios.get(`/my_contacts?users=${page}`, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });

  console.log("✅ Contacts Raw Response:", res.data);

  const mycontact = res?.data?.data?.mycontact;

  return {
    contacts: mycontact?.data || [],
    pagination: {
      currentPage: mycontact?.current_page || 1,
      lastPage: mycontact?.last_page || 1,
      nextPage: mycontact?.next_page_url,
    },
  };
};

/* ===============================
   📰 Get News Added By User (AUTH)
================================ */
const getNewsAddedByUser = async ({ token, page }) => {
  console.log("📄 Fetch News Page:", page);

  try {
    const res = await authAxios.get(`/news_added_by_user?users=${page}`, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });

    console.log("✅ News Raw Response:", res.data);

    const newsData = res?.data?.data?.news;

    return {
      news: newsData?.data || [],
      pagination: {
        currentPage: newsData?.current_page || 1,
        lastPage: newsData?.last_page || 1,
        nextPage: newsData?.next_page_url,
      },
    };
  } catch (error) {
    console.log(
      "News API Error:",
      error?.response?.data || error.message
    );

    return {
      news: [],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        nextPage: null,
      },
    };
  }
};

/* ===============================
   🗑 Delete News By User (AUTH)
================================ */
const deleteNewsByUser = async ({ token, news_id }) => {
  console.log("🗑 Delete News ID:", news_id);

  try {
    const res = await authAxios.post(
      "/deletenews_by_user",
      { news_id },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("✅ Delete News Response:", res.data);

    return res.data;
  } catch (error) {
    console.log(
      "Delete News API Error:",
      error?.response?.data || error.message
    );

    throw error; // ✅ Important for slice rejectWithValue
  }
};

/* ===============================
   ✏ Update News By User (AUTH)
================================ */
const updateNewsByUser = async ({ token, title, desp, image, news_id }) => {
  const formData = new FormData();

  formData.append("news_id", news_id);
  formData.append("title", title);
  formData.append("desp", desp);

  if (image?.uri) {
    formData.append("image", {
      uri:
        Platform.OS === "ios"
          ? image.uri.replace("file://", "")
          : image.uri,
      type: image.type || "image/jpeg",
      name: image.name || `news_${Date.now()}.jpg`,
    });
  }

  console.log("✏ Update News Payload:");
  console.log({ news_id, title, desp, image });

  try {
    const res = await authAxios.post(
      "/updatenews_by_user",
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Update News Response:", res.data);

    return res.data;
  } catch (error) {
    console.log(
      "Update News API Error:",
      error?.response?.data || error.message
    );

    throw error; // ✅ Important for rejectWithValue
  }
};


const showToast = Message => {
  Toast.show({
    type: 'success',
    text1: Message,
    visibilityTime: 5000,
  });
};

const commanServices = {
  showToast,
  getSlider,
  getThoughtOfTheDay,
  getOurProud,
  getNotifications,
  addNewsByUser,
  addContact,
  getGallery,
  getTerms,
  getAbout,
  getContacts,
  getNewsAddedByUser,
  deleteNewsByUser,
  updateNewsByUser
 
};
export default commanServices;