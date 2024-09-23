"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS } from "@/destinations";
import { Feature } from "@/types/mapbox";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LightningBoltIcon } from "@radix-ui/react-icons";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const MAPBOX_API_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const MAPBOX_ACCESS_TOKEN =
  "sk.eyJ1IjoiZmVsaXBlZ29tc3MiLCJhIjoiY20xNW84cmdqMDJ4cTJqb3Brd3VodGRqZyJ9.15i96Qa98RIC8aq1tC7ewQ";

export default function Home() {
  const [openSelect, setOpenSelect] = useState(false);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("");
  const [duration, setDuration] = useState("");
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const suggestionRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setOpenSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionRef]);

  const DEBOUNCE_DELAY = 500;
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    const debounceTimeout = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `${MAPBOX_API_URL}/${encodeURIComponent(
              query
            )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`
          );
          const data = await response.json();
          setSuggestions(data.features || []);
        } catch (error) {
          console.error("Error fetching mapbox data:", error);
        }
      };

      fetchSuggestions();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handlePlan = () => {
    if (!query || !lang || !duration) {
      console.log(query, lang, duration);
      toast.error("Please make sure to fill in all fields before proceeding.");
      return;
    }
    router.push(query + "?lang=" + lang + "&days=" + duration);
  };

  return (
    <div className="relative">
      <div className="relative -z-50 2xl:min-h-[600px] xl:min-h-96 lg:min-h-72 md:min-h-52 min-h-28">
        <Image
          src={"/traveler.png"}
          width={4147}
          height={1080}
          alt="Traveler Background"
          className="fixed"
          priority
        />
      </div>
      <div className="relative bg-white">
        <section className="w-full grid lg:grid-cols-2 place-items-center">
          <div className="flex flex-col justify-center items-start md:p-20 p-10 gap-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
              <span className="text-orange-500">Tailor-Made</span> Journeys
              <br />
              for Every Explorer
            </h1>

            <p>
              Discover new destinations with ease and explore the world your
              way, with every trip designed just for you. Traveler brings you a
              personalized travel experience, curating itineraries tailored to
              your preferences. Whether you&apos;re seeking adventure, culture,
              or relaxation, your journey will be unique, crafted to suit your
              style and needs. Travel smarter and enjoy a stress-free trip,
              knowing every detail is perfectly planned for you.
            </p>

            <ol className="border-s border-orange-400 md:flex md:justify-center md:gap-6 md:border-s-0 md:border-t">
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[5px] me-3 h-[9px] w-[9px] rounded-full bg-orange-400 md:-mt-[5px] md:me-0 md:ms-0"></div>
                  <p className="mt-2 text-sm text-neutral-500 ">Step 1</p>
                </div>
                <div className="ms-4 mt-2 pb-5 md:ms-0">
                  <h4 className="mb-1.5 text-xl font-semibold">
                    Define Your Destination
                  </h4>
                  <p className="mb-3 text-neutral-500 ">
                    Choose your ideal destination and let us know where you want
                    to go to start planning your trip.
                  </p>
                </div>
              </li>

              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[5px] me-3 h-[9px] w-[9px] rounded-full bg-orange-400 md:-mt-[5px] md:me-0 md:ms-0"></div>
                  <p className="mt-2 text-sm text-neutral-500 ">Step 2</p>
                </div>
                <div className="ms-4 mt-2 pb-5 md:ms-0">
                  <h4 className="mb-1.5 text-xl font-semibold">
                    Choose Dates and Preferences
                  </h4>
                  <p className="mb-3 text-neutral-500 ">
                    Set your travel dates and customize your preferences,
                    including activities and accommodation.
                  </p>
                </div>
              </li>

              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[5px] me-3 h-[9px] w-[9px] rounded-full bg-orange-400 md:-mt-[5px] md:me-0 md:ms-0"></div>
                  <p className="mt-2 text-sm text-neutral-500 ">Step 3</p>
                </div>
                <div className="ms-4 mt-2 pb-5 md:ms-0">
                  <h4 className="mb-1.5 text-xl font-semibold">
                    Receive Your Customized Itinerary
                  </h4>
                  <p className="mb-3 text-neutral-500 ">
                    Get a complete, personalized itinerary with all trip details
                    and recommendations.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div>
            <Image
              src={"/hero.png"}
              width={1080}
              height={1080}
              alt="Hero Image"
            />
          </div>
        </section>
      </div>

      <div className="bg-zinc-950 flex gap-10 items-center justify-center flex-col py-20 px-4 dark">
        <Toaster />

        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-orange-600  to-zinc-50 inline-block text-transparent bg-clip-text">
          Your Adventure Awaits!
        </h1>
        <Tabs defaultValue="free-plan" className="max-w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free-plan">Free Plan</TabsTrigger>
            <TabsTrigger value="explorer-plan" disabled>
              Explorer Plan (soon)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="free-plan">
            <Card>
              <CardHeader>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>
                  Choose your destination, number of days, and the language for
                  your itinerary. Once you&apos;re done, click the button to
                  generate your itinerary.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Destination</Label>
                  <div className="relative" ref={suggestionRef}>
                    <Input
                      type="text"
                      placeholder={
                        DESTINATIONS[
                          Math.floor(Math.random() * DESTINATIONS.length)
                        ].name
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setOpenSelect(true)}
                    />
                    {suggestions.length > 0 && openSelect && (
                      <div className="absolute bg-zinc-950 p-2 z-10 border-2 gap-1 grid rounded-md w-full overflow-hidden mt-1">
                        {suggestions.map((suggestion) => {
                          return (
                            <Button
                              variant="ghost"
                              key={suggestion.id}
                              className="flex justify-start"
                              onClick={() => {
                                setQuery(suggestion.place_name);
                                setOpenSelect(false);
                              }}
                            >
                              {suggestion.place_name.length > 45
                                ? `${suggestion.place_name.slice(0, 45)}...`
                                : suggestion.place_name}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                    }}
                    type="number"
                    placeholder="7"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    onValueChange={(value) => setLang(value)}
                    defaultValue={"english"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark">
                      <SelectItem value="pt-BR">Portuguese</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>{" "}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePlan}>
                  <LightningBoltIcon className="mr-2 h-4 w-4" />
                  Let&apos;s Plan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="explorer-plan">
            <Card>
              <CardHeader>
                <CardTitle>Explorer Plan - $X</CardTitle>
                <CardDescription>
                  With the Explorer Plan, in addition to choosing the
                  destination and itinerary language, you can further customize
                  your trip: set your budget, travel preferences, number of
                  people, dates, and much more. Once you&apos;re done, click the
                  button to generate your personalized itinerary.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="columns-2 xl:columns-5 lg:columns-3 gap-4 space-y-4 bg-white p-10">
        {DESTINATIONS.map((destination, index) => (
          <Link
            href={destination.slug}
            key={index}
            className="flex flex-col gap-4 relative group "
          >
            <Image
              loading="lazy"
              width={1000}
              height={500}
              className="h-auto max-w-full rounded-lg "
              src={`/destinations/${destination.slug}.jpg`}
              alt={destination.name}
            />
            <div className="bg-black/50 backdrop-blur-md absolute top-0 bottom-0 left-0 right-0 hidden group-hover:block ease-in-out duration-150"></div>
            <h2 className="absolute bottom-0 left-0 scroll-m-20 text-2xl font-semibold tracking-tight text-white p-4">
              {destination.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
