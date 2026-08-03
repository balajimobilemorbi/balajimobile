// netlify/functions/phone-specs.js
// Serverless function to fetch phone specs from GSMArena — runs on Netlify edge, no CORS issues.
// Called by ComparePage.jsx when a phone is not in local store DB.

const https = require('https');

// Simple fetch helper for Node (Netlify functions run Node 20)
function nodeFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url);
    const req = https.request(
      {
        hostname,
        path: pathname + (search || ''),
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          ...options.headers
        },
        timeout: 8000
      },
      (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, text: () => Promise.resolve(data) }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

// Parse GSMArena search page HTML to get device list
function parseGSMArenaSearch(html) {
  const devices = [];
  // Match list items with phone link, img and title/alt
  const deviceRegex = /<li[^>]*>\s*<a href="([^"]+\.php)"[^>]*>(?:(?!<\/li>).)*?<img[^>]+src="([^"]+)"[^>]*(?:alt|title)="([^"]+)"/gsi;
  let match;
  while ((match = deviceRegex.exec(html)) !== null && devices.length < 5) {
    devices.push({
      url: match[1].startsWith('http') ? match[1] : `https://www.gsmarena.com/${match[1]}`,
      img: match[2],
      name: match[3].replace(/\s+/g, ' ').trim()
    });
  }

  // Fallback match if standard li pattern didn't capture
  if (devices.length === 0) {
    const linkRegex = /<a href="([^"]+\.php)">\s*<img[^>]+src="([^"]+)"[^>]*>\s*<br>([^<]+)<\/a>/gi;
    while ((match = linkRegex.exec(html)) !== null && devices.length < 5) {
      devices.push({
        url: match[1].startsWith('http') ? match[1] : `https://www.gsmarena.com/${match[1]}`,
        img: match[2],
        name: match[3].replace(/\s+/g, ' ').trim()
      });
    }
  }
  return devices;
}

// Parse GSMArena device detail page to extract specs
function parseGSMArenaDevice(html, deviceName, imgUrl) {
  // Extract all spec rows (td.ttl -> td.nfo) into a spec map
  const specMap = {};
  const rowRegex = /<td[^>]*class="[^"]*ttl[^"]*"[^>]*>(.*?)<\/td>\s*<td[^>]*class="[^"]*nfo[^"]*"[^>]*>(.*?)<\/td>/gsi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const rawLabel = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const rawValue = match[2].replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (rawLabel && rawValue && !specMap[rawLabel.toLowerCase()]) {
      specMap[rawLabel.toLowerCase()] = rawValue;
    }
  }

  const getSpecByPattern = (patterns) => {
    for (const p of patterns) {
      const lowerP = p.toLowerCase();
      for (const [k, v] of Object.entries(specMap)) {
        if (k.includes(lowerP)) return v;
      }
    }
    return '—';
  };

  // Title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*specs-phone-name[^"]*"[^>]*>([^<]+)<\/h1>/i);
  const title = (titleMatch?.[1] || deviceName).trim();

  // Image
  const imgMatch = html.match(/itemprop="image"\s+src="([^"]+)"/i) || html.match(/class="specs-photo-main"[^>]*>.*?<img[^>]+src="([^"]+)"/is);
  const image = imgMatch?.[1] || imgUrl || '';

  // Extract key phone specs
  const internalMem = getSpecByPattern(['internal']);
  let ram = '—';
  let storage = internalMem !== '—' ? internalMem : '—';
  if (internalMem.includes('RAM')) {
    const parts = internalMem.split(',');
    const ramPart = parts.find(p => p.toLowerCase().includes('ram')) || '';
    if (ramPart) ram = ramPart.trim();
  }

  const processor = getSpecByPattern(['chipset', 'cpu']);
  const display = getSpecByPattern(['size', 'resolution']);
  const camera = getSpecByPattern(['triple', 'quad', 'dual', 'single', 'main camera']);
  const battery = getSpecByPattern(['type', 'battery']);
  const os = getSpecByPattern(['os']);

  return {
    title,
    image,
    ram,
    storage,
    processor,
    display,
    camera,
    battery,
    os,
    dimensions: getSpecByPattern(['dimensions']),
    weight: getSpecByPattern(['weight']),
    network: getSpecByPattern(['technology']),
    charging: getSpecByPattern(['charging'])
  };
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const query = event.queryStringParameters?.q || '';
  if (!query || query.trim().length < 2) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Query too short' }) };
  }

  try {
    const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=${encodeURIComponent(query)}`;
    const searchRes = await nodeFetch(searchUrl);

    if (!searchRes.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'GSMArena unavailable' }) };
    }

    const searchHtml = await searchRes.text();
    const devices = parseGSMArenaSearch(searchHtml);

    if (devices.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'No devices found', query }) };
    }

    // Fetch first device's full spec page
    const deviceRes = await nodeFetch(devices[0].url);
    if (!deviceRes.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Could not fetch device page' }) };
    }
    const deviceHtml = await deviceRes.text();
    const specs = parseGSMArenaDevice(deviceHtml, devices[0].name, devices[0].img);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        device: {
          ...specs,
          brand: specs.title.split(' ')[0],
          gsmarenaUrl: devices[0].url,
          otherResults: devices.slice(1).map(d => ({ name: d.name, img: d.img, url: d.url }))
        }
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', message: err.message })
    };
  }
};
