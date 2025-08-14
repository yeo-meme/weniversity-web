import React, { useState, useMemo, useCallback } from "react";
import type { PaymentItem } from "../../types/payment";
import PaymentDetail from "../../components/mypage/paymenthistory/PaymentDetail";
import PaymentMethod from "../../components/mypage/paymenthistory/PaymentMethod";

type FilterType = "all" | "completed" | "cancelled" | "refunded";

interface PaymentItemProps {
  payment: PaymentItem;
  onStatusLabelGet: (status: string) => string;
  onStatusButtonClassGet: (status: string) => string;
  onAmountFormat: (amount: number) => string;
}

// 개별 결제 아이템 컴포넌트
const PaymentItemComponent: React.FC<PaymentItemProps> = React.memo(
  ({ payment, onStatusLabelGet, onStatusButtonClassGet, onAmountFormat }) => {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${onStatusButtonClassGet(
                payment.status
              )}`}
            >
              {onStatusLabelGet(payment.status)}
            </span>
            <h3 className="text-lg font-medium text-gray-900">
              {payment.courseName}
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <PaymentDetail
            label="결제 금액"
            value={onAmountFormat(payment.amount)}
          />
          <PaymentDetail label="주문 번호" value={payment.orderNumber} />
          <PaymentDetail label="주문 일시" value={payment.orderDate} />
          <PaymentDetail label="승인 일시" value={payment.completionDate} />
          <PaymentMethod
            label="결제수단 "
            value={payment.paymentMethod}
            link={payment.receiptLink}
          />
        </div>
      </div>
    );
  }
);

PaymentItemComponent.displayName = "PaymentItemComponent";

const PaymentHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // 더미 데이터
  const dummyPayments = useMemo<PaymentItem[]>(
    () => [
      {
        id: "1",
        courseName: "견고한 파이썬 부스트 커뮤니티 1기 (디스코드 커뮤니티)",
        amount: 200000,
        orderNumber: "UT0017164m01012506121444071527",
        orderDate: "2025.06.12(목) 14:44",
        completionDate: "2025.06.12(목) 14:44",
        paymentMethod: "신용카드",
        status: "completed",
        receiptLink: "영수증 보기",
      },
      {
        id: "2",
        courseName: "견고한 파이썬 부스트 커뮤니티 1기 (디스코드 커뮤니티)",
        amount: 200000,
        orderNumber: "UT0017164m01012506121444071527",
        orderDate: "2025.06.12(목) 14:44",
        completionDate: "2025.06.12(목) 14:44",
        paymentMethod: "신용카드",
        status: "cancelled",
        receiptLink: "영수증 보기",
      },
      {
        id: "3",
        courseName: "견고한 파이썬 부스트 커뮤니티 1기 (디스코드 커뮤니티)",
        amount: 200000,
        orderNumber: "UT0017164m01012506121444071527",
        orderDate: "2025.06.12(목) 14:44",
        completionDate: "2025.06.12(목) 14:44",
        paymentMethod: "신용카드",
        status: "cancelled",
        receiptLink: "영수증 보기",
      },
    ],
    []
  );

  // 필터 버튼 정보
  const filterButtons = useMemo(
    () => [
      { key: "all" as FilterType, label: "전체" },
      { key: "completed" as FilterType, label: "결제 대기" },
      { key: "cancelled" as FilterType, label: "결제 완료" },
    ],
    []
  );

  // 필터링된 결제 내역
  const filteredPayments = useMemo(() => {
    return dummyPayments.filter(payment => {
      if (activeFilter === "all") return true;
      return payment.status === activeFilter;
    });
  }, [dummyPayments, activeFilter]);

  // 상태 라벨 반환 함수
  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return "결제 완료";
      case "cancelled":
        return "결제 대기";
      case "refunded":
        return "환불 완료";
      default:
        return "알 수 없음";
    }
  }, []);

  // 상태 버튼 클래스 반환 함수
  const getStatusButtonClass = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return "bg-blue-600 text-white";
      case "cancelled":
        return "bg-gray-600 text-white";
      case "refunded":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  }, []);

  // 금액 포맷팅 함수
  const formatAmount = useCallback((amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          결제 내역 (총 {filteredPayments.length}개)
        </h2>

        {/* 필터 버튼들 */}
        <div className="flex gap-2">
          {filterButtons.map(button => (
            <button
              key={button.key}
              onClick={() => handleFilterChange(button.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                activeFilter === button.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결제 내역 리스트 */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">결제 내역이 없습니다.</p>
          </div>
        ) : (
          filteredPayments.map(payment => (
            <PaymentItemComponent
              key={payment.id}
              payment={payment}
              onStatusLabelGet={getStatusLabel}
              onStatusButtonClassGet={getStatusButtonClass}
              onAmountFormat={formatAmount}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(PaymentHistory);
