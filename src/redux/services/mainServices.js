import axios from 'axios';
import Toast from 'react-native-toast-message';

const publicAxios = axios.create({
  baseURL: 'https://kumharpariwar.com/api/',
  headers: {
    'Content-Type': 'application/json',
    'Acess-Control-Allow-Origin': '*',
    Accept: 'application/json',
  },
});


/* ===============================
   🔹 BUSINESS CATEGORY API
================================ */
const getBusinessCategories = async (token) => {
  try {
    const res = await publicAxios.get('/get_businesscategory', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const list = res.data?.data?.businesscategory || [];

    const categories = list.map(item => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      order: Number(item.order) || 0,
      is_verify: item.is_verify === '1',
    }));

    return categories;
  } catch (error) {
    console.log(
      'Business Category API Error:',
      error?.response?.data || error.message
    );
    throw error;
  }
};

/* ===============================
   🔹 BUSINESS SUBCATEGORY API
================================ */
const getBusinessSubCategories = async (token, businessId) => {
  try {
    const res = await publicAxios.get(
      `/get_businesssubcategory/${businessId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const list = res?.data?.data?.business_subcategory || [];

    const subCategories = list.map(item => ({
      id: item.id,
      business_id: Number(item.business_id),
      title: item.title,
      is_verify: item.is_verify === "1",
    }));

    return subCategories;

  } catch (error) {
    console.log(
      "Business SubCategory API Error:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

/* ===============================
   🔹 CONTACTS BY SUBCATEGORY API
================================ */
const getContactsBySubCategory = async (
  token,
  subCategoryId,
  page = 1
) => {
  try {
    const res = await publicAxios.get(
      `/contacts_by_subcategory/${subCategoryId}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const contactsObj = res?.data?.data?.contacts || {};

    return {
      contacts: (contactsObj.data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        designation: item.designation,
        image: item.image,
        gender: item.gender,
        call: item.call,
        whatsapp: item.whatsapp,
        location: item.location,
      })),

      pagination: {
        currentPage: contactsObj.current_page || 1,
        lastPage: contactsObj.last_page || 1,
        total: contactsObj.total || 0,
        perPage: contactsObj.per_page || 10,
        nextPage: contactsObj.next_page_url
          ? contactsObj.current_page + 1
          : null,
        prevPage: contactsObj.prev_page_url
          ? contactsObj.current_page - 1
          : null,
      },
    };

  } catch (error) {
    console.log(
      "Contacts By SubCategory API Error:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

/* ===============================
   🔹 GUEST HOUSES API
================================ */

// const getGuestHouses = async (page = 1) => {
//   console.log("➡️ API CALL URL:", `/get_guesthouses?users=${page}`);

//   const res = await publicAxios.get(
//     `/get_guesthouses?users=${page}`
//   );

//   console.log("✅ FULL API RESPONSE:", res.data);

//   const guestObj = res?.data?.data?.guesthouse || {};

//   console.log("✅ guesthouse object:", guestObj);
//   console.log("✅ guesthouse.data:", guestObj.data);

//   return {
//     guesthouses: guestObj.data || [],
//   };
// };

const getGuestHouses = async (page, token) => {
  try {
    console.log("➡️ Fetch Guest Houses | 160:", page);

    const res = await publicAxios.get(
      `/get_guesthouses?users=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const guestObj = res?.data?.data?.guesthouse || {};
    console.log("➡️ Fetch Guest Houses | 172:", guestObj);

    return {
      guesthouses: guestObj.data || [],
      pagination: {
        currentPage: guestObj.current_page,
        lastPage: guestObj.last_page,
        total: guestObj.total,
        perPage: guestObj.per_page,
        nextPage: guestObj.next_page_url
          ? guestObj.current_page + 1
          : null,
        prevPage: guestObj.prev_page_url
          ? guestObj.current_page - 1
          : null,
      },
    };
  } catch (error) {
    console.log(
      "❌ Guest Houses API Error:",
      error?.response?.data || error.message
    );
    throw error;
  }
};


// ================================
// 📌 Get Hostel List (AUTH REQUIRED)
// ================================
const getHostels = async (token) => {
  try {
    const res = await publicAxios.get("/get_hostel", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const hostelData = res?.data?.data?.hostel || {};
    const list = hostelData?.data || [];

    return list; // ✅ keep it simple
  } catch (error) {
    console.log(
      "Get Hostel API Error:",
      error?.response?.data || error.message
    );
    return [];
  }
};









const showToast = Message => {
  Toast.show({
    type: 'success',
    text1: Message,
    visibilityTime: 5000,
  });
};

const mainServices = {
  showToast,
  getBusinessCategories,
  getBusinessSubCategories,
  getContactsBySubCategory,
  getGuestHouses,
  getHostels,
  
};
export default mainServices;