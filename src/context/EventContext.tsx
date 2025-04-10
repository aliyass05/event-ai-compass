
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  capacity: number;
  registered: number;
  tags: string[];
  hasLivestream: boolean;
};

export type Review = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

export type ReservationType = {
  eventId: string;
  isLivestream: boolean;
};

type EventContextType = {
  events: Event[];
  reviews: Review[];
  userReservations: ReservationType[];
  getEventById: (id: string) => Event | undefined;
  getEventReviews: (eventId: string) => Review[];
  reserveEvent: (eventId: string, isLivestream: boolean) => void;
  cancelReservation: (eventId: string) => void;
  isEventReserved: (eventId: string) => boolean;
  getReservationType: (eventId: string) => boolean;
  addReview: (review: Omit<Review, "id" | "date">) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

// Sample events data
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Introduction to Artificial Intelligence",
    description: "Learn the fundamentals of AI and machine learning in this beginner-friendly workshop.",
    date: "2025-05-15",
    time: "14:00",
    location: "Science Building, Room 301",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1677329661406-7d151f3609de?q=80&w=1632&auto=format&fit=crop",
    capacity: 50,
    registered: 32,
    tags: ["AI", "Computer Science", "Workshop"],
    hasLivestream: true
  },
  {
    id: "2",
    title: "Business Ethics Seminar",
    description: "Explore ethical dilemmas in modern business practices with industry experts.",
    date: "2025-05-20",
    time: "10:00",
    location: "Business School Auditorium",
    category: "Business",
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1471&auto=format&fit=crop",
    capacity: 100,
    registered: 45,
    tags: ["Ethics", "Business", "Seminar"],
    hasLivestream: true
  },
  {
    id: "3",
    title: "Advanced Calculus Workshop",
    description: "Deepen your understanding of calculus concepts and advanced problem-solving techniques.",
    date: "2025-05-25",
    time: "13:30",
    location: "Mathematics Department, Room 204",
    category: "Mathematics",
    image: "https://images.unsplash.com/photo-1594739790611-20ff2727462a?q=80&w=1470&auto=format&fit=crop",
    capacity: 30,
    registered: 18,
    tags: ["Mathematics", "Calculus", "Workshop"],
    hasLivestream: false
  },
  {
    id: "4",
    title: "Psychology Research Presentation",
    description: "Join us for presentations from psychology researchers on their latest findings.",
    date: "2025-06-05",
    time: "15:00",
    location: "Psychology Building, Lecture Hall 2",
    category: "Psychology",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?q=80&w=1470&auto=format&fit=crop",
    capacity: 80,
    registered: 52,
    tags: ["Psychology", "Research", "Presentation"],
    hasLivestream: true
  },
  {
    id: "5",
    title: "Environmental Science Field Trip",
    description: "Explore local ecosystems and collect data for environmental research projects.",
    date: "2025-06-10",
    time: "09:00",
    location: "University Main Gate (Meeting Point)",
    category: "Environmental Science",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1374&auto=format&fit=crop",
    capacity: 20,
    registered: 15,
    tags: ["Environmental Science", "Field Trip", "Research"],
    hasLivestream: false
  },
  {
    id: "6",
    title: "Literary Analysis Workshop",
    description: "Develop your critical analysis skills for fiction and poetry in this interactive workshop.",
    date: "2025-06-15",
    time: "14:30",
    location: "Liberal Arts Building, Room 108",
    category: "Literature",
    image: "https://images.unsplash.com/photo-1592496431922-40349e911f74?q=80&w=1612&auto=format&fit=crop",
    capacity: 25,
    registered: 12,
    tags: ["Literature", "English", "Workshop"],
    hasLivestream: true
  }
];

// Sample reviews data
const sampleReviews: Review[] = [
  {
    id: "1",
    eventId: "1",
    userId: "101",
    userName: "Emma Johnson",
    rating: 5,
    comment: "The AI workshop was extremely informative. The professor explained complex concepts in a way that was easy to understand. Would highly recommend!",
    date: "2025-05-16"
  },
  {
    id: "2",
    eventId: "1",
    userId: "102",
    userName: "James Smith",
    rating: 4,
    comment: "Great introduction to AI concepts. I wish we had more hands-on exercises, but overall it was very valuable.",
    date: "2025-05-16"
  },
  {
    id: "3",
    eventId: "2",
    userId: "103",
    userName: "Sophia Garcia",
    rating: 5,
    comment: "The ethics seminar sparked important discussions about real-world business scenarios. I appreciated the diverse perspectives shared.",
    date: "2025-05-21"
  },
  {
    id: "4",
    eventId: "3",
    userId: "104",
    userName: "Liam Chen",
    rating: 3,
    comment: "The content was very advanced. I think having some prerequisite materials would have helped me prepare better.",
    date: "2025-05-26"
  }
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [userReservations, setUserReservations] = useState<ReservationType[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load user reservations from localStorage
    const storedReservations = localStorage.getItem("userReservations");
    if (storedReservations) {
      setUserReservations(JSON.parse(storedReservations));
    }
  }, []);

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getEventReviews = (eventId: string) => {
    return reviews.filter(review => review.eventId === eventId);
  };

  const reserveEvent = (eventId: string, isLivestream: boolean) => {
    const eventExists = userReservations.some(reservation => reservation.eventId === eventId);
    
    if (!eventExists) {
      const newReservation = { eventId, isLivestream };
      const updatedReservations = [...userReservations, newReservation];
      setUserReservations(updatedReservations);
      localStorage.setItem("userReservations", JSON.stringify(updatedReservations));
      
      // Update the event's registered count
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, registered: event.registered + 1 } 
          : event
      ));
      
      toast({
        title: "Event reserved",
        description: `You have successfully reserved a spot for this event${isLivestream ? ' via livestream' : ' in person'}.`,
      });
    }
  };

  const cancelReservation = (eventId: string) => {
    const reservationExists = userReservations.some(reservation => reservation.eventId === eventId);
    
    if (reservationExists) {
      const updatedReservations = userReservations.filter(reservation => reservation.eventId !== eventId);
      setUserReservations(updatedReservations);
      localStorage.setItem("userReservations", JSON.stringify(updatedReservations));
      
      // Update the event's registered count
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, registered: Math.max(0, event.registered - 1) } 
          : event
      ));
      
      toast({
        title: "Reservation cancelled",
        description: "You have cancelled your reservation for this event.",
      });
    }
  };

  const isEventReserved = (eventId: string) => {
    return userReservations.some(reservation => reservation.eventId === eventId);
  };

  const getReservationType = (eventId: string) => {
    const reservation = userReservations.find(reservation => reservation.eventId === eventId);
    return reservation ? reservation.isLivestream : false;
  };

  const addReview = (reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([...reviews, newReview]);
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <EventContext.Provider 
      value={{ 
        events, 
        reviews,
        userReservations,
        getEventById, 
        getEventReviews,
        reserveEvent,
        cancelReservation,
        isEventReserved,
        getReservationType,
        addReview
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
