// app/dashboard/admin/bookings/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { bookings as initialBookings, tours, guides } from '@/lib/data';
import type { Booking, Tour, Guide, BookingStatus } from '@/lib/data';
import { toast } from 'react-toastify';
import { 
  Search, 
  Filter,
  Eye,
  Ticket,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';

// Helper function to get badge color based on status
const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
        case "Upcoming": return "default";
        case "Completed": return "secondary";
        case "Cancelled": return "destructive";
        default: return "outline";
    }
};

export default function AllBookingsPage() {
  const [allBookings, setAllBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  // Pre-process and "populate" the booking data with tour and guide details
  const populatedBookings = useMemo(() => {
    return allBookings.map(booking => {
      const tour = tours.find(t => t._id === booking.tourId);
      const guide = guides.find(g => g.guideProfileId === booking.guideId);
      return { ...booking, tour, guide };
    }).filter(item => item.tour && item.guide); // Ensure data integrity
  }, [allBookings]);

  // Filter the populated bookings based on search and status filters
  const filteredBookings = useMemo(() => {
    return populatedBookings
      .filter(booking => {
        if (statusFilter === 'all') return true;
        return booking.status === statusFilter;
      })
      .filter(booking => {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.tour!.title.toLowerCase().includes(searchLower) ||
          booking.guide!.name.toLowerCase().includes(searchLower) ||
          booking.userName?.toLowerCase().includes(searchLower) ||
          booking._id.toLowerCase().includes(searchLower)
        );
      });
  }, [populatedBookings, searchTerm, statusFilter]);

  const handleDelete = (bookingId: string, tourTitle: string) => {
    if (confirm(`Are you sure you want to delete the booking for "${tourTitle}"?`)) {
        setAllBookings(prev => prev.filter(b => b._id !== bookingId));
        toast.success("Booking deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage all customer bookings.</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="text" placeholder="Search by tour, guide, user, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-2 rounded-md border bg-transparent">
                  <option value="all">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Tour Package</TableHead>
                    <TableHead className="whitespace-nowrap">Customer</TableHead>
                    <TableHead className="whitespace-nowrap">Guide</TableHead>
                    <TableHead className="whitespace-nowrap">Dates</TableHead>
                    <TableHead className="whitespace-nowrap">Total Paid</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((item) => (
                      <TableRow key={item._id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3" style={{ minWidth: '250px' }}>
                            <img src={item.tour!.images[0]} alt={item.tour!.title} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-foreground truncate max-w-[200px]">{item.tour!.title}</p>
                              <p className="text-xs text-muted-foreground">ID: {item._id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.userName}</div>
                          <div className="text-sm text-muted-foreground">{item.userEmail}</div>
                        </TableCell>
                        <TableCell>{item.guide!.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(item.startDate).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">to {new Date(item.endDate).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell className="font-semibold">₹{item.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* --- THIS IS THE CORRECTED LINK --- */}
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/dashboard/admin/bookings/${item._id}`}>
                                <Eye className="w-4 h-4 mr-1" /> View
                              </Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id, item.tour!.title)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Ticket className="w-8 h-8 text-muted-foreground" />
                          <p>No bookings match your criteria.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}