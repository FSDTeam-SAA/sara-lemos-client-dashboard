"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { usePostAskForHelp } from "@/lib/hooks/useOverView";

interface AskForHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  defaultIssue?: string;
  hideIssueField?: boolean;
}

interface HelpFormData {
  issue: string;
  description: string;
  email: string;
}

export function AskForHelpModal({
  isOpen,
  onClose,
  title = "Ask For Help",
  subtitle = "Our yacht marketing experts are here to assist you",
  defaultIssue = "listing",
  hideIssueField = false,
}: AskForHelpModalProps) {
  const [formData, setFormData] = useState<HelpFormData>({
    issue: defaultIssue,
    description: "",
    email: "",
  });

  // Update form data when defaultIssue changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        issue: defaultIssue,
      }));
    }
  }, [defaultIssue, isOpen]);

  const { mutateAsync: postAskForHelp } = usePostAskForHelp();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    postAskForHelp(formData);
    // Log the data to console
    console.log("🚀 Ask For Help Submission Data:", formData);

    // Reset form and close modal
    setFormData({
      issue: defaultIssue,
      description: "",
      email: "",
    });
    onClose();
  };

  const isFormValid = formData.issue && formData.description && formData.email;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="relative w-full bg-white rounded-2xl">
          {/* Header */}
          <div className="bg-linear-to-r from-[#65A30D] to-[#4d7c0f] p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-white/80 text-sm mt-1">{subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Issue Field */}
            {!hideIssueField && (
              <div>
                <label
                  htmlFor="issue"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Issue <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData({ ...formData, issue: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all"
                  required
                >
                  <option value="listing">Listing</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            )}

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all resize-none"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="px-6 py-3 rounded-lg bg-linear-to-r from-[#65A30D] to-[#4d7c0f] text-white font-semibold hover:shadow-lg hover:shadow-[#65A30D]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
