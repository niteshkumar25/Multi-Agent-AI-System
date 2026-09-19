import { useEffect, useState } from "react";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";

import api from "../../utils/axios";

import { FcGoogle } from "react-icons/fc";

import { useDispatch, useSelector } from "react-redux";

import { setUserData } from "../redux/userSlice";

import getCurrentUser from "../features/getCurrentUser";

import SlideBar from "../components/SlideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const dispatch = useDispatch();

  const { userData } = useSelector(
    (state) => state.user
  );

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  /*
   * Restore session when page is refreshed
   */
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const data = await getCurrentUser();

        console.log(
          "Restored user:",
          data
        );

        const user =
          data?.user ||
          data?.data ||
          data;

        if (user) {
          dispatch(setUserData(user));
        }
      } catch (error) {
        console.log(
          "No active session"
        );
      } finally {
        setCheckingAuth(false);
      }
    };

    checkCurrentUser();
  }, [dispatch]);

  /*
   * Login API
   */
  const LoginApi = async (token) => {
    try {
      const { data } = await api.post(
        "/auth/login",
        {
          token,
        }
      );

      console.log(
        "Login response:",
        data
      );

      /*
       * Update Redux immediately
       */
      const user =
        data?.user ||
        data?.data ||
        data;

      if (user) {
        dispatch(setUserData(user));
      }

      return data;

    } catch (error) {
      console.error(
        "Error during login API call:",
        error
      );

      throw error;
    }
  };

  /*
   * Google Login
   */
  const handleGoogleSignIn =
    async () => {
      try {
        const data =
          await signInWithPopup(
            auth,
            googleProvider
          );

        const token =
          await data.user.getIdToken();

        await LoginApi(token);

      } catch (error) {
        console.error(
          "Google sign-in error:",
          error
        );
      }
    };

  /*
   * Don't show login modal while
   * checking existing session
   */
  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d0f14] text-white">
        <div className="text-sm text-slate-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0d0f14] text-white">

      {/* Sidebar */}
      <SlideBar />

      {/* Chat */}
      <ChatArea />

      {/* Artifact */}
      <Artifact />

      {/* Login Overlay */}
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">

          <div className="w-[340px] rounded-2xl border border-white/[0.08] bg-[#13151c]/95 p-7 shadow-2xl">

            <div className="flex flex-col gap-1">

              <h1 className="text-[17px] font-semibold tracking-tight text-slate-100">
                Welcome to Multi-Agent AI System
              </h1>

              <p className="text-[13px] text-slate-500">
                Sign in to continue
              </p>

            </div>

            <button
              type="button"
              onClick={
                handleGoogleSignIn
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0d0f14] p-3 text-sm text-white transition-colors hover:bg-[#1a1d26]"
            >
              <FcGoogle size={18} />

              <span>
                Continue with Google
              </span>

            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Home;