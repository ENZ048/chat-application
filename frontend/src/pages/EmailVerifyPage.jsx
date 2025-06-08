import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaCheckCircle } from 'react-icons/fa';

export default function EmailVerifyPage() {
    const { userId, token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get(`/user/${userId}/verify/${token}`);
                toast.success("Email verification successful!");
                setVerified(true);
                setTimeout(() => {
                    navigate('/auth');
                }, 2000);
            } catch (err) {
                toast.error("Verification Failed!");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [userId, token, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
            {loading && (
                <>
                    <ClipLoader size={80} color={"#4F46E5"} loading={loading} />
                    <p className="mt-4 text-lg">Verifying your email...</p>
                </>
            )}
            {!loading && verified && (
                <>
                    <FaCheckCircle className="text-green-500" size={100} />
                    <p className="mt-4 text-xl font-semibold text-green-600">Email Verified!</p>
                    <p className="text-sm text-gray-600">Redirecting to login...</p>
                </>
            )}
            {!loading && !verified && (
                <>
                    <p className="text-red-500 text-lg">Email verification failed. Please try again.</p>
                </>
            )}
        </div>
    );
}
