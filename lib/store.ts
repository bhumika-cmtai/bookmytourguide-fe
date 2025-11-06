import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/redux/authSlice";
import userReducer from "@/lib/redux/userSlice";
import guideReducer from "@/lib/redux/guideSlice";
import testimonialsReducer from "@/lib/redux/testimonialSlice";
import packageReducer from "@/lib/redux/packageSlice";
import adminReducer from "@/lib/redux/adminSlice"
import languageReducer from "@/lib/redux/languageSlice"
import subscriptionReducer from "@/lib/redux/subscriptionSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    guide: guideReducer,
    testimonials: testimonialsReducer,
    packages: packageReducer,
    admin: adminReducer,
    languages: languageReducer,
    subscriptions: subscriptionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
