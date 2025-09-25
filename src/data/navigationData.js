export const navigationData = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Communities", href: "#communities" },
  { name: "Testimonials", href: "#testimonials" },
];

export const roleBasedNavigation = {
  MENTOR: [
    { name: "My Services", href: "/my/services" },
    { name: "My Communities", href: "/my/communities" },
  ],
  MENTEE: [
    { name: "Session Requests", href: "/my/session-requests" },
    { name: "My Communities", href: "/my/communities" },
  ],
  COMMUNITY_MANAGER: [
    { name: "My Community", href: "/communities/my" },
    { name: "Community Settings", href: "/communities/my/settings" },
    { name: "Manage Community", href: "/communities/my/manage" },
  ],
  ADMIN: [
    { name: "User reports", href: "/management/user-reports" },
    { name: "Banned Users", href: "/management/banned-users" },
    { name: "User management", href: "/management/users" }
  ]
};

export const footerData = {
  company: {
    name: "Growtly",
    description:
      "Connecting mentees with experienced mentors worldwide. Empowering talent from underrepresented regions and fostering global professional growth.",
    tagline: "Global Mentorship Platform",
  },
  links: {
    platform: [
      { name: "Find Mentors", href: "/mentors" },
      { name: "Communities", href: "/communities" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Pricing", href: "/pricing" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
  copyright: "© 2025 Growtly. All rights reserved. Built by Growtly Team.",
  taglineBottom: "Made with ❤️ for global mentorship",
};
