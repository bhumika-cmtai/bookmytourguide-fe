// app/dashboard/admin/users/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { bookings, tours } from '@/lib/data'; // Import bookings and tours data
import { users as initialUsers } from '@/lib/data'; // Assuming users are in data.ts
import type { User, Booking, Tour } from '@/lib/data';
import { toast } from 'react-toastify';
import { 
  Search, 
  Filter,
  Eye,
  Trash2,
  Users as UsersIcon,
  ShoppingBag,
  Calendar
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
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';

export default function UsersAdminPage() {
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'guide'>('all');
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Find all bookings made by the selected user
  const userBookings = useMemo(() => {
    if (!selectedUser) return [];
    return bookings
      .filter(b => b.userEmail === selectedUser.email)
      .map(booking => ({
        ...booking,
        tour: tours.find(t => t._id === booking.tourId)
      }))
      .filter(b => b.tour); // Ensure tour exists
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter(user => roleFilter === 'all' || user.role === roleFilter)
      .filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      });
  }, [allUsers, searchTerm, roleFilter]);
  
  const handleViewUser = (user: User) => {
      setSelectedUser(user);
      setIsSheetOpen(true);
  };

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete the user "${userName}"?`)) {
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      toast.success("User deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all registered users.</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="px-4 py-2 rounded-md border bg-transparent">
                  <option value="all">All Roles</option>
                  <option value="user">Users Only</option>
                  <option value="guide">Guides Only</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">{user.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'guide' ? 'default' : 'secondary'}>{user.role}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id, user.name)}>
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <UsersIcon className="w-8 h-8 text-muted-foreground"/>
                            <p>No users match your criteria.</p>
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

      {/* --- USER DETAILS SHEET --- */}
      {selectedUser && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full max-w-2xl sm:max-w-2xl flex flex-col p-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-2xl">User Details</SheetTitle>
              <SheetDescription>Viewing profile and booking history for {selectedUser.name}.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">{selectedUser.name.charAt(0).toUpperCase()}</div>
                        <div>
                            <p className="font-bold text-xl">{selectedUser.name}</p>
                            <p className="text-muted-foreground">{selectedUser.email}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground">Role</p>
                        <Badge variant={selectedUser.role === 'guide' ? 'default' : 'secondary'} className="mt-1">{selectedUser.role}</Badge>
                    </div>
                </CardContent>
              </Card>

              {/* Booking History Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking History ({userBookings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4">
                      {userBookings.map(booking => (
                        <div key={booking._id} className="flex items-start gap-4 p-3 border rounded-lg">
                          <img src={booking.tour!.images[0]} alt={booking.tour!.title} className="w-20 h-20 object-cover rounded-md" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-semibold">{booking.tour!.title}</p>
                              <Badge variant="outline">{booking.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                              <Calendar className="w-3 h-3" /> {new Date(booking.startDate).toLocaleDateString()}
                            </p>
                            <p className="font-semibold text-primary mt-1">₹{booking.totalPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2" />
                      <p>This user has not made any bookings yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <SheetFooter className="p-6 border-t bg-muted/50">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}