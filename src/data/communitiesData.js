import { CheckCircle, FileText, Mail } from "lucide-react";

export const VERIFICATION_STEPS = [
    {
        step: 1,
        title: "Send Verification Email",
        icon: Mail,
        description: "Send an email to sgrowthly@gmail.com with the following information:",
        details: [
            "Community name and description",
            "Organization/school that backs your community",
            "Official documentation proving your affiliation",
            "Your role and position in the organization",
            "Contact information for verification",
        ],
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
        step: 2,
        title: "Provide Additional Information",
        icon: FileText,
        description: "If further verification is needed, we'll reply with specific requests:",
        details: [
            "Additional documentation may be requested",
            "Verification of your identity and role",
            "Proof of community legitimacy",
            "Official endorsement from your organization",
        ],
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
        step: 3,
        title: "Verification Decision",
        icon: CheckCircle,
        description: "You'll receive a final decision via email:",
        details: [
            "✅ Approval: Your community gets verified status",
            "❌ Rejection: Detailed explanation of the reason",
            "🔄 Additional requirements: More information needed",
        ],
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/20",
    },
]
