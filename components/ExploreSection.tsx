import React from 'react';

interface ExploreCardProps {
  imageUrl: string;
  title: string;
  description: string;
  linkText: string;
  linkPage: string;
  onNavigate: (page: string) => void;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
                                                   imageUrl,
                                                   title,
                                                   description,
                                                   linkText,
                                                   linkPage,
                                                   onNavigate,
                                                 }) => (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row w-full max-w-3xl mx-auto">
      <div className="md:w-1/2 w-full overflow-hidden">
        <img
            src={imageUrl}
            alt={title}
            className="w-full h-60 md:h-full object-cover transition-transform duration-500"
        />
      </div>
      <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-brand-gray-800">{title}</h3>
        <p className="mt-4 text-brand-gray-600">{description}</p>
        <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(linkPage);
            }}
            className="mt-6 text-techflex-orange font-bold hover:text-techflex-orange-600 transition-colors duration-300"
        >
          {linkText} &rarr;
        </a>
      </div>
    </div>
);

interface ExploreSectionProps {
  onNavigate: (page: string) => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ onNavigate }) => {
  const exploreItems = [
    {
      imageUrl: 'images/blog-post.png',
      title: 'Our Latest Tech Insights',
      description:
          'Dive into our blog for articles on the future of software, hardware trends, and industry analysis.',
      linkText: 'Read the Blog',
      linkPage: 'blog',
    },
    {
      imageUrl: 'images/projects.png',
      title: 'Featured Client Projects',
      description:
          "See how we've helped businesses like yours succeed with our custom solutions and products.",
      linkText: 'View Projects',
      linkPage: 'home',
    },
  ];

  return (
      <section className="bg-brand-gray-50 py-16 px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-gray-900 mb-10 text-left">
            Explore more
          </h2>
          <div className="grid gap-10 grid-cols-1 lg:grid-cols-2">
            {exploreItems.map((item) => (
                <ExploreCard key={item.title} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>
  );
};

export default ExploreSection;
