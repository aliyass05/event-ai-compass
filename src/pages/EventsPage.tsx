
import React, { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import { Event } from "@/context/EventContext";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import { Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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
        toast({
          variant: "destructive",
          title: "Failed to load events",
          description: "There was an error loading the events. Please try again later."
        });
      }
    };

    fetchEvents();
  }, [toast]);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-secondary/20">
      <NavBar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="glass-morph p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Upcoming Events
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 neo-morph-inset p-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 border-none shadow-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <Button variant="outline" className="neo-morph px-4 py-2 h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="green-glass-morph p-8 text-center">
              <h2 className="text-xl font-medium mb-2">No events found</h2>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="neo-morph overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[12px_12px_24px_#d1d1d1,-12px_-12px_24px_#ffffff]"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <EventCard 
                    event={event} 
                    isReserved={false}
                    onReserve={() => {}}
                    onCancel={() => {}}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventsPage;
