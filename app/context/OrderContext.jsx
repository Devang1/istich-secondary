'use client';

import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext(undefined);

const initialOrderState = {
  service: '',
  clothingStyle: '',
  stitchingPrice: 0,
  deliveryDate: '',
};

export function OrderProvider({ children }) {
  const [order, setOrder] = useState(initialOrderState);

  const updateOrder = (updates) => {
    setOrder((prev) => ({ ...prev, ...updates }));
  };

  const resetOrder = () => {
    setOrder(initialOrderState);
  };

  return (
    <OrderContext.Provider value={{ order, updateOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
