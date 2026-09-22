import React, { useState } from 'react';
import { Star, ShieldCheck, Quote, Search, ThumbsUp, Sparkles } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onBookNow: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onBookNow
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterOptions = [
    { label: 'All Reviews', value: 'all' },
    { label: 'Deep Tissue', value: 'deep tissue' },
    { label: 'Neck & Shoulders', value: 'neck' },
    { label: 'Pressure & Technique', value: 'pressure' },
    { label: 'Swedish & Mobility', value: 'swedish' }
  ];

  const filteredReviews = testimonials.filter(t => {
    const matchesFilter =
      filterTag === 'all' ||
      t.comment.toLowerCase().includes(filterTag.toLowerCase()) ||
      (t.serviceMentioned && t.serviceMentioned.toLowerCase().includes(filterTag.toLowerCase()));

    const matchesSearch =
      t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <section id="testimonials" className="py-20 bg-stone-50 border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Aggregate Score */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Client Feedback & Testimonials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Client Experiences & Reviews
          </h2>

          <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal">
            Real feedback from clients receiving therapeutic deep tissue and restorative bodywork in Rio Rancho.
          </p>

          {/* Rating Summary Card */}
          <div className="mt-8 p-6 rounded-3xl bg-white border border-stone-200 shadow-sm inline-flex flex-col sm:flex-row items-center gap-6 text-left relative overflow-hidden">
            <div className="flex items-center gap-4 pr-0 sm:pr-6 border-b sm:border-b-0 sm:border-r border-stone-100 pb-4 sm:pb-0">
              <span className="text-4xl sm:text-5xl font-black text-stone-900">
                5.0
              </span>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-medium text-stone-500 mt-1 block">
                  Overall Rating • Verified Clients
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-600 max-w-md space-y-1.5">
              <p className="font-medium text-stone-900">
                Clients regularly commend Emily’s responsive communication, thorough anatomical focus, and ability to relieve stubborn tension in the back, neck, and shoulders.
              </p>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold pt-0.5">
                <ShieldCheck className="w-4 h-4" />
                <span>95% 5-star ratings across studio history</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilterTag(option.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  filterTag === option.value
                    ? 'bg-gradient-to-r from-emerald-600 to-pink-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {review.date}
                  </span>
                </div>

                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-emerald-100 absolute -top-1 -left-2 -z-0" />
                  <p className="relative z-10 text-stone-700 text-sm leading-relaxed font-normal">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900 block">{review.author}</span>
                  <span className="text-[11px] text-emerald-700 font-medium">Verified Client</span>
                </div>
                {review.serviceMentioned && (
                  <span className="text-[10px] bg-pink-50 text-pink-800 font-semibold px-2 py-0.5 rounded-full border border-pink-200">
                    {review.serviceMentioned}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
