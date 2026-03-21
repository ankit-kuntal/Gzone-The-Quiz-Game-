"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Clock } from "lucide-react";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [resendDisabled, setResendDisabled] = useState(false);

    const inputsRef = useRef<HTMLInputElement[]>([]);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) inputsRef.current[index + 1]?.focus();

        // Auto-submit when all 6 digits entered
        if (index === 5 && value && newOtp.every(d => d !== "")) {
            handleSubmitAuto(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmitAuto = async (otpCode: string) => {
        if (!email) {
            setError("Email not found. Please sign up again.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/backend/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "OTP verification failed");
                setLoading(false);
                return;
            }

            if (data.token) localStorage.setItem("token", data.token);
            if (data.username) localStorage.setItem("username", data.username);

            alert("✅ Email verified successfully!");
            router.push("/home");
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }
        handleSubmitAuto(otpCode);
    };

    const handleResendOtp = async () => {
        if (!email || resendDisabled) return;

        setResendDisabled(true);
        setError("");

        try {
            const res = await fetch(`/backend/api/auth/verify-otp?email=${encodeURIComponent(email)}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to resend OTP");
                setResendDisabled(false);
                return;
            }

            setTimeLeft(600);
            setOtp(["", "", "", "", "", ""]);
            inputsRef.current[0]?.focus();
            alert("✅ New OTP sent to your email!");

            setTimeout(() => setResendDisabled(false), 60000);
        } catch (err) {
            console.error(err);
            setError("Failed to resend OTP");
            setResendDisabled(false);
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isExpired = timeLeft <= 0;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
            <div className="w-full max-w-md p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-full">
                            <Mail size={32} className="text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
                    <p className="text-gray-400">
                        Enter the 6-digit code sent to
                        <br />
                        <span className="text-emerald-400 font-semibold">{email}</span>
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
                        {error}
                    </div>
                )}

                {/* OTP Input */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex ">
                        {otp.map((d, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength={1}
                                value={d}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (!/^\d?$/.test(val)) return;
                                    const newOtp = [...otp];
                                    newOtp[i] = val;
                                    setOtp(newOtp);
                                    if (val && i < 5) inputsRef.current[i + 1]?.focus();
                                }}
                                onKeyDown={e => e.key === "Backspace" && !otp[i] && i > 0 && inputsRef.current[i - 1]?.focus()}
                                onPaste={e => {
                                    e.preventDefault();
                                    const data = e.clipboardData.getData("text").slice(0, 6).split("");
                                    const newOtp = [...otp];
                                    data.forEach((v, idx) => newOtp[idx] = v);
                                    setOtp(newOtp);
                                    if (data.length) inputsRef.current[data.length - 1]?.focus();
                                }}
                                ref={el => { inputsRef.current[i] = el! || null }}
                                placeholder="•"
                                className="w-10 h-10 text-center text-xl font-bold bg-zinc-900 border border-zinc-700 rounded-md text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                disabled={isExpired}
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center justify-center gap-2 text-sm ${isExpired ? "text-red-400" : "text-gray-400"}`}>
                        <Clock size={16} />
                        <span>{isExpired ? "OTP Expired" : `${minutes}:${seconds.toString().padStart(2, "0")}`}</span>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || isExpired}
                        className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-500 hover:to-teal-500"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                {/* Resend OTP */}
                <div className="mt-6 text-center border-t border-zinc-700 pt-6">
                    <p className="text-gray-400 text-sm mb-4">
                        {isExpired ? "OTP has expired" : "Didn't receive the code?"}
                    </p>
                    <button
                        onClick={handleResendOtp}
                        disabled={resendDisabled || isExpired}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {resendDisabled ? "Resending... (Wait 60s)" : "Resend OTP"}
                    </button>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/frontend/login" className="text-emerald-400 font-semibold hover:text-emerald-300">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}