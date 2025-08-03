import React from "react";

interface PaymentDetailProps {
  label: string;
  value: string;
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({ label, value }) => {
  return (
    <div className="flex justify-start">
      <span className="text-gray-500 block mb-1 mr-16">{label}</span>
      <div className="font-medium">{value}</div>
    </div>
  );
};

export default PaymentDetail;
