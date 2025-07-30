// import {create} from "zustand";
// import { createAuthSlice } from "./slices/auth-slice";
// import { createCheck} from "./slices/check";
// import { persist } from 'zustand/middleware';
// const sessionStorageMiddleware = {
//     getItem: (name) => sessionStorage.getItem(name), // Read from sessionStorage
//     setItem: (name, value) => sessionStorage.setItem(name, value), // Write to sessionStorage
//     removeItem: (name) => sessionStorage.removeItem(name), // Remove from sessionStorage
//   };

// export const useappstore=create(
//     persist((...a)=>({
//     ...createAuthSlice(...a),
//     ...createCheck(...a)
// }),{
//     name: "app-storage", 
//     storage: sessionStorageMiddleware,
//   }
// ));
import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createTailorSlice } from "./slices/tailor";
import { createDeliverySlice } from "./slices/delivery";
import { persist } from "zustand/middleware";


// Custom sessionStorage middleware for Zustand
const sessionStorageMiddleware = {
  getItem: (name) => {
    const storedValue = sessionStorage.getItem(name);
    return storedValue ? JSON.parse(storedValue) : null; // Parse JSON data
  },
  setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)), // Store as JSON
  removeItem: (name) => sessionStorage.removeItem(name),
};

// Zustand store with slices and sessionStorage persistence
export const useappstore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createTailorSlice(...a), // Include tailor slice
      ...createDeliverySlice(...a), // Include delivery slice
    }),
    {
      name: "app-storage",
      storage: sessionStorageMiddleware,
    }
  )
);
