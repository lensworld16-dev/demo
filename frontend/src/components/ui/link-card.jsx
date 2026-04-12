import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const LinkCard = React.forwardRef(
  ({ className, title, description, imageUrl, href, ...props }, ref) => {
    // Animation variants for framer-motion
    const cardVariants = {
      initial: { scale: 1, y: 0 },
      hover: {
        scale: 1.03,
        y: -5,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
        },
      },
    };

    return (
      <motion.a
        ref={ref}
        href={href}
        className={cn(
          'group relative flex w-full flex-col overflow-hidden',
          'rounded-none border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-500',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900',
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={`Link to ${title}`}
        {...props}
      >
        {/* Image container filling the top half */}
        <div className="w-full aspect-square overflow-hidden bg-gray-50">
          <motion.img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
          />
        </div>

        {/* Text content neatly positioned below, no overlap */}
        <div className="p-6 flex flex-col justify-center text-center">
          <h3 className="mb-2 font-heading text-xl font-medium uppercase tracking-widest text-gray-900 border-b border-gray-200 inline-block pb-1 mx-auto">
            {title}
          </h3>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mt-2">
            {description}
          </p>
        </div>
      </motion.a>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };
