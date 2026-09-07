import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const LinkCard = React.forwardRef(
  ({ className, title, description, imageUrl, href, ...props }, ref) => {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={cn(
          'group relative flex w-full flex-col items-center text-center gap-2 sm:gap-4',
          className
        )}
        aria-label={`Link to ${title}`}
        {...props}
      >
        {/* Rounded Image container like Giva */}
        <div className="w-full aspect-square overflow-hidden rounded-full bg-pink-50/60 border border-pink-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-pink-200/50 group-hover:border-pink-300 group-hover:-translate-y-1">
          <motion.img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600';
            }}
            className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
          />
        </div>

        {/* Title below the rounded image */}
        <div className="flex flex-col items-center">
          <h3 className="font-heading text-xs sm:text-base font-semibold tracking-wide text-gray-900 group-hover:text-[#C41E3A] transition-colors duration-300">
            {title}
          </h3>
          {/* Optional small detail like Giva has tiny subtitle sometimes, but we keep it minimal */}
          <div className="w-0 h-0.5 bg-[#C41E3A] transition-all duration-300 group-hover:w-full mt-1" />
        </div>
      </motion.a>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };
