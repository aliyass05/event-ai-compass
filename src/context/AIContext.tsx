
import React, { createContext, useContext, useState } from "react";
import { Event } from "./EventContext";
import { useToast } from "@/components/ui/use-toast";

type Transcript = {
  courses: {
    code: string;
    name: string;
    grade: string;
  }[];
};

type Recommendation = {
  eventId: string;
  reason: string;
  score: number;
};

type ReviewSummary = {
  eventId: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  averageRating: number;
};

type AIContextType = {
  isProcessing: boolean;
  transcript: Transcript | null;
  recommendations: Recommendation[];
  reviewSummaries: Record<string, ReviewSummary>;
  uploadTranscript: (transcript: Transcript) => void;
  getRecommendations: (events: Event[]) => Promise<void>;
  modifyRecommendations: (prompt: string, events: Event[]) => Promise<void>;
  generateReviewSummary: (eventId: string, reviews: any[]) => Promise<ReviewSummary>;
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [reviewSummaries, setReviewSummaries] = useState<Record<string, ReviewSummary>>({});
  const { toast } = useToast();

  const uploadTranscript = (transcriptData: Transcript) => {
    setTranscript(transcriptData);
    toast({
      title: "Transcript uploaded",
      description: "We'll use this to recommend events tailored to your academic interests.",
    });
  };

  // Mock function to generate recommendations based on transcript and events
  const getRecommendations = async (events: Event[]) => {
    if (!transcript) {
      toast({
        title: "No transcript available",
        description: "Please upload your transcript to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple mock recommendation logic based on matching course names with event tags and titles
      const newRecommendations = events.map(event => {
        // Calculate a score based on matching keywords between courses and event
        const eventKeywords = [
          ...event.tags, 
          ...event.title.split(" "), 
          ...event.category.split(" ")
        ].map(k => k.toLowerCase());
        
        let matchScore = 0;
        
        transcript.courses.forEach(course => {
          const courseKeywords = [
            ...course.name.split(" "), 
            course.code
          ].map(k => k.toLowerCase());
          
          courseKeywords.forEach(courseWord => {
            if (eventKeywords.some(eventWord => eventWord.includes(courseWord) || courseWord.includes(eventWord))) {
              matchScore += 1;
              
              // Bonus points for A grades in related courses
              if (course.grade === "A" || course.grade === "A+") {
                matchScore += 0.5;
              }
            }
          });
        });
        
        // Normalize score to be between 0 and 1, then scale to 0-100
        const normalizedScore = Math.min(100, Math.round((matchScore / 5) * 100));
        
        return {
          eventId: event.id,
          score: normalizedScore,
          reason: generateRecommendationReason(event, transcript.courses, normalizedScore)
        };
      })
      .filter(rec => rec.score > 20) // Only include recommendations with a minimum score
      .sort((a, b) => b.score - a.score); // Sort by score descending
      
      setRecommendations(newRecommendations);
      
      toast({
        title: "Recommendations ready",
        description: `We found ${newRecommendations.length} events that match your academic profile.`,
      });
    } catch (error) {
      toast({
        title: "Error generating recommendations",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate a simple explanation for the recommendation
  const generateRecommendationReason = (
    event: Event, 
    courses: Transcript["courses"], 
    score: number
  ): string => {
    if (score > 80) {
      const relevantCourse = courses.find(course => 
        event.tags.some(tag => 
          course.name.toLowerCase().includes(tag.toLowerCase()) || 
          tag.toLowerCase().includes(course.name.toLowerCase())
        )
      );
      
      if (relevantCourse) {
        return `Highly recommended based on your strong performance in ${relevantCourse.name}.`;
      }
      return "Highly recommended based on your academic profile.";
    } else if (score > 50) {
      return "This event aligns well with your academic interests.";
    } else {
      return "This event might expand your knowledge in a relevant area.";
    }
  };

  // Function to modify recommendations based on a prompt
  const modifyRecommendations = async (prompt: string, events: Event[]) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse the prompt for keywords
      const promptLower = prompt.toLowerCase();
      
      // Check for keywords in the prompt and adjust recommendations accordingly
      let filteredEvents = [...events];
      
      // Handle different types of modification requests
      if (promptLower.includes("more technical") || promptLower.includes("advanced")) {
        // Filter for more technical events
        filteredEvents = events.filter(event => 
          event.tags.some(tag => 
            ["advanced", "technical", "research", "workshop", "technology", "science", "mathematics"].includes(tag.toLowerCase())
          )
        );
      } else if (promptLower.includes("beginner") || promptLower.includes("introductory")) {
        // Filter for beginner events
        filteredEvents = events.filter(event => 
          event.title.toLowerCase().includes("introduction") || 
          event.title.toLowerCase().includes("beginner") ||
          event.description.toLowerCase().includes("beginner")
        );
      } else if (promptLower.includes("business") || promptLower.includes("entrepreneurship")) {
        // Business focus
        filteredEvents = events.filter(event => 
          event.category.toLowerCase().includes("business") || 
          event.tags.some(tag => ["business", "entrepreneurship", "management", "marketing"].includes(tag.toLowerCase()))
        );
      } else if (promptLower.includes("art") || promptLower.includes("creative")) {
        // Arts focus
        filteredEvents = events.filter(event => 
          event.category.toLowerCase().includes("art") || 
          event.tags.some(tag => ["art", "creative", "design", "literature", "music"].includes(tag.toLowerCase()))
        );
      }
      
      // Generate new recommendations based on filtered events
      const newRecommendations = filteredEvents.map(event => ({
        eventId: event.id,
        score: Math.floor(Math.random() * 50) + 50, // Random score between 50-100
        reason: `Selected based on your request: "${prompt}"`
      }))
      .sort((a, b) => b.score - a.score); // Sort by score descending
      
      setRecommendations(newRecommendations);
      
      toast({
        title: "Recommendations updated",
        description: `We've modified your recommendations based on your request.`,
      });
    } catch (error) {
      toast({
        title: "Error modifying recommendations",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate a review summary for an event
  const generateReviewSummary = async (eventId: string, reviews: any[]): Promise<ReviewSummary> => {
    setIsProcessing(true);
    
    try {
      // Check if we already have a summary for this event
      if (reviewSummaries[eventId]) {
        return reviewSummaries[eventId];
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (reviews.length === 0) {
        throw new Error("No reviews available for this event");
      }
      
      // Calculate average rating
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      // Determine sentiment
      let sentiment: "positive" | "neutral" | "negative" = "neutral";
      if (averageRating >= 4) {
        sentiment = "positive";
      } else if (averageRating < 3) {
        sentiment = "negative";
      }
      
      // Generate simple summary
      let summary = "";
      if (sentiment === "positive") {
        summary = "Most participants were very satisfied with this event. " + 
                 "They highlighted the quality of the content and the organization. " +
                 "Several mentioned they would recommend it to peers.";
      } else if (sentiment === "negative") {
        summary = "Some participants expressed concerns about this event. " +
                 "Common points of feedback include the level of difficulty and pacing. " +
                 "Consider reviewing the content before attending.";
      } else {
        summary = "Participants had mixed feedback about this event. " +
                 "Some found it valuable while others thought it could be improved. " +
                 "Consider your specific interests when deciding to attend.";
      }
      
      const newSummary = {
        eventId,
        summary,
        sentiment,
        averageRating: parseFloat(averageRating.toFixed(1))
      };
      
      // Update the state with the new summary
      setReviewSummaries(prev => ({
        ...prev,
        [eventId]: newSummary
      }));
      
      return newSummary;
    } catch (error) {
      toast({
        title: "Error generating review summary",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider 
      value={{ 
        isProcessing,
        transcript,
        recommendations,
        reviewSummaries,
        uploadTranscript,
        getRecommendations,
        modifyRecommendations,
        generateReviewSummary
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
