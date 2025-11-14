import React from 'react';
import { Star } from 'lucide-react';

const ReviewItem = ({ date }: { date: string }) => (
  <div className="flex gap-4 py-4 border-b border-gray-200 last:border-0">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-900">Trusted, honest and he delivers</p>
      <p className="text-xs text-gray-500 mt-1">Reviewed by customer</p>
    </div>
    <p className="text-xs text-gray-500">{date}</p>
  </div>
);

export default function ReviewsPage() {
  const reviews = [
    { date: 'June 9, 2025' },
    { date: 'June 9, 2025' },
    { date: 'June 9, 2025' },
    { date: 'June 9, 2025' },
    { date: 'June 9, 2025' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Reviews</h1>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">4.5/5</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-0">
        {reviews.map((r, i) => (
          <ReviewItem key={i} date={r.date} />
        ))}
      </div>
    </div>
  );
}