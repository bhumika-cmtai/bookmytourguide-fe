// /app/dashboard/user/tour-guide-booking/[bookingId]/page.tsx
"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';

const BookingDetailPage = () => {
    const { bookingId } = useParams();
    const router = useRouter();
    
    const { bookings, loading } = useSelector((state: RootState) => state.userTourGuideBookings);
    const booking = bookings.find(b => b._id === bookingId);

    if (loading) return <p className="text-center p-4">Loading booking details...</p>;
    if (!booking) {
        return (
            <div className="text-center p-4">
                <p>Booking not found.</p>
                <button onClick={() => router.back()} className="mt-4 text-blue-500 hover:underline">
                    &larr; Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <button onClick={() => router.back()} className="mb-4 text-blue-500 hover:underline">
                &larr; Back to All Bookings
            </button>
            <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
            
            <div className="bg-white shadow-lg rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Column 1 */}
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold mb-3 border-b pb-2">Guide & Location</h2>
                    {/* ✅ FIX APPLIED HERE */}
                    <p><strong>Guide:</strong> {typeof booking.guide === 'object' ? booking.guide.name : 'N/A'}</p>
                    <p><strong>Location:</strong> {booking.location}</p>
                    <p><strong>Language:</strong> {booking.language}</p>
                    <p><strong>Travelers:</strong> {booking.numberOfTravelers}</p>
                </div>

                {/* Column 2 */}
                 <div className="space-y-2">
                    <h2 className="text-xl font-semibold mb-3 border-b pb-2">Dates & Status</h2>
                    <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                </div>

                {/* Full Width Row */}
                <div className="md:col-span-2 pt-4">
                    <h2 className="text-xl font-semibold mb-3 border-b pb-2">Payment Information</h2>
                    <p><strong>Total Price:</strong> ₹{booking.totalPrice.toLocaleString()}</p>
                    <p><strong>Advance Paid:</strong> ₹{booking.advanceAmount.toLocaleString()}</p>
                    <p><strong>Remaining:</strong> ₹{booking.remainingAmount.toLocaleString()}</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                    {booking.status === 'Cancelled' && (
                        <div className="mt-2 text-red-700 bg-red-50 p-3 rounded-md">
                           <p><strong>Cancelled By:</strong> {booking.cancelledBy}</p>
                           <p><strong>Reason:</strong> {booking.cancellationReason || 'No reason provided.'}</p>
                           <p><strong>Refund ID:</strong> {booking.razorpayRefundId}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;