import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { authActions } from "../redux/store";

const Login = () => {
    useDocumentTitle("Login");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLogin = useSelector((state) => state.isLogin);
    useEffect(() => {
        if (isLogin) {
            navigate("/");
        }
    }, [isLogin, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                localStorage.clear();
                dispatch(authActions.logout());
                navigate("/login");
            }
        }
    }, [dispatch, navigate]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_EXPRESS_URL}/api/user/login`,
                {
                    email,
                    password,
                }
            );
            const data = response.data;
            if (data?.success) {
                toast.success(data.msg, { autoClose: 1000, hideProgressBar: true });
                localStorage.setItem("token", data.token);
                localStorage.setItem("name", data.existingUser.name);
                localStorage.setItem("email", data.existingUser.email);
                dispatch(authActions.login());
                navigate("/");
            }
        } catch (error) {
            setEmail("");
            setPassword("");
            toast.error(error.response?.data?.msg, { autoClose: 1000, hideProgressBar: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 mt-10">
            <h1 className="text-center m-3 font-semibold text-2xl">Login</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm mx-auto"
            >
                <div className="mb-4">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        disabled={loading}
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
                        required
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-3 rounded ${
                        loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    } text-white transition duration-200`}
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>
            <p className="mt-4 text-center">
                New user ?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register instead
                </Link>
            </p>
        </div>
    );
};

export default Login;
