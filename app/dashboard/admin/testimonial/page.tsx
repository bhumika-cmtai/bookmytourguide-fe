// pages/admin/testimonials/index.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialVisibility,
  clearError,
  setCurrentPage,
  selectTestimonials,
  selectTestimonialsLoading,
  selectTestimonialsError,
  selectTestimonialsPagination,
  selectTestimonialsActionStates,
} from "@/lib/redux/testimonialSlice";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  AlertCircle,
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/motion-variants";

interface TestimonialFormData {
  name: string;
  message: string;
  rating: number;
  image: string;
  position: string;
  isVisible: boolean;
}

export default function TestimonialsAdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const testimonials = useSelector(selectTestimonials);
  const isLoading = useSelector(selectTestimonialsLoading);
  const error = useSelector(selectTestimonialsError);
  const pagination = useSelector(selectTestimonialsPagination);
  const actionStates = useSelector(selectTestimonialsActionStates);

  const [currentPage, setCurrentPageState] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<boolean | undefined>(
    undefined
  );
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [selectedTestimonials, setSelectedTestimonials] = useState<Set<string>>(
    new Set()
  );
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    message: "",
    rating: 5,
    image: "",
    position: "",
    isVisible: true,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch testimonials when parameters change
  useEffect(() => {
    dispatch(
      fetchTestimonials({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        visible: visibilityFilter,
      })
    );
  }, [dispatch, currentPage, debouncedSearch, visibilityFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPageState(page);
    dispatch(setCurrentPage(page));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await dispatch(
          updateTestimonial({
            id: editingTestimonial._id,
            testimonial: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createTestimonial(formData)).unwrap();
      }
      resetForm();
      // Refresh the list
      dispatch(
        fetchTestimonials({
          page: currentPage,
          limit: 10,
          search: debouncedSearch,
          visible: visibilityFilter,
        })
      );
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await dispatch(deleteTestimonial(id)).unwrap();
      } catch (error) {
        console.error("Error deleting testimonial:", error);
      }
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    try {
      await dispatch(
        toggleTestimonialVisibility({ id, isVisible: !currentVisibility })
      ).unwrap();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      message: testimonial.message,
      rating: testimonial.rating || 5,
      image: testimonial.image || "",
      position: testimonial.position || "",
      isVisible: testimonial.isVisible,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      message: "",
      rating: 5,
      image: "",
      position: "",
      isVisible: true,
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const handleSelectTestimonial = (id: string) => {
    const newSelected = new Set(selectedTestimonials);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTestimonials(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTestimonials.size === testimonials.length) {
      setSelectedTestimonials(new Set());
    } else {
      setSelectedTestimonials(new Set(testimonials.map((t) => t._id)));
    }
  };

  const handleRefresh = () => {
    dispatch(
      fetchTestimonials({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        visible: visibilityFilter,
      })
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const exportTestimonials = () => {
    if (!testimonials.length) return;

    const csvContent = [
      ["Name", "Position", "Message", "Rating", "Visible", "Created Date"].join(
        ","
      ),
      ...testimonials.map((t) =>
        [
          `"${t.name}"`,
          `"${t.position || ""}"`,
          `"${t.message.replace(/"/g, '""')}"`,
          t.rating || 0,
          t.isVisible,
          new Date(t.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `testimonials-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const visibleTestimonials = testimonials.filter((t) => t.isVisible);
  const avgRating = testimonials.length
    ? testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) /
      testimonials.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Testimonials Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage customer testimonials and reviews
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportTestimonials}
                disabled={!testimonials.length}
                className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Testimonial
              </motion.button>
            </div>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </motion.div>
          )}

          {/* Stats Cards */}
          <motion.div
            variants={fadeInUp}
            custom={1}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Testimonials
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {pagination.total}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visible</p>
                  <p className="text-2xl font-bold text-green-600">
                    {visibleTestimonials.length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {avgRating.toFixed(1)}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            variants={fadeInUp}
            custom={2}
            className="bg-card rounded-2xl p-6 border shadow-sm mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              {/* Visibility Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select
                  value={
                    visibilityFilter === undefined
                      ? "all"
                      : visibilityFilter.toString()
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setVisibilityFilter(
                      value === "all" ? undefined : value === "true"
                    );
                    setCurrentPageState(1);
                  }}
                  className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>

              {selectedTestimonials.size > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <span className="text-sm text-primary font-medium">
                    {selectedTestimonials.size} selected
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded text-red-600 hover:bg-red-100"
                    title="Delete selected"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Testimonials Table */}
          <motion.div
            variants={fadeInUp}
            custom={3}
            className="bg-card rounded-2xl border shadow-sm overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Loading testimonials...
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={
                              testimonials.length > 0 &&
                              selectedTestimonials.size === testimonials.length
                            }
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-border"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Message
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Rating
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Date
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {testimonials.map((testimonial, index) => (
                        <motion.tr
                          key={testimonial._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedTestimonials.has(
                                testimonial._id
                              )}
                              onChange={() =>
                                handleSelectTestimonial(testimonial._id)
                              }
                              className="w-4 h-4 rounded border-border"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {testimonial.image ? (
                                  <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">
                                  {testimonial.name}
                                </div>
                                {testimonial.position && (
                                  <div className="text-sm text-muted-foreground">
                                    {testimonial.position}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                                {testimonial.message}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {renderStars(testimonial.rating || 0)}
                              <span className="text-sm text-muted-foreground ml-2">
                                {testimonial.rating || 0}/5
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleToggleVisibility(
                                  testimonial._id,
                                  testimonial.isVisible
                                )
                              }
                              disabled={actionStates.toggling}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                testimonial.isVisible
                                  ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                              } disabled:opacity-50`}
                            >
                              {testimonial.isVisible ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                              {testimonial.isVisible ? "Visible" : "Hidden"}
                            </motion.button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                testimonial.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(testimonial)}
                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(testimonial._id)}
                                disabled={actionStates.deleting}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * 10 + 1} to{" "}
                        {Math.min(pagination.page * 10, pagination.total)} of{" "}
                        {pagination.total} results
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handlePageChange(Math.max(pagination.page - 1, 1))
                          }
                          disabled={pagination.page === 1}
                          className="p-2 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </motion.button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                              } else if (
                                pagination.page >=
                                pagination.totalPages - 2
                              ) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = pagination.page - 2 + i;
                              }

                              return (
                                <motion.button
                                  key={pageNum}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                    pagination.page === pageNum
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-muted/50 text-muted-foreground"
                                  }`}
                                >
                                  {pageNum}
                                </motion.button>
                              );
                            }
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handlePageChange(
                              Math.min(
                                pagination.page + 1,
                                pagination.totalPages
                              )
                            )
                          }
                          disabled={pagination.page === pagination.totalPages}
                          className="p-2 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-vertical"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) =>
                    setFormData({ ...formData, isVisible: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                />
                <label
                  htmlFor="isVisible"
                  className="text-sm font-medium text-foreground"
                >
                  Make testimonial visible to public
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={actionStates.creating || actionStates.updating}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(actionStates.creating || actionStates.updating) && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}
                  {actionStates.creating || actionStates.updating
                    ? "Saving..."
                    : editingTestimonial
                    ? "Update Testimonial"
                    : "Create Testimonial"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
