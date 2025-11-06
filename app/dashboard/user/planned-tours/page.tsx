// app/my-custom-requests/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { customTourRequests as initialRequests } from '@/lib/data';
import type { CustomTourRequest, CustomTourRequestStatus } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Eye } from 'lucide-react';

const getStatusVariant = (status: CustomTourRequestStatus) => {
    switch (status) {
        case "Pending": return "destructive";
        case "Quoted": return "default";
        case "Booked": return "secondary";
        default: return "outline";
    }
};

export default function MyCustomRequestsPage() {
  // In a real app, you'd fetch this data. Here we use state to manage the mock data.
  const [requests, setRequests] = useState<CustomTourRequest[]>(initialRequests);

  return (
    <div className="min-h-screen bg-[var(--muted)]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold">My Custom Tour Requests</h1>
          <p className="mt-2 text-lg text-[var(--muted-foreground)]">Track the status of your personalized travel inquiries.</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinations</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? requests.map(req => (
                  <TableRow key={req._id}>
                    <TableCell>
                      <div className="font-semibold">{req.locations.join(', ')}</div>
                      <div className="text-xs text-muted-foreground">ID: {req._id}</div>
                    </TableCell>
                    <TableCell>
                      {req.startDate ? `${new Date(req.startDate).toLocaleDateString()}` : 'Flexible'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/user/planned-tours/${req._id}`}>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2"/>
                        <p className="font-semibold">No custom requests found.</p>
                        <p className="text-sm text-muted-foreground">Create your dream trip to get started!</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}