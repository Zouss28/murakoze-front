
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState("loading");

  useEffect(() => {
    const verifyEmailAndLogin = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        console.log("Access token from URL:", accessToken);

        if (!accessToken) {
          setVerificationStatus("error");
          return;
        }

        // Send accessToken to backend
        const response = await fetch(
          "https://murakozebacked-production.up.railway.app/tokenVerification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token: accessToken }),
          }
        );

        if (!response.ok) {
          throw new Error("Verification failed on server");
        }
        console.log("Everything works:", accessToken);

        localStorage.setItem("token", accessToken);
        setVerificationStatus("success");
        toast.success("Email verified successfully! You are now logged in.");

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        toast.error("Failed to verify email. Please try again.");
      }
    };

    verifyEmailAndLogin();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <ToastContainer />
      <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center'>
        {verificationStatus === "loading" && (
          <>
            <div className='flex justify-center mb-6'>
              <Loader2 className='h-16 w-16 text-blue-500 animate-spin' />
            </div>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
              Verifying Your Email
            </h1>
            <p className='text-gray-600'>
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {verificationStatus === "success" && (
          <>
            <div className='flex justify-center mb-6'>
              <CheckCircle className='h-16 w-16 text-green-500' />
            </div>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
              Email Verified Successfully!
            </h1>
            <p className='text-sm text-gray-500'>
              You will be redirected to home page in a few seconds...
            </p>
            <div className='mt-6'>
              <button
                onClick={() => (window.location.href = "/")}
                className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
              >
                Continue to Home
              </button>
            </div>
          </>
        )}

        {verificationStatus === "error" && (
          <>
            <div className='flex justify-center mb-6'>
              <XCircle className='h-16 w-16 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
              Verification Failed
            </h1>
            <div className='space-y-3'>
              <button
                onClick={handleRetry}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Try Again
              </button>
              <button
                onClick={handleGoToLogin}
                className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Go to Login
              </button>
            </div>
          </>
        )}

        <div className='mt-8 pt-6 border-t border-gray-200'>
          <p className='text-xs text-gray-500'>Murakoze Team</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

