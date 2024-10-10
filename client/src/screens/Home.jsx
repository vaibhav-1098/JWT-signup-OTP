import { jwtDecode } from "jwt-decode";
import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home = () => {
    useDocumentTitle("Home");
    const Name = localStorage.getItem("name");

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.id;
        }
        return null;
    };

    return (
        <>
            <ProtectedRoute>
                <h1 className="text-center m-3 font-semibold text-4xl">Welcome {Name}</h1>
            </ProtectedRoute>
        </>
    );
};

export default Home;
