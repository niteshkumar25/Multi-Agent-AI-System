import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";

// import '@tailwindcss/vite'

function Home() {
  const {userData} = useSelector(state=>state.user)
  const LoginApi = async (token) => {
    try {
      const { data } = await api.post("/auth/login", {
        token: token,
      });

      console.log("Login API response:", data);
    } catch (error) {
      console.error("Error during login API call:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    // Place your Google OAuth logic here
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    await LoginApi(token);
  };

//   return (
//     <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
//       <div className="Fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
//         <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
//           <div className="flex flex-col gap-1">
//             <h1 className="text-[17px] font-semibold text-slate-100 tracking-tight">
//               Welcome to Multi-Agent AI System
//             </h1>
//             <p className="text-[13px] text-slate-500">Sign in to continue</p>
//           </div>

//           <button
//             type="button"
//             onClick={handleGoogleSignIn}
//             className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-[#13151c] p-3 transition-colors hover:bg-[#1a1d26]"
//           >
//             {" "}
//             <FcGoogle size={18} /> <span>Continue with Google</span>{" "}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

return (
  <div className="relative h-screen overflow-hidden bg-[#0d0f14] text-white">
    {/* Blurred background */}
    <div className="absolute inset-0">
      {/* Your existing page/content goes here */}
    </div>

    {/* Overlay */}
{!userData &&     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      {/* Login Modal */}
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
          onClick={handleGoogleSignIn}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0d0f14] p-3 text-sm text-white transition-colors hover:bg-[#1a1d26]"
        >
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>}
  </div>
);


}

export default Home;
