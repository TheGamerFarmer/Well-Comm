'use client';
export default function FramagendaView() {
    const iframeUrl = `https://framagenda.org/apps/calendar/p/7S9QLY2ZK7SkEnms`;

    return (
        <div className="calendar-container w-full h-[600px] border rounded-lg overflow-hidden shadow-sm">
            <iframe
                src={iframeUrl}
                className="w-full h-full"
                title="Calendrier partagé"
                sandbox="allow-scripts allow-same-origin allow-popups"
                loading="lazy"
            />
        </div>
    );
}