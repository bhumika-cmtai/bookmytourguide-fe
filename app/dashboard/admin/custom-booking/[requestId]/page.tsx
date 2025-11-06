// app/dashboard/admin/custom-requests/[requestId]/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { customTourRequests, guides } from '@/lib/data';
import type { CustomTourRequest, Guide } from '@/lib/data';
import { toast } from 'react-toastify';
import { User, MapPin, Calendar, Languages, MessageSquare, IndianRupee, UserPlus, Pencil, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function CustomRequestDetailPage({ params }: { params: { requestId: string } }) {
  // Find the request from static data
  const initialRequest = customTourRequests.find(req => req._id === params.requestId);
  
  if (!initialRequest) {
    notFound();
  }
  
  // Use state to manage edits
  const [request, setRequest] = useState<CustomTourRequest>(initialRequest);
  const [assignedGuide, setAssignedGuide] = useState<Guide | null>(
    guides.find(g => g.guideProfileId === request.assignedGuideId) || null
  );

  // Filter guides based on user's request
  const suitableGuides = useMemo(() => {
    return guides.filter(guide => {
      const languageMatch = guide.languages.map(l => l.toLowerCase()).includes(request.language.toLowerCase());
      const locationMatch = request.locations.some(loc => guide.state.toLowerCase() === loc.toLowerCase());
      return languageMatch && locationMatch;
    });
  }, [request.language, request.locations]);

  const handleAssignGuide = (guide: Guide) => {
    setAssignedGuide(guide);
    setRequest(prev => ({ ...prev, assignedGuideId: guide.guideProfileId }));
  };
  
  const handleSaveChanges = () => {
      if (!request.assignedGuideId) {
          toast.error("Please assign a guide before sending the quote.");
          return;
      }
      if (!request.quotedPrice || request.quotedPrice <= 0) {
          toast.error("Please set a valid price for the quote.");
          return;
      }

      // Simulate saving
      console.log("Saving changes and sending quote:", request);
      setRequest(prev => ({ ...prev, status: 'Quoted' }));
      // In a real app, you'd update this in your main state/backend
      toast.success("Quote sent to user successfully!");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Custom Request Details</h1>
          <p className="text-muted-foreground mt-1">Review inquiry, assign a guide, and set a price to send a quote.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: User's Request */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User's Inquiry</CardTitle>
                <CardDescription>Submitted by {request.userName} ({request.userEmail})</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-1" /><div><p className="font-semibold">Destinations</p><p>{request.locations.join(', ')}</p></div></div>
                <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-primary mt-1" /><div><p className="font-semibold">Dates</p><p>{request.startDate ? `${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate!).toLocaleDateString()}` : 'Flexible'}</p></div></div>
                <div className="flex items-start gap-3"><User className="w-5 h-5 text-primary mt-1" /><div><p className="font-semibold">Travelers</p><p>{request.numTravelers}</p></div></div>
                <div className="flex items-start gap-3"><Languages className="w-5 h-5 text-primary mt-1" /><div><p className="font-semibold">Language</p><p className="capitalize">{request.language}</p></div></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Special Requests</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{request.specialRequests || "No special requests provided."}</p></CardContent>
            </Card>
          </div>

          {/* Right Column: Admin Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Assign Guide</CardTitle></CardHeader>
              <CardContent>
                {assignedGuide ? (
                  <div className="flex items-center gap-4">
                    <img src={assignedGuide.photo} alt={assignedGuide.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <p className="font-bold">{assignedGuide.name}</p>
                      <p className="text-sm text-muted-foreground">{assignedGuide.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No guide assigned yet.</p>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4"><UserPlus className="w-4 h-4 mr-2" />{assignedGuide ? 'Change Guide' : 'Assign Guide'}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader><DialogTitle>Select a Suitable Guide</DialogTitle></DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto p-1">
                      <p className="text-sm text-muted-foreground mb-4">Showing guides who match the requested locations ({request.locations.join(', ')}) and language ({request.language}).</p>
                      <div className="space-y-3">
                        {suitableGuides.length > 0 ? suitableGuides.map(guide => (
                          <div key={guide._id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <img src={guide.photo} alt={guide.name} className="w-12 h-12 rounded-full object-cover" />
                              <div>
                                <p className="font-semibold">{guide.name}</p>
                                <p className="text-xs text-muted-foreground">{guide.specializations.join(', ')}</p>
                              </div>
                            </div>
                            <Button size="sm" onClick={() => handleAssignGuide(guide)}>Select</Button>
                          </div>
                        )) : <p className="text-center text-muted-foreground py-8">No suitable guides found.</p>}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Set Price & Quote</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Quoted Price (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="price" type="number" value={request.quotedPrice || ''} onChange={e => setRequest(prev => ({...prev, quotedPrice: Number(e.target.value)}))} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="adminNotes">Admin Notes (Internal)</Label>
                    <Textarea id="adminNotes" value={request.adminNotes} onChange={e => setRequest(prev => ({...prev, adminNotes: e.target.value}))} placeholder="Add internal notes about this quote..."/>
                </div>
              </CardContent>
            </Card>
            <Button size="lg" className="w-full red-gradient" onClick={handleSaveChanges}>
              <Send className="w-5 h-5 mr-2" /> Save & Send Quote to User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}