
export interface JobOpening {
  id: string;
  title: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Product';
  location: 'Remote' | 'San Francisco, CA' | 'New York, NY' | 'Hybrid';
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

export const jobOpenings: JobOpening[] = [
  {
    id: 'job_eng_01',
    title: 'Senior Frontend Engineer (React)',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Engineer to help build the next generation of our user-facing products. You will be responsible for architecting and building complex user interfaces with a focus on performance and usability.',
    responsibilities: [
      'Develop and maintain high-quality, reusable, and performant user interface components using React and TypeScript.',
      'Collaborate with designers and product managers to translate mockups and requirements into functional features.',
      'Mentor junior engineers and contribute to our team\'s best practices for code quality and architecture.',
      'Optimize applications for maximum speed and scalability.',
    ],
    qualifications: [
      '5+ years of professional experience in frontend development.',
      'Deep expertise in React, TypeScript, and modern JavaScript (ES6+).',
      'Strong understanding of HTML5, CSS3, and related web technologies.',
      'Experience with state management libraries like Redux or Zustand.',
      'Familiarity with testing frameworks such as Jest and React Testing Library.',
    ],
  },
  {
    id: 'job_des_01',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Hybrid',
    type: 'Full-time',
    description: 'You will be a core part of our design team, creating intuitive and beautiful experiences across our software and hardware products. This role requires a keen eye for detail and a deep empathy for users.',
    responsibilities: [
      'Create wireframes, storyboards, user flows, and high-fidelity mockups.',
      'Conduct user research and evaluate user feedback to enhance the user experience.',
      'Collaborate with product and engineering teams to implement and iterate on designs.',
      'Maintain and contribute to our design system.',
    ],
    qualifications: [
      '3+ years of experience in UI/UX design for web and mobile applications.',
      'A strong portfolio showcasing your design process and visual design skills.',
      'Proficiency in design tools like Figma, Sketch, or Adobe XD.',
      'Excellent communication and collaboration skills.',
    ],
  },
  {
    id: 'job_pm_01',
    title: 'Product Manager, Enterprise Solutions',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'As a Product Manager, you will own the roadmap for our enterprise software suite. You will work cross-functionally to guide products from conception to launch by connecting the technical and business worlds.',
    responsibilities: [
      'Define product strategy and create detailed roadmaps based on market research and customer feedback.',
      'Write clear and concise product requirements and user stories.',
      'Work closely with engineering, design, and marketing to ensure successful product launches.',
      'Analyze product performance data and user metrics to inform future product decisions.',
    ],
    qualifications: [
      '4+ years of product management experience, preferably in a B2B SaaS environment.',
      'Proven track record of managing all aspects of a successful product throughout its lifecycle.',
      'Strong problem-solving skills and willingness to roll up one\'s sleeves to get the job done.',
      'Technical background with an understanding of software development principles is a plus.',
    ],
  },
  {
    id: 'job_mkt_01',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'We are looking for a data-driven Digital Marketing Specialist to develop, implement, track and optimize our digital marketing campaigns across all digital channels.',
    responsibilities: [
      'Plan and execute all digital marketing, including SEO/SEM, marketing database, email, social media and display advertising campaigns.',
      'Measure and report performance of all digital marketing campaigns, and assess against goals (ROI and KPIs).',
      'Identify trends and insights, and optimize spend and performance based on the insights.',
      'Collaborate with internal teams to create landing pages and optimize user experience.',
    ],
    qualifications: [
      '3+ years of experience in digital marketing.',
      'Demonstrable experience leading and managing SEO/SEM, marketing database, email, social media and/or display advertising campaigns.',
      'Solid knowledge of website analytics tools (e.g., Google Analytics).',
      'Strong analytical skills and data-driven thinking.',
    ],
  },
];
