/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BRAND_NAME = "Prompt Flow";

export const NAV_LINKS = [
  { label: "Solutions", href: "#services" },
  { label: "Our Edge", href: "#edge" },
  { label: "Packages", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const LOGOS = [
  "VOLVO", "STRIKE", "NVIDIA", "VELOCITY", "PRISM", "COBALT", "AETHER",
  "VOLVO", "STRIKE", "NVIDIA", "VELOCITY", "PRISM", "COBALT", "AETHER"
];

export const STATS = [
  { label: "Retention", value: "98%", color: "text-pink-500" },
  { label: "Ad Spend", value: "12M+", color: "text-purple-500" },
  { label: "Avg ROAS", value: "4.8x", color: "text-cyan-500" },
  { label: "UK Market Share", value: "Top 3", color: "text-white" },
];

export const SERVICES = [
  {
    id: "lead-gen",
    title: "Lead Generation",
    description: "Multi-channel high-intent acquisition. We build systems that identify and capture your ideal customers across Google, Meta, and LinkedIn.",
    benefits: [
      "Google Ads & PPC Management",
      "Meta Ads (FB/IG) Mastery",
      "High-Converting Landing Pages",
      "Lead Qualification Systems"
    ],
    icon: "Target",
    size: "large",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc07UPy2ifQKTynxtMkQE3aH-PMncPDpZ4y2x1bSlnIgWg9kWpqfGDaF-Vu-8mPGN9J55kT87r5apt04H8WSCkR3lDqDNm00tI2W7M84UnzlXF496uMXyywHOXxrBTG7hyEMWV2zqIRHUYFU7jAPCgU_VCUUP8raB2zRM7FejIS6MLlWLxW8ShOrPOD-qTO9A40XMj4SYbQX31W45Wu9VqMZoSXhdo4QnsrpzBT1L4mDSHNTJLjuIoNND74ABa3B5-r3YCpgSZSz8",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    description: "Custom AI-powered systems that capture, qualify, and follow up with leads 24/7 without human intervention.",
    benefits: [
      "24/7 Multi-channel Chatbots",
      "Automated CRM Workflows",
      "Instant Lead Response Systems",
      "AI-Driven Appointment Scheduling"
    ],
    icon: "Cpu",
    size: "small",
    cta: "EXPLORE AI",
  },
  {
    id: "social-growth",
    title: "Social Media Growth",
    description: "Dominate the feed. We create high-performance content and engagement strategies that turn attention into revenue.",
    benefits: [
      "Short-form Video Production",
      "Content Strategy & Scheduling",
      "Active Community Management",
      "Viral Growth Frameworks"
    ],
    icon: "Share2",
    size: "small",
  },
  {
    id: "seo-dominance",
    title: "SEO Excellence",
    description: "Search dominance for long-term growth. We rank you where the high-intent traffic lives.",
    benefits: [
      "Local SEO & GMB Optimization",
      "On-page Technical Mastery",
      "Strategic Authority Building",
      "Conversion-Focused Content"
    ],
    icon: "Globe",
    size: "large",
  },
];

export const PRICING_PACKAGES = [
  {
    name: "Social Media Starter Growth",
    price: "£499",
    description: "Launch your brand's presence from absolute scratch with pristine content.",
    features: [
      "Brand Creation from Scratch",
      "Social Media Presence Setup",
      "Content Calendar & Scheduling",
      "Branded Creatives & Graphics",
      "Daily Social Media Postings",
      "Community Engagement & Management",
      "Analytics & Performance Reports"
    ],
    cta: "Launch Now",
    popular: false
  },
  {
    name: "Social Media Growth Pro",
    price: "£699",
    description: "Scale your reach with multi-channel ad campaigns and custom AI videos.",
    features: [
      "Brand Creation from Scratch",
      "Social Media Presence Setup",
      "Content Calendar & Scheduling",
      "Branded Creatives & Graphics",
      "Daily Social Media Postings",
      "Community Engagement & Management",
      "Analytics & Performance Reports",
      "Meta Ads Campaign Management",
      "AI Video Reels Production",
      "Platform Growth Strategy"
    ],
    cta: "Go Pro",
    popular: true
  },
  {
    name: "Social Media Premium Growth Pro",
    price: "£1,199",
    description: "Primacy and multi-network ad dominance with a dedicated execution team.",
    features: [
      "Brand Creation from Scratch",
      "Social Media Presence Setup",
      "Content Calendar & Scheduling",
      "Branded Creatives & Graphics",
      "Daily Social Media Postings",
      "Community Engagement & Management",
      "Analytics & Performance Reports",
      "Advanced Paid Ads (Meta, Google, TikTok)",
      "High-Response AI Chatbot Integration",
      "4K Video Production & Stories",
      "Weekly 1-on-1 Strategy Calls"
    ],
    cta: "Dominate Market",
    popular: false
  },
  {
    name: "Social Media Enterprise Growth",
    price: "£2,499",
    description: "Complete hands-off custom digital growth infrastructure & dedicated team.",
    features: [
      "Custom Omni-channel Strategy",
      "Handcrafted Brand Voice & Custom Graphics",
      "Dedicated Video Production Team",
      "Advanced AI Autopilot Agents",
      "Omnipresent Lead Capturing Engines",
      "Weekly Performance Audits"
    ],
    cta: "Command Scale",
    popular: false
  }
];

export const TARGET_INDUSTRIES = [
  { name: "Real Estate", icon: "Home", description: "Lead generation for high-value properties." },
  { name: "Restaurants", icon: "Utensils", description: "Filling tables with precision local ads." },
  { name: "Clinics", icon: "Stethoscope", description: "Patient acquisition and booking automation." },
  { name: "Trades", icon: "Wrench", description: "Local dominance for plumbers/electricians." },
  { name: "SMEs", icon: "Briefcase", description: "Scaling UK businesses with AI systems." },
];

export const CASE_STUDIES = [
  {
    title: "Global SaaS Giant Scaling to $10M ARR",
    description: "Deployment of an automated lead engine that reduced acquisition costs by 45% within 90 days.",
    metrics: [
      { label: "Rev Growth", value: "214%", color: "text-primary" },
      { label: "ROAS", value: "12.4x", color: "text-on-surface" },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWb9Lkp1vifmU2s1pFO7Yrdhyp2lx_aYs-zgbQBp2F-_BTkaxn9BX5oUjBQ3IwSVeiXQRHQ1AeFH2DnRPSGcvk-GWjBqVWPTm7cTH0XD3SczObV2luQDt-qBa2T3p2YDLIBelk6DBGD7DIf6gRQ2iY-rV94zInllLUaxcLjfPcyPS4o7FNgXFuzfB8BL3zyFhokoeBPYBAA-gdy9NXK5s9EXBagSNzIbQSiaj94Pk1TofC0yMo_8_XlcdpAbXT5rR3xaFo6b8be6E",
  },
  {
    title: "Regional Logistics Firm Dominating SE Asia",
    description: "Localized SEO offensive combined with CRM automation to capture untapped market segments.",
    metrics: [
      { label: "Local Leads", value: "380%", color: "text-secondary" },
      { label: "LTV Increase", value: "5.1x", color: "text-on-surface" },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCePyyciXvnF5HY2ioJgq_e-Q0pfEKWd78cwd6ACUf9cZ6NCUp2bzoCXrJvEVV9i4Mjdgqn_E_nPC1O_rwoxVHDl4NrRPhH7B8BYbJ6dDC9K7KkbY6LO46XXe8xoSubEJSPEZ99iIh1YT-rASDbs-m3LjXLom7-qWFIvogfrblUdax0Y9E79Ef21X6F01CvFYaPN7dum2_d_rWRHe8Y_Ty_tKQHHIMlUHKyI-pKIZnp-f47R4YsQeSaz4ZS6CjU9XbylW9K269WMUI",
  },
];
