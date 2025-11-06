"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

export type TourItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartState = {
  items: TourItem[];
  total: number;
  itemCount: number;
};

export type CartAction =
  | { type: "ADD_ITEM"; payload: TourItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      let newItems;
      let newTotal;

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newTotal = state.total + action.payload.price;
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
        newTotal = state.total + action.payload.price;
      }

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItems.reduce((acc, item) => acc + item.quantity, 0),
      };
    }
    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const newTotal = state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItems.reduce((acc, item) => acc + item.quantity, 0),
      };
    }
    case "UPDATE_QUANTITY": {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const newTotal = state.total + item.price * quantityDiff;

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItems.reduce((acc, item) => acc + item.quantity, 0),
      };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
};

type CartContextType = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
