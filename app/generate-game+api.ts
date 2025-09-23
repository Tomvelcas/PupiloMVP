export async function POST(request: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt provided' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // In a real implementation, this would call OpenAI's API
    // For now, we'll simulate the response
    const mockScenario = {
      id: `custom-${Date.now()}`,
      title: `Custom Game: ${prompt}`,
      difficulty: 'medium',
      category: 'custom',
      items: [
        {
          id: '1',
          name: 'Item 1',
          imageUrl: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'example',
          isOddOne: false,
        },
        {
          id: '2',
          name: 'Item 2',
          imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'example',
          isOddOne: false,
        },
        {
          id: '3',
          name: 'Odd Item',
          imageUrl: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'different',
          isOddOne: true,
        },
        {
          id: '4',
          name: 'Item 4',
          imageUrl: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'example',
          isOddOne: false,
        },
      ],
    };

    return new Response(
      JSON.stringify({ scenario: mockScenario }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error generating game scenario:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate game scenario' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}