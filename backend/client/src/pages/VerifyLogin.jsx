import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { verifyLogin } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";

const VerifyLogin = () => {
  const { twoStep } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = dispatch(verifyLogin(code)).then((data)=>{
        if (data.payload.success) {
          toast.success("Verification successful!");
          navigate("/products")
          // Redirect or update state upon success
        } else {
          toast.error(data.payload.message || "Verification failed. Try again.");
        }
      });
     
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Verify Code</h2>
        <p className="text-center text-gray-600">Enter the 6-digit code sent to your email.</p>

        <div>
          <input
            type="text"
            value={code}
            onChange={handleChange}
            maxLength={6}
            placeholder="6-digit code"
            className="w-full px-4 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-2 text-white rounded-md ${
            isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Didn’t receive a code?{" "}
          <button
            onClick={() => toast.info("Resend code functionality")}
            className="text-blue-500 hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyLogin;
