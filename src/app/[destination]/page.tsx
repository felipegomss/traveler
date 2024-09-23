"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { FreeTravelItinerary } from "@/types/itinerary";

const fetchItinerary = async (
  destination: string,
  days: number,
  language: string
): Promise<FreeTravelItinerary> => {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ destination, days, language }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch itinerary.");
  }

  const data: FreeTravelItinerary = await response.json();
  return data;
};

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <div className="px-4 sm:px-0">
      <h3 className="text-base font-semibold leading-7 text-gray-900">
        {title}
      </h3>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
    <div className="mt-2 border-t border-gray-100">
      <dl className="divide-y divide-gray-100">{children}</dl>
    </div>
  </div>
);

const ItemList = ({ items }: { items: string[] }) => {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      {items.map((item, index) => (
        <dd
          className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
          key={index}
        >
          {item}
        </dd>
      ))}
    </div>
  );
};

export default function Page() {
  const path = usePathname();
  const params = useSearchParams();
  const destination = decodeURIComponent(path || "")
    .replace(/,/g, ", ")
    .slice(1);
  const days = parseInt(params.get("days") || "7");
  const language = params.get("lang") || "English";

  const [response, setResponse] = useState<FreeTravelItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const itineraryRef = useRef(null);

  const handlePdf = () => {
    const opt = {
      margin: 1,
      filename: `${destination}itinerary.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    if (!itineraryRef.current) return;

    html2pdf().from(itineraryRef.current).set(opt).save();
  };

  useEffect(() => {
    if (destination) {
      fetchItinerary(destination, days, language)
        .then((data) => setResponse(data))
        .catch((error) => setError(error.message));
    }
  }, [destination, days, language]);

  return (
    <div className="relative">
      <div className="absolute right-5 bottom-5">
        <Button onClick={handlePdf}>Download as PDF</Button>
      </div>
      <div className="container mx-auto px-4 py-8 " ref={itineraryRef}>
        <div className="mb-10">
          <div className="px-4 sm:px-0">
            <h1 className="text-3xl font-bold leading-9 text-gray-900">
              Travel Itinerary
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-6 text-gray-500">
              Explore your trip to{" "}
              <span className="font-semibold">{destination}</span> with our
              detailed itinerary.
            </p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            <p>Error: {error}</p>
          </div>
        ) : response ? (
          <div className="space-y-6">
            <Section
              title="Daily Itinerary"
              description="Detailed daily plans for your trip."
            >
              <ItemList items={response.dailyItinerary} />
            </Section>

            <div className="grid lg:grid-cols-2 gap-6">
              <Section
                title="Gastronomy"
                description="Discover the best local food and drink options."
              >
                <ItemList items={response.gastronomy} />
              </Section>

              <Section
                title="Entertainment"
                description="Top activities and entertainment for your enjoyment."
              >
                <ItemList items={response.entertainment} />
              </Section>

              <Section
                title="Hotel Recommendations"
                description="Recommended places to stay during your trip."
              >
                <ItemList items={response.hotelRecommendations} />
              </Section>

              <Section
                title="Curiosities"
                description="Interesting facts and unique features of your destination."
              >
                <ItemList items={response.curiosities} />
              </Section>
            </div>
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-lg">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
