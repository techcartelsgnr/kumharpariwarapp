import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const authAxios = axios.create({
  baseURL: 'https://kumharpariwar.com/api/',
  headers: {
    'Content-Type': 'application/json',
    'Acess-Control-Allow-Origin': '*',
    Accept: 'application/json',
  },
});

const login = async ({ mobile, pin, fcmToken }) => {
  console.log('Login API params:', mobile, pin, fcmToken);
  const response = await authAxios.post('/login', {
    mobile: mobile,
    pin: pin,
    fcm_token: fcmToken,
  });

  console.log('Login API response:', response.data);

  if (response.data?.token) {
    // Save token
    await AsyncStorage.setItem(
      'auth_token',
      response.data.token
    );
    // Save user info
    await AsyncStorage.setItem(
      'user_info',
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};

const register = async ({ name, email, mobile, pin, refCode, otp, fcmToken }) => {
  const response = await authAxios.post(`/register`, {
    name: name,
    email: email,
    mobile: mobile,
    pin: pin,
    referred_by: refCode,
    otp: otp,
    fcm_token: fcmToken
  });
  if (response.data.errors === undefined) {
    console.log('i m in register');
    await AsyncStorage.setItem('user_info', JSON.stringify(response.data));
    await AsyncStorage.setItem('firstTime', JSON.stringify(false));
  }
  return response.data;
};

//GET OTP
const getotp = async ({ email, mobile, pin }) => {
  const response = await authAxios.post(`/getotp`, {
    email: email,
    mobile: mobile,
    pin: pin,
  });
  return response.data;
};
//GET OTP
const ResendOtp = async ({ mobile }) => {
  const response = await authAxios.post(`/resendotp`, {
    mobile: mobile,
  });
  return response.data;
};

const logout = async ({ token }) => {
  const response = await authAxios.post(
    `/logout`,
    {},
    { headers: { Authorization: 'Bearer ' + token } }
  );

  AsyncStorage.removeItem('user_info');
  return response.data;
};

// change password
const changePassword = async ({ token, old_pin, new_pin }) => {
  const response = await authAxios.post(
    "/change_password",
    { old_pin, new_pin },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const resetPassword = async ({ mobile, otp, password }) => {
  const response = await authAxios.post(`/userresetpassword`, {
    mobile,
    password,
    otp,
  });

  // ✅ Check for backend error manually
  if (response.data.errors) {
    throw new Error(response.data.errors); // forces catch in thunk
  }

  return response.data;
};
const updateProfilePic = async ({ token, formData }) => {
  const response = await axios({
    method: 'post',
    url: 'https://kumharpariwar.com/api/user_image',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
  });

  console.log('response in auth slice========>', response.data.user);

  const strUserInfo = await AsyncStorage.getItem("userInfo");
  const parsUserInfo = JSON.parse(strUserInfo)

  parsUserInfo.user = response.data.user;
  // // parsUserInfo.user.image = response.data.profile

  await AsyncStorage.setItem('userInfo', JSON.stringify(parsUserInfo));

  console.log('user info in update profile===>', response.data);
  return response.data;
};

// suggestions
const suggestions = async ({ token, service_type, suggestion }) => {
  const response = await authAxios.post(
    "/suggestions",
    { service_type, suggestion },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


const commanTask = (state, action) => {
  if (action.payload.user) {
    const user = action.payload.user;

    state.token = action.payload.token;
    state.user_id = action.payload.user.user_id;
    state.name = action.payload.user.name;
    state.mobile = action.payload.user.mobile;
    state.email = action.payload.user.email;
    state.image = action.payload.user.image;
    state.alternate_number = action.payload.user.alternate_number;
    state.gotra = action.payload.user.gotra;
    state.address = action.payload.user.address;
    state.state = action.payload.user.state;
    state.city = action.payload.user.city;

    state.pending = false;
    state.error = false;
  }
};


const authService = {
  commanTask,
  register,
  getotp,
  login,
  logout,
  changePassword,
  updateProfilePic,
  ResendOtp,
  resetPassword,
  suggestions,
};

export default authService;