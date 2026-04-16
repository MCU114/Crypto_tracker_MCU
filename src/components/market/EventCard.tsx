'use client';

import { Event } from '@/src/types/event';
import SponsoredPlacementNotice from '@/src/components/ads/SponsoredPlacementNotice';
import { mockExchanges } from '@/data/mockExchanges';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {

  const exchangeUrl =
    mockExchanges.find((ex) => ex.name === event.exchangeName)?.websiteUrl ?? event.ctaUrl;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if event is active
  const isActive = () => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return now >= start && now <= end;
  };

  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Airdrop':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Trading Competition':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Fee Rebate':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Listing':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Promotion':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Referral Bonus':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="card-surface p-5 md:p-6">
      <div className="relative">
        {/* Top row: Exchange Logo, Name, and Badges */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex items-start gap-3">
            {event.exchangeLogoUrl && (
              <img
                src={event.exchangeLogoUrl}
                alt={`${event.exchangeName} logo`}
                className="w-12 h-12 rounded-lg object-contain flex-shrink-0 border border-slate-200 bg-white p-1"
                loading="lazy"
                onError={(e) => {
                  try {
                    e.currentTarget.style.display = 'none';
                  } catch (err) {
                    // Silently fail
                  }
                }}
              />
            )}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
                {event.exchangeName}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`badge-soft ${getEventTypeColor(event.eventType)} border`}
            >
              {event.eventType}
            </span>
            {event.isSponsored && (
              <span className="badge-soft bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
                Sponsored
              </span>
            )}
            {!isActive() && (
              <span className="badge-soft bg-slate-100 text-slate-600 border border-slate-300 text-[11px]">
                {new Date() < new Date(event.startDate) ? 'Upcoming' : 'Ended'}
              </span>
            )}
          </div>
        </div>

        {/* Event Title */}
        <h4 className="text-base md:text-lg font-semibold text-slate-800 mb-3">
          {event.eventTitle}
        </h4>

        {/* Event Description */}
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {event.briefDescription}
        </p>

        {/* Requirements */}
        {event.requirements && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-700 mb-1">Requirements:</p>
            <p className="text-xs text-slate-600">{event.requirements}</p>
          </div>
        )}

        {/* Sponsored Placement Notice */}
        <SponsoredPlacementNotice websiteUrl={exchangeUrl} />

        {/* CTA Button */}
        <div className="flex justify-end">
          <a
            href={exchangeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-5 py-3 rounded-full font-medium text-sm shadow-sm hover:shadow-md transition-all brand-button border border-transparent"
          >
            {event.ctaLabel}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

