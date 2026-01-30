import Toast from 'react-native-toast-message';

export const showToast = (type, title, message) => {
  Toast.show({
    type: type, // 'success', 'error', 'info'
    text1: title || '',
    text2: message || '',
    visibilityTime: 2000,
    position: 'top', // 'top' or 'bottom'
    topOffset: 50,
  });
};
