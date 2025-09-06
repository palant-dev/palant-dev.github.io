// Structured data for search engines
const structuredData = {
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "Antonio Palomba",
  "url": "https://palant-dev.github.io/",
  "sameAs": [
    "https://www.linkedin.com/in/palant/",
    "https://github.com/palant-dev"
  ],
  "jobTitle": "Program Manager",
  "worksFor": {
    "@type": "Consultant",
    "name": "Cutowl Srl"
  },
  "description": "Experienced Program Manager with a strong technical background in software development, specializing in leading cross-functional teams and delivering complex technical projects. Currently seeking Program/Technical Program Management opportunities at FAANG companies.",
  "alumniOf": [
    {
      "@type": "AcademicOrganization",
      "name": "Apple Developer Academy"
    }
  ],
  "knowsAbout": [
    "Program Management",
    "Technical Leadership",
    "Agile & Scrum",
    "Software Development Lifecycle",
    "Stakeholder Management",
    "Product Strategy",
    "Cross-functional Team Leadership",
    "Risk Management",
    "Process Improvement",
    "OKRs & KPIs",
    "Technical Debt Management",
    "iOS Development",
    "Mobile Development",
    "Web Development"
  ],
  "hasCredential": [
    {
      "@type": "BachelorDegree",
      "name": "Bachelor of Science in Computer Science"
    }
  ]
};

// Add the structured data to the page
document.addEventListener('DOMContentLoaded', function() {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
});
