export const AUTH_SESSION_INIT_MESSAGE =
  "Đăng nhập thành công nhưng không thể khởi tạo phiên. Vui lòng thử lại.";

const LOGIN_MESSAGES = {
  ADMIN: "Tên đăng nhập hoặc mật khẩu không chính xác!",
  CANDIDATE: "Email hoặc mật khẩu không chính xác!",
  EMPLOYER: "Tài khoản hoặc mật khẩu không chính xác!",
};

export const getLoginErrorMessage = (type = "CANDIDATE") =>
  LOGIN_MESSAGES[type] || LOGIN_MESSAGES.CANDIDATE;

export const isAuthFailure = (error) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

export const getGoogleLoginErrorMessage = () =>
  "Không thể đăng nhập bằng Google. Vui lòng thử lại.";
