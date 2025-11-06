// dashboard/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify"; // Assuming you have react-toastify installed
import {
  Users,
  UserCheck,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminStatsCard } from "@/components/AdminStatsCard";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Data Structures ---
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "guide" | "admin";
}

interface GuideProfile {
  _id: string;
  name: string;
  email:string;
  mobile?: string;
  experience?: string;
  hourlyRate?: number;
  profileComplete: boolean;
  specializations?: string[];
  photo?: string;
  isApproved: boolean;
  license?: string;
  description?: string;
}

// --- Mock Data (to replace Redux for standalone functionality) ---
const mockUsers: User[] = [
    { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', role: 'user' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user' },
    { id: 'user-3', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'guide' },
];

const mockGuides: GuideProfile[] = [
    { 
        _id: 'guide-1', 
        name: 'Vishal Sharma', 
        email: 'vishal@gmail.com', 
        mobile: '9999999999', 
        experience: '5 years', 
        profileComplete: true, 
        isApproved: false, 
        specializations: ['Historic', 'Mountains'], 
        description: 'A passionate historian and storyteller, I bring the vibrant history of kingdoms to life. Born and raised in the city, I have an intimate knowledge of every fort, palace, and hidden alleyway.', 
        license: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
        photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
    },
    { 
        _id: 'guide-2', 
        name: 'Anjali Sharma', 
        email: 'anjali.s@example.com', 
        mobile: '8888888888', 
        experience: '8 years', 
        profileComplete: true, 
        isApproved: true, 
        specializations: ['Trekking', 'Nature Walks'], 
        description: 'An avid mountaineer and certified trekking guide, my expertise lies in the Himalayan trails. I ensure a safe, thrilling, and unforgettable adventure for every traveler.', 
        license: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
    },
    { 
        _id: 'guide-3', 
        name: 'Vikram Singh', 
        email: 'vikram.s@example.com', 
        mobile: '7777777777', 
        experience: '10 years', 
        profileComplete: false, // Incomplete profile example
        isApproved: false, 
        specializations: ['Mughal History', 'Street Food'], 
        description: 'Walking encyclopedia of city\'s history.', 
        license: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
    },
];

export default function AdminDashboard() {
  const router = useRouter();
  
  // Local state to manage mock data
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [guides, setGuides] = useState<GuideProfile[]>(mockGuides);
  const [loading, setLoading] = useState(false);
  
  // Mock logged-in user
  const loggedInUser = { role: 'admin' };

  const [activeTab, setActiveTab] = useState<"users" | "guides">("guides");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterApproval, setFilterApproval] = useState<"all" | "approved" | "pending">("all");
  const [selectedGuide, setSelectedGuide] = useState<GuideProfile | null>(null);

  useEffect(() => {
    if (loggedInUser?.role !== "admin") {
      router.push("/login"); // Redirect if not an admin
    }
  }, [loggedInUser, router]);

  // --- Mock Functions to Simulate Redux Actions ---
  const handleToggleApproval = async (guideId: string, currentStatus: boolean) => {
    setGuides(guides.map(g => g._id === guideId ? { ...g, isApproved: !currentStatus } : g));
    toast.success(`Guide ${!currentStatus ? "approved" : "unapproved"} successfully!`);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted successfully!");
    }
  };

  const handleDeleteGuide = async (guideId: string) => {
    if (window.confirm("Are you sure you want to delete this guide profile? This action cannot be undone.")) {
      setGuides(guides.filter(g => g._id !== guideId));
      toast.success("Guide deleted successfully!");
    }
  };
  
  // --- Filtering Logic ---
  const filteredGuides = guides.filter((guide) => {
      const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) || guide.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch && searchTerm) return false;
      if (filterApproval === "approved") return guide.isApproved;
      if (filterApproval === "pending") return !guide.isApproved;
      return true;
  });

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.filter((u) => u.role === "user").length,
    totalGuides: guides.length,
    approvedGuides: guides.filter((g) => g.isApproved).length,
    pendingGuides: guides.filter((g) => !g.isApproved).length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <AdminStatsCard
    title="Total Users"
    value={stats.totalUsers}
    icon={<Users className="w-5 h-5 text-blue-500" />}
    description="All registered users"
  />
  <AdminStatsCard
    title="Total Guides"
    value={stats.totalGuides}
    icon={<UserCheck className="w-5 h-5 text-purple-500" />}
    description="All registered guides"
  />
  <AdminStatsCard
    title="Approved Guides"
    value={stats.approvedGuides}
    icon={<CheckCircle className="w-5 h-5 text-green-500" />}
    description="Ready for bookings"
  />
  <AdminStatsCard
    title="Pending Approval"
    value={stats.pendingGuides}
    icon={<XCircle className="w-5 h-5 text-orange-500" />}
    description="Awaiting review"
  />
</div>

        {/* --- Management Panel --- */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          {/* --- Tabs --- */}
          <div className="flex border-b border-border">
            <button onClick={() => setActiveTab("guides")} className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "guides" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              Guides Management
            </button>
            <button onClick={() => setActiveTab("users")} className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "users" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              Users Management
            </button>
          </div>

          {/* --- Search and Filter Bar --- */}
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              {activeTab === "guides" && (
                <select value={filterApproval} onChange={(e) => setFilterApproval(e.target.value as any)} className="px-4 py-2 border border-input rounded-md bg-transparent text-foreground">
                  <option value="all">All Guides</option>
                  <option value="approved">Approved Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              )}
            </div>
          </div>

          {/* --- Content Area --- */}
          <div className="p-6">
            {activeTab === "guides" ? (
              // --- Guides List ---
              <div className="space-y-4">
                {loading ? <p>Loading...</p> : filteredGuides.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No guides match your criteria.</p>
                ) : (
                  filteredGuides.map((guide) => (
                    <div key={guide._id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                           <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <img src={guide.photo} alt={guide.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h3 className="font-semibold text-foreground">{guide.name}</h3>
                                        <p className="text-sm text-muted-foreground">{guide.email}</p>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <p className={`font-semibold ${guide.profileComplete ? "text-green-600" : "text-orange-600"}`}>
                                        Profile: {guide.profileComplete ? "Complete" : "Incomplete"}
                                    </p>
                                </div>
                           </div>
                           <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                                <Button size="sm" variant={guide.isApproved ? "destructive" : "default"} onClick={() => handleToggleApproval(guide._id, guide.isApproved)} disabled={!guide.profileComplete} className="flex-1">
                                    {guide.isApproved ? <><XCircle className="w-4 h-4 mr-1"/> Unapprove</> : <><CheckCircle className="w-4 h-4 mr-1"/> Approve</>}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setSelectedGuide(guide)} className="flex-1"><Eye className="w-4 h-4 mr-1"/> View Details</Button>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/90 flex-1" onClick={() => handleDeleteGuide(guide._id)}><Trash2 className="w-4 h-4 mr-1"/> Delete</Button>
                           </div>
                        </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // --- Users List ---
              <div className="space-y-4">
                {loading ? <p>Loading...</p> : filteredUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No users match your criteria.</p>
                ) : (
                  filteredUsers.filter(u => u.role !== 'admin').map((userItem) => (
                    <div key={userItem.id} className="border border-border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">{userItem.name.charAt(0).toUpperCase()}</div>
                            <div>
                                <h3 className="font-semibold text-foreground">{userItem.name}</h3>
                                <p className="text-sm text-muted-foreground">{userItem.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${userItem.role === "guide" ? "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300" : "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"}`}>{userItem.role}</span>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(userItem.id)}><Trash2 className="w-4 h-4 mr-1"/> Delete User</Button>
                        </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- CORRECTED AND RESTYLED MODAL --- */}
      <Dialog open={!!selectedGuide} onOpenChange={(isOpen) => !isOpen && setSelectedGuide(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          {selectedGuide && (
            <>
              <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-2xl">Guide Profile Details</DialogTitle>
                <DialogDescription>
                  Reviewing the profile of <span className="font-semibold">{selectedGuide.name}</span>.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* --- Guide Header Card --- */}
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <img src={selectedGuide.photo} alt={selectedGuide.name} className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{selectedGuide.name}</h3>
                      <p className="text-muted-foreground">{selectedGuide.email}</p>
                      <div className="flex flex-wrap gap-2">
                          <Badge variant={selectedGuide.isApproved ? "default" : "destructive"}>
                            {selectedGuide.isApproved ? "Approved" : "Pending Approval"}
                          </Badge>
                          <Badge variant={selectedGuide.profileComplete ? "secondary" : "outline"}>
                            {selectedGuide.profileComplete ? "Profile Complete" : "Profile Incomplete"}
                          </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* --- Professional Details Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <strong className="text-muted-foreground">Mobile:</strong> 
                            <span className="font-mono">{selectedGuide.mobile || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <strong className="text-muted-foreground">Experience:</strong> 
                            <span className="font-semibold">{selectedGuide.experience || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <strong className="text-muted-foreground">Hourly Rate:</strong> 
                            <span className="font-semibold">{selectedGuide.hourlyRate ? `₹${selectedGuide.hourlyRate.toLocaleString()}` : "N/A"}</span>
                        </div>
                        <div className="pt-2">
                          <strong className="text-muted-foreground">Specializations:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedGuide.specializations?.length ? selectedGuide.specializations.map(spec => (
                              <Badge key={spec} variant="outline">{spec}</Badge>
                            )) : <p className="text-sm text-muted-foreground">N/A</p>}
                          </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- Additional Information Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <strong className="text-muted-foreground mb-2 block">Description:</strong>
                            <p className="whitespace-pre-wrap text-sm text-foreground/80">
                            {selectedGuide.description || "No description provided."}
                            </p>
                        </div>
                        {selectedGuide.license && (
                            <div className="pt-2">
                                <strong className="text-muted-foreground mb-2 block">Documents:</strong>
                                <a href={selectedGuide.license} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-bold hover:underline">
                                    <FileText className="w-4 h-4 mr-2"/> View License / Certificate
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
              </div>

              <DialogFooter className="border-t p-4 bg-muted/50">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}