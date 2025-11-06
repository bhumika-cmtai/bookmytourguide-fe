"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { LanguageOption, CreateLanguageOption } from '@/types/admin'; // Assuming you have these types defined

// Props interface updated to accept isLoading and a more accurate onSave type
interface LanguageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (language: LanguageOption | CreateLanguageOption) => void;
  languageData?: LanguageOption | null;
  isLoading?: boolean; // Accept the isLoading prop
}

// A more accurate initial state for a new language form
const initialFormState: CreateLanguageOption = {
  languageName: '',
  extraCharge: 0,
};

export function LanguageFormModal({ isOpen, onClose, onSave, languageData, isLoading = false }: LanguageFormModalProps) {
  // The state can hold a full LanguageOption (when editing) or just the creation data
  const [formData, setFormData] = useState<LanguageOption | CreateLanguageOption>(initialFormState);

  useEffect(() => {
    // Populate form with existing data when the modal opens for editing,
    // otherwise, reset to the initial state for adding a new language.
    if (isOpen) {
      if (languageData) {
        setFormData(languageData);
      } else {
        setFormData(initialFormState);
      }
    }
  }, [languageData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'extraCharge' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSave = () => {
    // The onSave function passed from the parent now handles the logic
    // for whether this is a new language or an update.
    onSave(formData);
  };

  // Close the modal only if it's not in a loading state
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    // Use the handleClose function for onOpenChange
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{languageData ? 'Edit Language' : 'Add New Language'}</DialogTitle>
          <DialogDescription>
            Set the language name and its additional price per tour.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="languageName" className="text-right">
              Language
            </Label>
            <Input
              id="languageName"
              name="languageName"
              value={formData.languageName}
              onChange={handleChange}
              className="col-span-3"
              placeholder="e.g., Russian"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="extraCharge" className="text-right">
              Extra Charge (₹)
            </Label>
            <Input
              id="extraCharge"
              name="extraCharge"
              type="number"
              value={formData.extraCharge}
              onChange={handleChange}
              className="col-span-3"
              placeholder="e.g., 800"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : languageData ? (
              'Save Changes'
            ) : (
              'Add Language'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}