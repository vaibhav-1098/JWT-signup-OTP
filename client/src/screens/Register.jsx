import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Register User
const Register = () => {
    useDocumentTitle("Register");
    const navigate = useNavigate();

    const isLogin = useSelector((state) => state.isLogin);
    useEffect(() => {
        if (isLogin) {
            navigate("/");
        }
    }, [isLogin]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_EXPRESS_URL}/api/user/register`,
                { name, email, password }
            );
            const data = response.data;
            if (data?.success) {
                setShowOtpForm(true);
                setToken(data.token);
                toast.success(data.msg, { autoClose: 1000, hideProgressBar: true });
            }
        } catch (error) {
            setName("");
            setEmail("");
            setPassword("");
            toast.error(error.response?.data?.msg, { autoClose: 1000, hideProgressBar: true });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e, otp) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_EXPRESS_URL}/api/user/verifyOtp`,
                { token, otp }
            );
            const data = response.data;
            if (data?.success) {
                toast.success(data.msg, { autoClose: 1000, hideProgressBar: true });
                navigate("/login");
            } else {
                toast.error(data.msg, { autoClose: 1000, hideProgressBar: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.msg, { autoClose: 1000, hideProgressBar: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 mt-10">
            <h1 className="text-center m-3 font-semibold text-2xl">
                {showOtpForm ? "Verify OTP" : "Register"}
            </h1>
            {!showOtpForm ? (
                <form
                    onSubmit={handleRegisterSubmit}
                    className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm mx-auto"
                >
                    <div className="mb-4">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Name"
                            pattern="[a-zA-Z0-9_]*"
                            title="Only letters, numbers, underscore are allowed."
                            minLength={3}
                            maxLength={15}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name="password"
                            placeholder="Password"
                            minLength={8}
                            maxLength={16}
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            pattern="^(?=.*[a-zA-Z])(?=.*[0-9]).+$"
                            title="Password must contain at least one letter and one digit."
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            ) : (
                <OTPForm handleOtpSubmit={handleOtpSubmit} loading={loading} />
            )}
            {!showOtpForm && (
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login instead
                    </Link>
                </p>
            )}
        </div>
    );
};

// Verify Otp
const OTPForm = ({ handleOtpSubmit, loading }) => {
    const [otp, setOtp] = useState("");

    return (
        <div>
            <form
                onSubmit={(e) => handleOtpSubmit(e, otp)}
                className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm mx-auto"
            >
                <div className="mb-4">
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="number"
                        name="otp"
                        placeholder="Enter OTP"
                        min="1000"
                        max="9999"
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
            <p className="mt-4 text-center">
                <Link to="/login" className="text-blue-600 hover:underline">
                    Go back instead ?
                </Link>
            </p>
        </div>
    );
};

export default Register;
