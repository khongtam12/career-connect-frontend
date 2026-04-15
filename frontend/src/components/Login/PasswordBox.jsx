import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export const PasswordBox = ({ name, placeholder, value, onChange }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative mt-1">
            <input
                type={visible ? "text" : "password"}
                name={name} // ✅ thêm dòng này để truyền đúng tên field
                className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-red-500"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setVisible(!visible)}
            >
                {visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
        </div>
    );
};
