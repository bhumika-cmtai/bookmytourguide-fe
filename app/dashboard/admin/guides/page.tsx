// app/dashboard/admin/guides/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { guides as initialGuides } from '@/lib/data';
import type { Guide, Review } from '@/lib/data';
import { toast } from 'react-toastify';
import { Search, Plus, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { EditGuideSheet } from '@/components/EditGuideSheet';

// --- UPDATED GUIDE TYPE & MOCK DATA ---
interface GuideWithReviews extends Guide {
  isApproved: boolean;
  reviews: Review[];
}

const mockGuidesWithReviews: GuideWithReviews[] = initialGuides.map((guide, index) => ({
    ...guide,
    isApproved: index === 1,
    reviews: index === 0 ? [
        { user: 'user_abc', fullName: 'Alice Johnson', avatar: '/images/avatars/avatar-1.jpg', rating: 5, comment: 'Vishal was absolutely amazing!', images: [] },
        { user: 'user_def', fullName: 'Robert Brown', avatar: '/images/avatars/avatar-2.jpg', rating: 4, comment: 'A great guide.', images: [] },
    ] : [],
}));

// --- HELPER FUNCTION ---
const calculateProfileCompletion = (guide: Guide): number => {
    let score = 0; const totalPoints = 10;
    if (guide.name) score++; if (guide.email) score++; if (guide.mobile) score++;
    if (guide.age) score++; if (guide.state && guide.country) score++;
    if (guide.experience) score++; if (guide.description) score++; if (guide.photo) score++;
    if (guide.languages.length > 0 && guide.languages[0]) score++;
    if (guide.specializations.length > 0 && guide.specializations[0]) score++;
    return (score / totalPoints) * 100;
};


export default function GuidesAdminPage() {
  const [allGuides, setAllGuides] = useState<GuideWithReviews[]>(mockGuidesWithReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideWithReviews | null>(null);

  const handleEditClick = (guide: GuideWithReviews) => {
    setEditingGuide(guide);
    setShowSheet(true);
  };
  
  const handleSave = (guideId: string, data: any) => {
    // In a real app, you'd send this to an API
    console.log("Saving guide:", guideId, data);
    toast.success("Guide profile saved successfully!");
    setShowSheet(false);
  };
  
  const handleDelete = (guideId: string) => {
    if (window.confirm("Are you sure?")) {
        setAllGuides(prev => prev.filter(g => g._id !== guideId));
        toast.success("Guide deleted successfully!");
        setShowSheet(false);
    }
  };

  const handleToggleApproval = (guideId: string) => {
    setAllGuides(prev => prev.map(g => g._id === guideId ? { ...g, isApproved: !g.isApproved } : g));
    toast.success("Approval status updated!");
  };

  const filteredGuides = useMemo(() => allGuides.filter(guide => 
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    guide.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [allGuides, searchTerm]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Guides Management</h1>
            <p className="text-muted-foreground mt-1">Manage all tour guides.</p>
          </div>
          <Button className="red-gradient"><Plus className="w-4 h-4 mr-2"/> Add New Guide</Button>
        </div>

        <Card className="mb-8 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </Card>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left uppercase">Guide</th>
                <th className="px-6 py-3 text-center uppercase">Profile</th>
                <th className="px-6 py-3 text-center uppercase">Status</th>
                <th className="px-6 py-3 text-right uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredGuides.map((guide) => {
                const completion = calculateProfileCompletion(guide);
                return (
                <tr key={guide._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={guide.photo} alt={guide.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold">{guide.name}</div>
                        <div className="text-sm text-muted-foreground">{guide.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                      <CircularProgress progress={completion} size={50} strokeWidth={5} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={guide.isApproved ? 'default' : 'destructive'}>
                      {guide.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(guide)}>
                        <Edit className="w-4 h-4 mr-1"/>Manage
                    </Button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {editingGuide && (
        <EditGuideSheet
          isOpen={showSheet}
          onOpenChange={setShowSheet}
          guide={editingGuide}
          onSave={handleSave}
          onDelete={handleDelete}
          onToggleApproval={handleToggleApproval}
        />
      )}
    </div>
  );
}