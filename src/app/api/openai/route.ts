import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const extractJSONFromContent = (content: string): object => {
  const startIndex = content.indexOf("{");

  if (startIndex === -1) {
    throw new Error("Invalid response format: No JSON object found.");
  }

  const endIndex = content.lastIndexOf("}");

  if (endIndex === -1) {
    throw new Error("Invalid response format: No closing JSON object found.");
  }

  const jsonString = content.substring(startIndex, endIndex + 1);

  // Escapar aspas internas
  const escapedJsonString = jsonString
    .replace(/"([^"]+)":/g, (match, p1) => {
      return `"${p1.replace(/"/g, '\\"')}":`;
    })
    .replace(/: "([^"]*)"/g, (match, p1) => {
      return `: "${p1.replace(/"/g, '\\"')}"`;
    });

  try {
    return JSON.parse(escapedJsonString);
  } catch (error: unknown) {
    throw new Error("Failed to parse JSON");
  }
};

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const { destination, days, language } = await req.json();

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: `Create a travel itinerary for the destination: ${destination} for ${days} days in ${language}. 
      
      Please ensure the response is a valid JSON object with the following structure:

      {
        "dailyItinerary": [
          "Days 1-10: Highlights of the trip (e.g., 'Visit major attractions, enjoy cultural experiences, and taste local food.')"
        ],
        "gastronomy": [
          "Restaurant: Description of local dishes (e.g., 'Aruba: Enjoy traditional Brazilian cuisine.')"
        ],
        "entertainment": [
          "Activity: Description (e.g., 'Teatro Municipal: Enjoy a Broadway-style show.')"
        ],
        "hotelRecommendations": [
          "Hotel: Description (e.g., 'Hotel Delphinus: A luxurious stay with great amenities.')"
        ],
        "curiosities": [
          "Fact: Interesting detail (e.g., 'The city is known as the \"Capital of Chocolate\" due to its many chocolate shops.')"
        ]
      }

      Important: 
      - The keys in the JSON object must be in English.
      - Validate the JSON structure before returning. If you are unable to provide a valid JSON, please return an error message detailing the issue.
      `,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (content) {
      const response = extractJSONFromContent(content);
      return NextResponse.json(response);
    } else {
      throw new Error("No content returned from the AI model.");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data from OpenAI" },
      { status: 500 }
    );
  }
}
