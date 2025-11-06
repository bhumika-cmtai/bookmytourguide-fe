// app/dashboard/admin/custom-requests/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { customTourRequests as initialRequests } from '@/lib/data';
import type { CustomTourRequest, CustomTourRequestStatus } from '@/lib/data';
import { toast } from 'react-toastify';
import { Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const getStatusVariant = (status: CustomTourRequestStatus) => {
    switch (status) {
        case "Pending": return "destructive";
        case "Quoted": return "default";
        case "Booked": return "secondary";
        default: return "outline";
    }
};

export default function CustomRequestsAdminPage() {
  const [allRequests, setAllRequests] = useState<CustomTourRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomTourRequestStatus | 'all'>('all');

  const filteredRequests = useMemo(() => {
    return allRequests
      .filter(req => statusFilter === 'all' || req.status === statusFilter)
      .filter(req => {
        const searchLower = searchTerm.toLowerCase();
        return (
          req.userName.toLowerCase().includes(searchLower) ||
          req.locations.join(', ').toLowerCase().includes(searchLower) ||
          req._id.toLowerCase().includes(searchLower)
        );
      });
  }, [allRequests, searchTerm, statusFilter]);

  const handleDelete = (requestId: string) => {
    if (confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      setAllRequests(prev => prev.filter(req => req._id !== requestId));
      toast.success("Request deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Custom Tour Requests</h1>
          <p className="text-muted-foreground mt-1">Review and manage personalized tour inquiries from users.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="text" placeholder="Search by name, location, or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-4 py-2 rounded-md border bg-transparent">
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Booked">Booked</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Destinations</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map(req => (
                  <TableRow key={req._id}>
                    <TableCell>
                      <div className="font-semibold">{req.userName}</div>
                      <div className="text-sm text-muted-foreground">{req.userEmail}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{req.locations.join(', ')}</div>
                    </TableCell>
                    <TableCell>
                      {req.startDate && req.endDate ? `${new Date(req.startDate).toLocaleDateString()} - ${new Date(req.endDate).toLocaleDateString()}` : 'Flexible'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/admin/custom-booking/${req._id}`}>
                            <Eye className="w-4 h-4 mr-1" /> View & Quote
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(req._id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}