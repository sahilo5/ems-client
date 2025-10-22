import React, { useState } from "react";
import Form from "../../components/Form";
import { useForgotPassword } from "./ForgotPassword.hooks";
import Loader from "../../components/Loader";

type ForgotPasswordProps = {
    title: string;
}

const ForgotPassword : React.FC<ForgotPasswordProps> = ({
    title, 
  })=> {

    const [step, setStep] = useState(1);
    const {
        username,
        setUsername,
        otp,
        setOtp,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        handleForgotPassword,
        handleOtpVerification,
        handleResetPassword,
        errors,
        loading,
        handleResendOtp,
        resendDisabled,
        resendTimer
    } = useForgotPassword(setStep);


    const renderUsernameForm = () => (

        <Form
            onSubmit={handleForgotPassword}
            submitLabel="Send OTP"
            fields={[
                {
                    type: "text",
                    name: "username",
                    label: "Username",
                    value: username,
                    onChange: setUsername,
                    placeholder: "Enter your username",
                    error: errors.usernameError,
                },
            ]}
        />

    );

    const renderOtpVerificationForm = () => (
        <div className="space-y-4">
          <Form
            onSubmit={handleOtpVerification}
            submitLabel="Verify OTP"
            fields={[
              {
                type: "text",
                name: "otp",
                label: "OTP",
                value: otp,
                onChange: setOtp,
                placeholder: "Enter the OTP sent to your email",
                error: errors.otpError,
              },
            ]}
          />
          
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-primary hover:underline ml-2"
              onClick={handleResendOtp}
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      );
      

    const renderResetPasswordForm = () => (
        <Form
            onSubmit={handleResetPassword}
            submitLabel="Reset Password"
            fields={[
                {
                    type: "password",
                    name: "newPassword",
                    label: "New Password",
                    value: newPassword,
                    onChange: setNewPassword,
                    placeholder: "Enter new password",
                    error: errors.newPasswordError,
                },
                {
                    type: "password",
                    name: "confirmPassword",
                    label: "Confirm Password",
                    value: confirmPassword,
                    onChange: setConfirmPassword,
                    placeholder: "Confirm new password",
                    error: errors.confirmPasswordError,
                },
            ]}
        />
    );

    const renderStep = () => {
        switch (step) {
            case 1:
                return renderUsernameForm();
            case 2:
                return renderOtpVerificationForm();
            case 3:
                return renderResetPasswordForm();
            default:
                return null;
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="max-w-md w-full backdrop-blur-lg bg-none text-dark shadow-lg p-8 rounded-2xl border border-light">
            {loading && 
               <Loader size={16} color="text-white" />
            }
            <h2 className="text-2xl font-bold text-center mb-6 text-dark">
                {step === 1
                    ? title
                    : step === 2
                        ? "Verify OTP"
                        : "Reset Password"}
            </h2>
            {renderStep()}
            
        </div>
    );
};

export default ForgotPassword;
