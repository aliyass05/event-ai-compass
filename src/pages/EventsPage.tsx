import React, { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import { Event } from "@/context/EventContext";
import { useToast } from "@/hooks/use-toast";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load events", {});
      }
    };

    fetchEvents();
  }, [toast]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
