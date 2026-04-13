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
          'group relative flex w-full flex-col items-center text-center gap-4',
          className
        )}
        aria-label={`Link to ${title}`}
        {...props}
      >
        {/* Rounded Image container like Giva */}
        <div className="w-full aspect-square overflow-hidden rounded-[2.5rem] bg-gray-50 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
          <motion.img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
          />
        </div>

        {/* Title below the rounded image */}
        <div className="flex flex-col items-center">
          <h3 className="font-heading text-sm sm:text-lg font-medium tracking-wide text-gray-900 group-hover:text-[#C41E3A] transition-colors duration-300">
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
