export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    try {

        const {
            lostItem,
            foundItem
        } = req.body;


        // Check received data
        if (!lostItem || !foundItem) {

            return res.status(400).json({
                error: "Lost and found item information is required."
            });

        }


        // Gemini prompt
        const prompt = `

You are LostLink AI, an intelligent assistant
for a college Lost & Found platform.

Your job is to compare a LOST item and a FOUND item
and determine whether they could be the same physical item.

LOST ITEM:

Name:
${lostItem.name}

Category:
${lostItem.category}

Description:
${lostItem.description}

Location:
${lostItem.location}

Date:
${lostItem.date}


FOUND ITEM:

Name:
${foundItem.name}

Category:
${foundItem.category}

Description:
${foundItem.description}

Location:
${foundItem.location}

Date:
${foundItem.date}


Compare the two reports using:

1. Item type
2. Item name
3. Colour
4. Brand
5. Physical characteristics
6. Unique marks
7. Description
8. Location
9. Date


Give a possible match score from 0 to 100.

IMPORTANT:

A high score does NOT prove that the items are the same.
It only means the reports have similar characteristics.

Return ONLY valid JSON.

Use exactly this format:

{
    "match": true,
    "score": 85,
    "reason": "Both reports describe a black wireless earbud found near the college library."
}

Rules:

- score must be a number between 0 and 100
- match must be true or false
- reason must be short and clear
- do not include Markdown
- do not include JSON code fences
- do not include any text outside the JSON

`;


        // Gemini API request
        const geminiResponse = await fetch(

            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "x-goog-api-key":
                        process.env.GEMINI_API_KEY

                },

                body: JSON.stringify({

                    contents: [

                        {

                            parts: [

                                {
                                    text: prompt
                                }

                            ]

                        }

                    ],

                    generationConfig: {

                        temperature: 0.2,

                        responseMimeType:
                            "application/json"

                    }

                })

            }

        );


        // Gemini API error
        if (!geminiResponse.ok) {

            const error =
                await geminiResponse.text();

            console.error(
                "Gemini Error:",
                error
            );

            return res.status(500).json({

                error:
                    "Gemini API request failed."

            });

        }


        const data =
            await geminiResponse.json();


        // Get Gemini response text
        const responseText =
            data
                ?.candidates?.[0]
                ?.content?.parts?.[0]
                ?.text;


        if (!responseText) {

            return res.status(500).json({

                error:
                    "Gemini returned an empty response."

            });

        }


        // Convert Gemini JSON string to object
        let result;

        try {

            result =
                JSON.parse(responseText);

        } catch (error) {

            console.error(
                "JSON Parse Error:",
                responseText
            );

            return res.status(500).json({

                error:
                    "Gemini returned invalid JSON."

            });

        }


        // Make sure score is valid
        result.score =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(result.score) || 0
                )
            );
        return res.status(200).json({
            match:
                Boolean(result.match),
            score:
                result.score,
            reason:
                result.reason ||
                "No detailed reason was provided."
        });
    } catch (error) {
        console.error(
            "Server Error:",
            error
        );
        return res.status(500).json({
            error:
                "Internal server error."
        });
    }
}