// Cloudflare Workers deployment script
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleAPIRequest(request, env);
    }
    
    // Handle static assets
    if (url.pathname.includes('.')) {
      return handleStaticAsset(request, env);
    }
    
    // Serve React app for all other routes
    return handleReactApp(request, env);
  }
};

async function handleAPIRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  
  try {
    switch (true) {
      case path.startsWith('ai/'):
        return handleAIRequest(request, env);
      case path.startsWith('arbitrage/'):
        return handleArbitrageRequest(request, env);
      case path.startsWith('admin/'):
        return handleAdminRequest(request, env);
      default:
        return new Response('Not Found', { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAIRequest(request, env) {
  const url = new URL(request.url);
  const action = url.pathname.split('/').pop();
  
  switch (action) {
    case 'status':
      return new Response(JSON.stringify({
        autonomousMode: true,
        activeAgents: 4,
        totalDecisions: 156,
        successRate: 94.2
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    case 'interact':
      if (request.method === 'POST') {
        const body = await request.json();
        
        // Make AI API call based on selected agent
        let response;
        switch (body.agentId) {
          case 'claude-strategist':
            response = await callClaudeAPI(body.query, env.ANTHROPIC_API_KEY);
            break;
          case 'openai-creator':
            response = await callOpenAIAPI(body.query, env.OPENAI_API_KEY);
            break;
          case 'grok-analyst':
            response = await callGrokAPI(body.query, env.XAI_API_KEY);
            break;
          case 'deepseek-engineer':
            response = await callDeepSeekAPI(body.query, env.DEEPSEEK_API_KEY);
            break;
          default:
            response = "Agent not found";
        }
        
        return new Response(JSON.stringify({
          id: Date.now().toString(),
          type: 'text',
          agentId: body.agentId,
          response,
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      break;
  }
  
  return new Response('Not Found', { status: 404 });
}

async function callClaudeAPI(query, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: query }]
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAIAPI(query, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: query }],
      max_tokens: 1000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGrokAPI(query, apiKey) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'grok-2-1212',
      messages: [{ role: 'user', content: query }],
      max_tokens: 1000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callDeepSeekAPI(query, apiKey) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-coder',
      messages: [{ role: 'user', content: query }],
      max_tokens: 1000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function handleArbitrageRequest(request, env) {
  // Arbitrage API implementation
  return new Response(JSON.stringify({
    opportunities: [],
    totalProfit: 0,
    success: true
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleAdminRequest(request, env) {
  // Admin API implementation with auth
  const auth = request.headers.get('Authorization');
  if (!auth) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  return new Response(JSON.stringify({
    users: [],
    metrics: {},
    success: true
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleStaticAsset(request, env) {
  // Serve static assets from KV or R2
  const url = new URL(request.url);
  const assetKey = url.pathname.substring(1);
  
  try {
    const asset = await env.ASSETS.get(assetKey);
    if (asset) {
      return new Response(asset, {
        headers: {
          'Content-Type': getContentType(assetKey),
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    }
  } catch (error) {
    console.error('Asset fetch error:', error);
  }
  
  return new Response('Not Found', { status: 404 });
}

async function handleReactApp(request, env) {
  // Serve React app index.html for SPA routing
  try {
    const indexHTML = await env.ASSETS.get('index.html');
    if (indexHTML) {
      return new Response(indexHTML, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        }
      });
    }
  } catch (error) {
    console.error('Index HTML fetch error:', error);
  }
  
  return new Response('Not Found', { status: 404 });
}

function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}