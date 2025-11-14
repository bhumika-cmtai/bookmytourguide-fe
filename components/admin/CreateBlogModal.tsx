"use client";

import { useState, useMemo, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

// Helper function to create a URL-friendly slug from the title
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

export function CreateBlogModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateBlogModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  // Auto-generate slug from title
  const slug = useMemo(() => slugify(title), [title]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter content');
      return;
    }
    
    if (!thumbnail) {
      alert('Please upload a thumbnail image');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content);
    formData.append('slug', slug);
    
    // Convert tags from comma-separated string to array
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    formData.append('tags', JSON.stringify(tagsArray));
    
    formData.append('published', published.toString());
    
    // ✅ Field name must match backend: "thumbnail"
    formData.append('thumbnail', thumbnail);
    
    // Call the parent's submit handler
    onSubmit(formData);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setPublished(false);
    setThumbnail(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl flex flex-col max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Create a New Blog Post</DialogTitle>
          <DialogDescription>
            Fill in the details below to publish a new article. Click "Create Post" when finished.
          </DialogDescription>
        </DialogHeader>
        
        <form id="blog-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto grid gap-6 p-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="col-span-3" 
              placeholder="Enter blog title"
              required 
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">Slug</Label>
            <Input
              id="slug"
              value={slug}
              className="col-span-3 bg-gray-50"
              placeholder="Auto-generated from title"
              disabled
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Travel, Tips, Destinations (comma-separated)"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="published" className="text-right">Status</Label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Publish immediately
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="thumbnail-image" className="text-right pt-2">
              Thumbnail <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input 
                id="thumbnail-image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('thumbnail-image')?.click()}
              >
                <Upload className="w-4 h-4 mr-2"/> Upload Image
              </Button>
              {imagePreview && (
                <div className="mt-4 border rounded-md p-2">
                  <img 
                    src={imagePreview} 
                    alt="Thumbnail preview" 
                    className="rounded-md max-h-48 w-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="content" className="mb-2">
              Content <span className="text-red-500">*</span>
            </Label>
            <div className="h-64 mb-12">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                className="h-full bg-background" 
                placeholder="Write your blog content here..."
              />
            </div>
          </div>
        </form>
        
        <DialogFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="blog-form" disabled={isLoading} className="red-gradient">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}