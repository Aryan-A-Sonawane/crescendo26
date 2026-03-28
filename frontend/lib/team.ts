export type Member = {
  name: string;
  role: string;
  initial: string;
  color: string;
  photo?: string;
};

export type Sabha = {
  id: string;
  name: string;
  icon: string;
  accent: string;
  members: Member[];
};

export const CORE: Member[] = [
  { name: "Aryan Mundra", role: "General Secretary", initial: "A", color: "#D4A017" },
  { name: "Anish Gawande", role: "President", initial: "A", color: "#FF6B35" },
  { name: "Sanket Palkar", role: "Joint Secretary", initial: "S", color: "#F72585" },
  { name: "Rajwardhan Rokade", role: "University Representative", initial: "R", color: "#3AAFA9" },
  { name: "Girish Bagul", role: "Treasurer", initial: "G", color: "#D4A017" },
  { name: "Pranav Patil", role: "Assistant University Representative", initial: "P", color: "#FF6B35" },
  { name: "Kaustubh Singh", role: "Sport Secretary", initial: "K", color: "#3AAFA9" },
];

export const SABHAS: Sabha[] = [
  {
    id: "function-execution",
    name: "Function Execution Team",
    icon: "target",
    accent: "#1B4965",
    members: [
      { name: "Ayush Gupta", role: "Function Execution Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Shruti Raina", role: "Function Execution Secretary", initial: "S", color: "#3AAFA9" },
      { name: "Shripad Kanakdande", role: "Function Execution Secretary", initial: "S", color: "#3AAFA9" },
    ],
  },
  {
    id: "pr-branding",
    name: "PR and Branding Team",
    icon: "megaphone",
    accent: "#8B1538",
    members: [
      { name: "Ameya Badge", role: "Head PR and Branding", initial: "A", color: "#F72585" },
      { name: "Krishna Ardhapurkar", role: "Head PR and Branding", initial: "K", color: "#F72585" },
    ],
  },
  {
    id: "finance",
    name: "Finance Team",
    icon: "currency-dollar",
    accent: "#2D6A4F",
    members: [
      { name: "Tanvi Gudekar", role: "Finance Secretary", initial: "T", color: "#3AAFA9" },
      { name: "Tejas Runwal", role: "Finance Secretary", initial: "T", color: "#3AAFA9" },
    ],
  },
  {
    id: "aesthetics",
    name: "Aesthetics Team",
    icon: "palette",
    accent: "#6B0F1A",
    members: [
      { name: "Arya Gaikwad", role: "Aesthetics Secretary", initial: "A", color: "#D4A017" },
      { name: "Sejal Band", role: "Aesthetics Secretary", initial: "S", color: "#D4A017" },
      { name: "Surabhi Bhalerao", role: "Aesthetics Secretary", initial: "S", color: "#D4A017" },
    ],
  },
  {
    id: "database",
    name: "Database Team",
    icon: "database",
    accent: "#B85042",
    members: [
      { name: "Soham Tawari", role: "Database Secretary", initial: "S", color: "#FF6B35" },
      { name: "Amogh Nikumb", role: "Database Secretary", initial: "A", color: "#FF6B35" },
    ],
  },
  {
    id: "extra-curricular",
    name: "Extra Curricular Team",
    icon: "theater",
    accent: "#8B1538",
    members: [
      { name: "Anush Nair", role: "Extra Curricular Secretary", initial: "A", color: "#F72585" },
      { name: "Palak Mahajan", role: "Extra Curricular Secretary", initial: "P", color: "#F72585" },
    ],
  },
  {
    id: "sponsorship",
    name: "Sponsorship Team",
    icon: "handshake",
    accent: "#2D6A4F",
    members: [
      { name: "Yash Chougale", role: "Sponsorship Secretary", initial: "Y", color: "#3AAFA9" },
    ],
  },
  {
    id: "light-sound",
    name: "Light & Sound Team",
    icon: "volume-high",
    accent: "#1B4965",
    members: [
      { name: "Ayush Singh", role: "Light & Sound Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Padmanabh Khairnar", role: "Light & Sound Secretary", initial: "P", color: "#3AAFA9" },
    ],
  },
  {
    id: "publicity-outreach",
    name: "Publicity & Outreach Team",
    icon: "bullhorn",
    accent: "#6B0F1A",
    members: [
      { name: "Nitya Munshi", role: "Publicity & Outreach Secretary", initial: "N", color: "#D4A017" },
      { name: "Sahil Datrange", role: "Publicity & Outreach Secretary", initial: "S", color: "#D4A017" },
      { name: "Yashowardhan Lengare", role: "Publicity & Outreach Secretary", initial: "Y", color: "#D4A017" },
    ],
  },
  {
    id: "resource-refreshment",
    name: "Resource & Refreshment Team",
    icon: "utensils",
    accent: "#B85042",
    members: [
      { name: "Shruti Jaiswal", role: "Resource & Refreshment Secretary", initial: "S", color: "#FF6B35" },
      { name: "Atharva Joshi", role: "Resource & Refreshment Secretary", initial: "A", color: "#FF6B35" },
      { name: "Tanishq Chunamuri", role: "Resource & Refreshment Secretary", initial: "T", color: "#FF6B35" },
    ],
  },
  {
    id: "sports",
    name: "Sports Team",
    icon: "trophy",
    accent: "#2D6A4F",
    members: [
      { name: "Shravan Malwade", role: "Sports Secretary", initial: "S", color: "#3AAFA9" },
      { name: "Vedant Kambale", role: "Sports Secretary", initial: "V", color: "#3AAFA9" },
      { name: "Aditri Iyer", role: "Sports Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Shlok Raskar", role: "Sports Secretary", initial: "S", color: "#3AAFA9" },
    ],
  },
  {
    id: "technical",
    name: "Technical Team",
    icon: "settings",
    accent: "#1B4965",
    members: [
      { name: "Aditya Chougule", role: "Technical Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Arnav Phadke", role: "Technical Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Yug Jain", role: "Technical Secretary", initial: "Y", color: "#3AAFA9" },
    ],
  },
  {
    id: "venue",
    name: "Venue Team",
    icon: "map-pin",
    accent: "#8B1538",
    members: [
      { name: "Arnav Jadhav", role: "Venue Secretary", initial: "A", color: "#F72585" },
      { name: "Ansh Rathod", role: "Venue Secretary", initial: "A", color: "#F72585" },
      { name: "Mayur Sabale", role: "Venue Secretary", initial: "M", color: "#F72585" },
    ],
  },
  {
    id: "content-social",
    name: "Content and Social Media Team",
    icon: "pencil-square",
    accent: "#6B0F1A",
    members: [
      { name: "Nishika Jain", role: "Content and Social Media Secretary", initial: "N", color: "#D4A017" },
      { name: "Amber Rathi", role: "Content and Social Media Secretary", initial: "A", color: "#D4A017" },
      { name: "Rudraksh Adhane", role: "Content and Social Media Secretary", initial: "R", color: "#D4A017" },
    ],
  },
  {
    id: "communications",
    name: "Communications Team",
    icon: "chat-bubble",
    accent: "#B85042",
    members: [
      { name: "Sanyukta Kakade", role: "Communications Secretary", initial: "S", color: "#FF6B35" },
      { name: "Soham Kadam", role: "Communications Secretary", initial: "S", color: "#FF6B35" },
    ],
  },
  {
    id: "editorial",
    name: "Editorial Team",
    icon: "book",
    accent: "#8B1538",
    members: [
      { name: "Monali Bhujbal", role: "Editorial Secretary", initial: "M", color: "#F72585" },
    ],
  },
  {
    id: "multimedia",
    name: "Multimedia Team",
    icon: "film",
    accent: "#1B4965",
    members: [
      { name: "Pratham Hindocha", role: "Multimedia Secretary", initial: "P", color: "#3AAFA9" },
      { name: "Uday Deshmukh", role: "Multimedia Secretary", initial: "U", color: "#3AAFA9" },
      { name: "Vihaan Dhanapune", role: "Multimedia Secretary", initial: "V", color: "#3AAFA9" },
    ],
  },
  {
    id: "photography",
    name: "Photography Team",
    icon: "camera",
    accent: "#6B0F1A",
    members: [
      { name: "Atharva Nikam", role: "Photography Secretary", initial: "A", color: "#D4A017" },
      { name: "Mrugank Ghaisas", role: "Photography Secretary", initial: "M", color: "#D4A017" },
    ],
  },
  {
    id: "vaatchal",
    name: "Vaatchal Team",
    icon: "road",
    accent: "#B85042",
    members: [
      { name: "Pranish Belsare", role: "Vaatchal Secretary", initial: "P", color: "#FF6B35" },
      { name: "Soham Suvarna", role: "Vaatchal Secretary", initial: "S", color: "#FF6B35" },
    ],
  },
  {
    id: "website",
    name: "Website Team",
    icon: "computer-desktop",
    accent: "#2D6A4F",
    members: [
      { name: "Anushka Bhalerao", role: "Website Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Aryan Sonawane", role: "Website Secretary", initial: "A", color: "#3AAFA9" },
    ],
  },
];