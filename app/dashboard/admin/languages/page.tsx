// app/admin/languages/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store'; // Adjust this import to your store's location
import {
  fetchLanguages,
  addLanguage,
  updateLanguage,
  deleteLanguage,
} from '@/lib/redux/thunks/admin/languageThunks'; // Adjust import path
import { LanguageOption, CreateLanguageOption } from '@/types/admin';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { LanguageFormModal } from '@/components/admin/LanguageFormModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// Assuming you have a toast notification library like react-hot-toast or similar
import { toast } from 'react-toastify';

export default function AdminLanguagesPage() {
  const dispatch: AppDispatch = useDispatch();
  const { languages, loading, error } = useSelector((state: RootState) => state.languages);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageOption | null>(null);
  const [languageToDelete, setLanguageToDelete] = useState<string | null>(null);

  // Fetch languages when the component mounts
  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  // Display error notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleOpenModalForNew = () => {
    setEditingLanguage(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (language: LanguageOption) => {
    setEditingLanguage(language);
    setIsModalOpen(true);
  };

  const handleSaveLanguage = (languageToSave: LanguageOption | CreateLanguageOption) => {
    const action = '_id' in languageToSave ? updateLanguage(languageToSave as LanguageOption) : addLanguage(languageToSave);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Language ${'_id' in languageToSave ? 'updated' : 'added'} successfully!`);
        setIsModalOpen(false);
        setEditingLanguage(null);
      })
      .catch((err) => {
        // Error is already handled by the slice and useEffect, but you can add specific logic here if needed.
        console.error("Failed to save language:", err);
      });
  };

  const handleDeleteClick = (languageId: string) => {
    setLanguageToDelete(languageId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (languageToDelete) {
      dispatch(deleteLanguage(languageToDelete))
        .unwrap()
        .then(() => {
          toast.success("Language deleted successfully!");
          setIsAlertOpen(false);
          setLanguageToDelete(null);
        })
        .catch((err) => {
          console.error("Failed to delete language:", err);
          setIsAlertOpen(false);
        });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Language Charges</h1>
          <p className="text-muted-foreground">Add surcharges for specialized language guides.</p>
        </div>
        <Button onClick={handleOpenModalForNew} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Language
        </Button>
      </div>

      <div className="bg-background border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Language Name</TableHead>
              <TableHead>Extra Charge (per tour)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && languages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : languages.map((language) => (
              <TableRow key={language._id}>
                <TableCell className="font-medium">{language.languageName}</TableCell>
                <TableCell>
                  {language.extraCharge > 0 ? `₹${language.extraCharge.toLocaleString()}` : 'No extra charge'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenModalForEdit(language)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Language</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(language._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Language</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LanguageFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLanguage}
        languageData={editingLanguage}
        isLoading={loading}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the language option. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={loading}
              className="bg-[var(--destructive)] hover:bg-[var(--destructive)]/90"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, delete it'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}