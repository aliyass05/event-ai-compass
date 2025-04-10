
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "@/context/EventContext";

interface EventCardProps {
  event: Event;
  isReserved?: boolean;
  isLivestream?: boolean;
  onReserve?: (isLivestream: boolean) => void;
  onCancel?: () => void;
  showActions?: boolean;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isReserved = false,
  isLivestream = false,
  onReserve,
  onCancel,
  showActions = true,
  className,
}) => {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className={cn("event-card overflow-hidden h-full flex flex-col", className)}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
        />
        <div className="overlay">
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/90 text-primary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Badge className="absolute top-4 right-4 bg-primary/90">
          {event.category}
        </Badge>
        {event.hasLivestream && (
          <Badge className="absolute top-4 left-4 bg-secondary text-primary">
            <Tv className="h-3 w-3 mr-1" />
            Livestream Available
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-grow py-4">
        <h3 className="text-lg font-semibold line-clamp-1 mb-2">
          <Link to={`/events/${event.id}`} className="hover:text-primary transition-colors">
            {event.title}
          </Link>
        </h3>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 opacity-70" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-70" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 opacity-70" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        
        {isReserved && (
          <Badge variant={isLivestream ? "outline" : "default"} className="mt-3">
            {isLivestream ? (
              <>
                <Tv className="h-3 w-3 mr-1" />
                Attending via Livestream
              </>
            ) : (
              "Attending In Person"
            )}
          </Badge>
        )}
        
        <div className="mt-4 w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {event.registered} / {event.capacity} spots filled
        </p>
      </CardContent>
      
      {showActions && (
        <CardFooter className="px-4 pb-4 pt-0">
          {isReserved ? (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onCancel}
            >
              Cancel Reservation
            </Button>
          ) : event.registered >= event.capacity ? (
            <Button className="w-full" disabled>
              Fully Booked
            </Button>
          ) : (
            <div className="w-full space-y-2">
              <Button 
                className="w-full" 
                onClick={() => onReserve && onReserve(false)}
              >
                Reserve In Person
              </Button>
              
              {event.hasLivestream && (
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={() => onReserve && onReserve(true)}
                >
                  <Tv className="h-4 w-4 mr-2" />
                  Join via Livestream
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
