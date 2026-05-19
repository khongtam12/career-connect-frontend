import React from "react";

const UserAvatar = ({ src, name, className = "w-10 h-10" }) => {
  // Hàm lấy chữ cái đầu
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Hàm tạo màu nền dựa trên tên (để mỗi user có 1 màu riêng cố định)
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };

  const initials = getInitials(name || "User");
  const bgColor = stringToColor(name || "User");

  if (src && src !== "") {
    return (
      <img
        src={src}
        className={`${className} rounded-full object-cover border border-gray-100`}
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = ""; // Force re-render with initials
        }}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full flex items-center justify-center text-white font-bold border border-gray-200`}
      style={{ 
        backgroundColor: bgColor,
        fontSize: 'calc(100% * 0.4)' // Tự điều chỉnh kích thước chữ theo khung
      }}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
