import React from "react";
import linkIcon from "../../../assets/icon-diagonal-arrow.png";

interface PaymentMethodProps {
  label: string;
  value: string;
  link?: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  label,
  value,
  link,
}) => {
  return (
    <div className="flex justify-start">
      <span className="text-gray-500 block mb-1 mr-16">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {link && (
          <a
            href="#"
            className="flex items-center  text-blue-600 hover:text-blue-500"
            onClick={e => {
              e.preventDefault();
              // 영수증 보기 로직 구현
            }}
          >
            {link}
            <img
              src={linkIcon}
              alt=""
              className="w-4 h-4 object-contain ml-1"
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
