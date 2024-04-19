const LayoutUser = () => {
  const tokenLocalStorage = localStorage.getItem('mini_hackathon_token');
  if (tokenLocalStorage === null) {
    return (window.location.href = '/login');
  } else {
    return (window.location.href = '/admin');
  }
};

export default LayoutUser;
