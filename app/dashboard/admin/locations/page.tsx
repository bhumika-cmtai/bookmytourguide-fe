"use client";

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { AdminLocation } from '@/types/admin';
import {
  fetchAdminLocations,
  addAdminLocation,
  updateAdminLocation,
  deleteAdminLocation,
} from '@/lib/redux/thunks/admin/locationThunks';

// Step 1: Import the toast function
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { LocationFormModal } from '@/components/admin/LocationFormModal';
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


export default function AdminLocationsPage() {
  const dispatch = useAppDispatch();
  const { locations, loading, error } = useAppSelector((state) => state.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<AdminLocation | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminLocations());
  }, [dispatch]);

  // Optional: Show a toast if the initial fetch fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);


  const handleOpenModalForEdit = (location: AdminLocation) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleOpenModalForNew = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  // ✅ UPDATED: handleSaveLocation with success and error toasts
  const handleSaveLocation = async (formData: FormData) => {
    try {
      if (editingLocation) {
        // Use .unwrap() to get the success payload or throw the error
        await dispatch(updateAdminLocation({ id: editingLocation._id, locationData: formData })).unwrap();
        toast.success("Location updated successfully!");
      } else {
        await dispatch(addAdminLocation(formData)).unwrap();
        toast.success("Location created successfully!");
      }
      handleCloseModal(); // Close modal only on success
    } catch (err: any) {
      // The rejected value from the thunk is caught here
      toast.error(err.message || "An unknown error occurred.");
    }
  };

  const handleDeleteClick = (locationId: string) => {
    setLocationToDelete(locationId);
    setIsAlertOpen(true);
  };

  // ✅ UPDATED: confirmDelete with success and error toasts
  const confirmDelete = async () => {
    if (locationToDelete) {
      try {
        await dispatch(deleteAdminLocation(locationToDelete)).unwrap();
        toast.success("Location deleted successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete location.");
      }
    }
    setIsAlertOpen(false);
    setLocationToDelete(null);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Tour Locations</h1>
            <p className="text-muted-foreground">Add, edit, or remove tour location packages.</p>
        </div>
        <Button onClick={handleOpenModalForNew} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Location
        </Button>
      </div>

      {/* The error banner for initial fetch is still useful */}
      {error && !loading && locations.length === 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              Failed to load locations: {error}
          </div>
      )}

      <div className="bg-background border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Place Name</TableHead>
              <TableHead>Base Price/Person</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Loading locations...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => (
                <TableRow key={location._id}>
                  <TableCell>
                    <Image src={location.image} alt={location.placeName} width={64} height={64} className="rounded-md object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{location.placeName}</TableCell>
                  <TableCell>₹{location.pricePerPerson.toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{location.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModalForEdit(location)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(location._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <LocationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLocation}
        locationData={editingLocation}
        isLoading={loading}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-[var(--destructive)] hover:bg-destructive/90">
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}