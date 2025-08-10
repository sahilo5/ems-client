import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { wait } from "../../utils/wiat";

export const useForgotPassword = (setStep: (step: number) => void) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleForceReload = () => {
        navigate(0);
    };

    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(60); // 60 seconds

    const handleResendOtp = async () => {
        try {
            await api(`/auth/resendOtp/${username}`, { method: "POST" });

            setResendDisabled(true);
            setResendTimer(60);

            const interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setResendDisabled(false);
                    }
                    return prev - 1;
                });
            }, 1000);

            showToast("OTP sent to your email!", "success");
        } catch (error: any) {
            console.error("Failed to resend OTP:", error);
        }
    };

    // Step 1: Request OTP
    const handleForgotPassword = async () => {
        setErrors({});
        if (!username.trim()) {
            setErrors({ usernameError: "Username is required" });
            return;
        }

        try {
            setLoading(true);
            await api(`/auth/forgotPassword/${username}`, {
                method: "POST",
            });
            setLoading(false);
            showToast("OTP sent to your email!", "success");
            setStep(2); // move to OTP step
        } catch (err: any) {
            setLoading(false)
            const serverErrors: { [key: string]: string } = {};

            if (err.message?.includes(`User not found with username: ${username}`)) {
                serverErrors.usernameError = `User not found with username: ${username}`;
            } else {
                serverErrors.usernameError = "Server error. Please try again.";
                setStep(1);
            }

            setErrors(serverErrors);
        }
    };

    // Step 2: Verify OTP
    const handleOtpVerification = async () => {
        setErrors({});
        if (!otp.trim()) {
            setErrors({ otpError: "OTP is required" });
            return;
        }

        try {
            setLoading(true);
            const response = await api(`/auth/verifyOtp/${username}/${otp}`, {
                method: "POST",
                body: JSON.stringify({ otp }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.token) {
                console.log(response.token);
                setResetToken(response.token);
            }
            setLoading(false)
            showToast("Otp verified successfully!", "success")

            setStep(3); // move to reset password
        } catch (err: any) {
            setLoading(false)
            setErrors({ otpError: "Invalid OTP or expired." });
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async () => {
        setErrors({});
        if (!newPassword || !confirmPassword) {
            setErrors({
                newPasswordError: !newPassword ? "Password is required" : "",
                confirmPasswordError: !confirmPassword ? "Confirm password is required" : "",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors({ confirmPasswordError: "Passwords do not match" });
            return;
        }

        try {
            console.log(resetToken);
            await api(`/auth/resetPassword/${username}`, {
                method: "POST",
                body: JSON.stringify({ newPassword }),
                headers: {
                    "Authorization": `Bearer ${resetToken}`,
                    "Content-Type": "application/json",
                },
            });
            showToast("Password Reset successfully!", "success")
            await wait(3000);
            handleForceReload();

        } catch (err: any) {
            setErrors({ newPasswordError: "Failed to reset password. Try again later." });
        }
    };

    return {
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
    };
};
