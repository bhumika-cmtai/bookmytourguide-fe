"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { AdminPackage } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Plus, Trash2, RefreshCw, X } from 'lucide-react';

interface PackageFormData {
  title: string;
  description: string;
  price: number;
  basePrice: number;
  duration: string;
  locations: string[];
  images: (File | string)[];
  isActive: boolean;
}

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  editingPackage: AdminPackage | null;
  isLoading: boolean;
}

export function PackageFormModal({ isOpen, onClose, onSave, editingPackage, isLoading }: PackageFormModalProps) {
  const [formData, setFormData] = useState<PackageFormData>({
    title: '', description: '', price: 0, basePrice: 0, duration: '',
    locations: [''], images: [], isActive: true
  });

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        title: editingPackage.title,
        description: editingPackage.description,
        price: editingPackage.price ?? 0,
        basePrice: editingPackage.basePrice ?? 0,
        duration: editingPackage.duration,
        isActive: editingPackage.isActive,
        locations: editingPackage.locations?.length ? editingPackage.locations : [''],
        images: editingPackage.images || [],
      });
    } else {
      setFormData({
        title: '', description: '', price: 0, basePrice: 0, duration: '',
        locations: [''], images: [], isActive: true
      });
    }
  }, [editingPackage, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price.toString());
    formDataToSend.append('basePrice', formData.basePrice.toString());
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('isActive', formData.isActive.toString());

    formData.locations.filter(loc => loc.trim()).forEach(loc => {
      formDataToSend.append('locations', loc);
    });

    const newImageFiles = formData.images.filter(img => img instanceof File) as File[];
    const existingImageUrls = formData.images.filter(img => typeof img === 'string') as string[];

    newImageFiles.forEach(file => {
      formDataToSend.append('images', file);
    });

    if (editingPackage) {
      existingImageUrls.forEach(url => {
        formDataToSend.append('existingImages', url);
      });
    }
    
    await onSave(formDataToSend);
  };

  const handleArrayFieldChange = (field: 'locations', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };
  
  const addArrayField = (field: 'locations') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field: 'locations', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...Array.from(e.target.files!)] }));
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <CardTitle className="text-2xl">{editingPackage ? 'Edit Package' : 'Create New Package'}</CardTitle>
          <CardDescription>Fill in all the details for the tour package.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="duration">Duration *</Label><Input id="duration" required placeholder="e.g., 7 Days" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="price">Price (₹) *</Label><Input id="price" type="number" required min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} /></div>
              <div className="space-y-2"><Label htmlFor="basePrice">Base Price (₹) *</Label><Input id="basePrice" type="number" required min="0" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })} /></div>
            </div>
            
            {/* Dynamic Locations */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="font-semibold">Locations</Label>
              {formData.locations.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input type="text" value={item} onChange={(e) => handleArrayFieldChange('locations', index, e.target.value)} placeholder="Enter location..." />
                  {/* ✅ FIX: Added type="button" to prevent form submission */}
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayField('locations', index)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              {/* ✅ FIX: Added type="button" to prevent form submission */}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('locations')}><Plus className="w-4 h-4 mr-2" /> Add Location</Button>
            </div>
            
            {/* Image Upload & Preview */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="font-semibold">Images</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt="Package" className="w-full h-full object-cover rounded-md" />
                    {/* ✅ FIX: Added type="button" to prevent form submission */}
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-2" />
            </div>
            
            <div className="flex items-center gap-3 pt-4">
              <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })} />
              <Label htmlFor="isActive" className="cursor-pointer">Make package active on the website</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t pt-6 bg-muted/50 flex-shrink-0">
            {/* ✅ FIX: Added type="button" to prevent form submission */}
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            {/* This is the ONLY button that should submit the form */}
            <Button type="submit" disabled={isLoading}>
              {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? 'Saving...' : (editingPackage ? 'Update Package' : 'Create Package')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}