/* The app catalog lives here. One entry creates a card and a details view.
   A privacy link points to the app's actual policy. Never invent a store URL.
   Optional fields: iconUrl, storeUrl, termsUrl, status, formats. */
window.FT_APPS = [
  {
    id: "all-document-reader",
    name: "All Document Reader",
    category: "Productivity",
    platform: "Android",
    icon: "document",
    color: "blue",
    description: "PDFs, documents, spreadsheets and presentations. Bring everyday reading into one place.",
    intro: "Open, read and organize supported documents on your Android phone. From a report for work to notes for class, find the file you need and get back to what matters.",
    features: [
      { title: "Read across formats", text: "Open PDFs, Word documents, Excel spreadsheets, PowerPoint presentations and plain text files." },
      { title: "Find your documents", text: "Locate supported files on your device through the file access you choose to grant." },
      { title: "Keep things organized", text: "Bring finding, opening and organizing documents into a focused mobile workflow." }
    ],
    formats: ["PDF", "DOC", "DOCX", "XLS", "XLSX", "PPT", "PPTX", "TXT"],
    compatibility: "Complex formatting, encryption or a damaged file can affect how an individual document opens or displays.",
    privacySummary: "Core document reading takes place on your device. Advertising, analytics and other services may process technical information. The app policy explains the distinction and your choices.",
    privacyUrl: "apps/all-document-reader/privacy/index.html",
    termsUrl: "terms.html",
    storeUrl: ""
  },
  {
    id: "vape-less",
    name: "Quit Vape & Pouches",
    category: "Lifestyle",
    platform: "Android",
    icon: "leaf",
    color: "green",
    description: "Keep track of your quit plan, daily logs and milestones—one check-in at a time.",
    intro: "A personal tracking app for adults working towards quitting vaping or nicotine pouches. Keep your plan, daily entries and reminders together on your phone.",
    features: [
      { title: "Your plan, in one place", text: "Record your quit date, step-down plan and daily limits. Keep a clear view of the information you enter." },
      { title: "Make each check-in count", text: "Log daily use, view streaks and milestones, and see estimates based on your entries." },
      { title: "Reminders that fit your routine", text: "Set daily check-in reminders and view progress with the home-screen widget." }
    ],
    note: "For adults of legal age. The app provides general information and personal tracking, not medical advice. Speak to a doctor or pharmacist about support for quitting.",
    privacySummary: "Your quit-tracking entries stay on your phone. Google advertising, analytics and billing services process certain technical information, as described in the app’s privacy policy.",
    privacyUrl: "apps/vape-less/privacy/index.html",
    storeUrl: ""
  }
];
