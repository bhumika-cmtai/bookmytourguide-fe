// app/dashboard/admin/addons/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { addOnPerks as initialAddOns } from '@/lib/data'; // Import the new data
import type { AddOnPerk } from '@/lib/data'; // Import the new type
import { toast } from 'react-toastify';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  RefreshCw,
  Tag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

// Form data type now matches the simpler AddOnPerk model
type AddOnFormData = Omit<AddOnPerk, '_id'>;

export default function AddOnsAdminPage() {
  // --- STATE MANAGEMENT ---
  const [allAddOns, setAllAddOns] = useState<AddOnPerk[]>(initialAddOns);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AddOnPerk['category']>('all');
  
  const [showForm, setShowForm] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState<AddOnPerk | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<AddOnFormData>({
    title: '',
    description: '',
    price: 0,
    image: '',
    category: 'Eco Tour',
  });

  // --- DERIVED STATE & FILTERING ---
  const filteredAddOns = useMemo(() => {
    return allAddOns
      .filter(addon => categoryFilter === 'all' || addon.category === categoryFilter)
      .filter(addon => addon.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allAddOns, searchTerm, categoryFilter]);

  // --- CRUD FUNCTIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingAddOn) {
      setAllAddOns(allAddOns.map(a => a._id === editingAddOn._id ? { ...editingAddOn, ...formData } : a));
      toast.success("Perk updated successfully!");
    } else {
      const newAddOn: AddOnPerk = {
        _id: `perk_new_${Date.now()}`,
        ...formData,
      };
      setAllAddOns([newAddOn, ...allAddOns]);
      toast.success("Perk created successfully!");
    }
    setIsLoading(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this perk?')) {
      setAllAddOns(allAddOns.filter(a => a._id !== id));
      toast.success("Perk deleted successfully!");
    }
  };

  const handleEdit = (addon: AddOnPerk) => {
    setEditingAddOn(addon);
    setFormData({
      title: addon.title,
      description: addon.description,
      price: addon.price,
      image: addon.image,
      category: addon.category,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      image: '',
      category: 'Eco Tour',
    });
    setEditingAddOn(null);
    setShowForm(false);
  };

  // The categories now match your drawing
  const categories: AddOnPerk['category'][] = ["Eco Tour", "Heritage Tour", "One-day Tour", "Handicraft Tour", "Spice Market Tour"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Other Perks / Add-ons</h1>
            <p className="text-muted-foreground mt-1">Manage reusable perks that can be added to any tour package.</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="shadow red-gradient">
            <Plus className="w-5 h-5 mr-2" /> Add New Perk
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as any)} className="px-4 py-2 rounded-md border bg-transparent">
                  <option value="all">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Add-ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAddOns.map(addon => (
            <Card key={addon._id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <img src={addon.image} alt={addon.title} className="w-full h-40 object-cover"/>
              <div className="p-4 flex flex-col flex-1">
                <Badge variant="outline" className="w-fit mb-2">{addon.category}</Badge>
                <h3 className="font-bold text-lg">{addon.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 flex-1 mt-1">{addon.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xl font-extrabold text-primary">₹{addon.price.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(addon)}><Edit className="w-4 h-4"/></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(addon._id)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* --- SIMPLIFIED ADD/EDIT FORM MODAL --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl">{editingAddOn ? 'Edit Perk' : 'Create New Perk'}</CardTitle>
              <CardDescription>Fill in the details for this reusable tour perk.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
                <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}/></div>
                <div className="space-y-2"><Label htmlFor="image">Image URL *</Label><Input id="image" type="url" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}/></div>
                <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input id="price" type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select required value={formData.category} onValueChange={(value: AddOnPerk['category']) => setFormData({...formData, category: value})}>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 border-t pt-6 bg-muted/50">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="red-gradient">
                  {isLoading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin"/>Saving...</> : (editingAddOn ? 'Update Perk' : 'Create Perk')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}