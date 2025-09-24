import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Flag, AlertTriangle } from "lucide-react";
import { useReportUser } from "../hooks/useProfile";
import toast from "react-hot-toast";

const VIOLATION_TYPES = [
  {
    value: "harassment",
    label: "Harassment or Bullying",
    description: "Threatening, intimidating, or abusive behavior",
  },
  {
    value: "spam",
    label: "Spam or Unwanted Content",
    description: "Repetitive, irrelevant, or promotional content",
  },
  {
    value: "inappropriate_content",
    label: "Inappropriate Content",
    description: "Content that violates community guidelines",
  },
  {
    value: "fake_profile",
    label: "Fake Profile or Identity",
    description: "Impersonation or false information",
  },
  {
    value: "scam",
    label: "Scam or Fraud",
    description: "Fraudulent activities or financial scams",
  },
  {
    value: "hate_speech",
    label: "Hate Speech",
    description: "Content that promotes hatred or discrimination",
  },
  {
    value: "privacy_violation",
    label: "Privacy Violation",
    description: "Sharing personal information without consent",
  },
  {
    value: "other",
    label: "Other",
    description: "Other violation not listed above",
  },
];

export default function ReportUserModal({ isOpen, onClose, reportedUser }) {
  const [selectedViolation, setSelectedViolation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const reportUserMutation = useReportUser();

  const onSubmit = async (data) => {
    if (!selectedViolation) return;

    setIsSubmitting(true);
    try {
      await reportUserMutation.mutateAsync({
        userId: reportedUser.id,
        body: {
          violation: selectedViolation,
          additionalDetails: data.additionalInfo,
        },
      });

      reset();
      setSelectedViolation("");
      onClose();
      toast.success("User reported successfully");
    } catch (error) {
      console.error("Report submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedViolation("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full mr-3">
                <Flag className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Report User
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Report @{reportedUser?.id} for community guidelines violation
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Warning Notice */}
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Important Notice
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  False reports may result in action against your account.
                  Please only report genuine violations of our community
                  guidelines.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Violation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                What type of violation are you reporting? *
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {VIOLATION_TYPES.map((violation) => (
                  <label
                    key={violation.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedViolation === violation.value
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="violationType"
                      value={violation.value}
                      checked={selectedViolation === violation.value}
                      onChange={(e) => setSelectedViolation(e.target.value)}
                      className="mt-1 text-red-600 focus:ring-red-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {violation.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {violation.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {!selectedViolation && errors.violationType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Please select a violation type
                </p>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Additional Information
              </label>
              <textarea
                {...register("additionalInfo", {
                  maxLength: {
                    value: 1000,
                    message:
                      "Additional information must not exceed 1000 characters",
                  },
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Please provide any additional details about this violation (optional)..."
              />
              {errors.additionalInfo && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.additionalInfo.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Optional: Provide context or specific examples of the violation
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !selectedViolation ||
                  isSubmitting ||
                  reportUserMutation.isPending
                }
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting || reportUserMutation.isPending
                  ? "Submitting Report..."
                  : "Submit Report"}
              </button>
            </div>

            {/* Success Message */}
            {reportUserMutation.isSuccess && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                <div className="text-sm text-green-700 dark:text-green-400">
                  Report submitted successfully. Our team will review it within
                  24 hours.
                </div>
              </div>
            )}

            {/* Error Message */}
            {reportUserMutation.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-700 dark:text-red-400">
                  {reportUserMutation.error.message}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
