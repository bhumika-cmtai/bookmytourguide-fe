"use client";

import { useState, useEffect, FormEvent } from 'react';
import { AdminLocation } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  locationData: AdminLocation | null;
  isLoading: boolean;
}

export function LocationFormModal({ isOpen, onClose, onSave, locationData, isLoading }: LocationFormModalProps) {
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null); // State specifically for the file
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (locationData) {
      setPlaceName(locationData.placeName);
      setDescription(locationData.description);
      setPricePerPerson(locationData.pricePerPerson);
      setImageFile(null); // Reset file input when editing
      setPreview(locationData.image); // Show existing image from S3 URL
    } else {
      setPlaceName('');
      setDescription('');
      setPricePerPerson(0);
      setImageFile(null);
      setPreview(null);
    }
  }, [locationData, isOpen]); // Also reset on isOpen to clear form when reopened

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file); // Store the selected file in state
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // If it's a new location, a file must be selected
    if (!locationData && !imageFile) {
        alert("select an image for the new location.");
        return;
    }
    
    const formData = new FormData();
    formData.append('placeName', placeName);
    formData.append('description', description);
    formData.append('pricePerPerson', pricePerPerson.toString());
    
    // ✅ CRITICAL FIX: Only append the image if a new file has been selected.
    // The backend's 'upload.single("image")' middleware looks for this exact key.
    if (imageFile) {
      formData.append('image', imageFile);
    }
    console.log("Image file being sent:", formData.get('image'));

    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{locationData ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          <DialogDescription>
            {locationData ? 'Update the details for this location.' : 'Fill in the details for a new location.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="placeName">Place Name</Label>
            <Input id="placeName" value={placeName} onChange={(e) => setPlaceName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="pricePerPerson">Base Price/Person (₹)</Label>
            <Input id="pricePerPerson" type="number" value={pricePerPerson} onChange={(e) => setPricePerPerson(Number(e.target.value))} required />
          </div>
          <div>
            <Label htmlFor="imageFile">{locationData ? "Change Image" : "Image"}</Label>
            <Input id="imageFile" type="file" accept="image/*" onChange={handleImageChange} required={!locationData} />
            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Image Preview:</p>
                <Image src={preview} alt="Image preview" width={100} height={100} className="rounded-md object-cover" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}