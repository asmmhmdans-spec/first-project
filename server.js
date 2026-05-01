const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const PRICE_SOURCE = "Jumia Egypt";
const LOCAL_PRICE_SOURCE = "Egypt local grocery price";

const localPriceOverrides = [
  {
    title: "Chipsy Large Bag",
    price: 20,
    keywords: ["chipsy", "شيبسي"],
    unitWords: ["large", "big", "كبير", "كبيره"],
  },
  {
    title: "Chipsy Medium Bag",
    price: 15,
    keywords: ["chipsy", "شيبسي"],
    unitWords: ["medium", "وسط", "متوسط"],
  },
  {
    title: "Chipsy Small Bag",
    price: 10,
    keywords: ["chipsy", "شيبسي"],
    unitWords: ["small", "صغير", "صغيره", "كيس"],
  },
  {
    title: "Doritos Large Bag",
    price: 25,
    keywords: ["doritos", "دوريتوس"],
    unitWords: ["large", "big", "كبير", "كبيره"],
  },
  {
    title: "Doritos Small Bag",
    price: 15,
    keywords: ["doritos", "دوريتوس"],
    unitWords: [],
  },
  {
    title: "Cheetos Bag",
    price: 10,
    keywords: ["cheetos", "شيتوس"],
    unitWords: [],
  },
  {
    title: "Bake Rolz Bag",
    price: 10,
    keywords: ["bake rolz", "bakerolz", "بيك رولز", "بيكرولز"],
    unitWords: [],
  },
  {
    title: "Molto Croissant",
    price: 15,
    keywords: ["molto", "مولتو"],
    unitWords: [],
  },
  {
    title: "TODO Brownies",
    price: 15,
    keywords: ["todo", "تودو"],
    unitWords: [],
  },
  {
    title: "Tiger Chips Bag",
    price: 10,
    keywords: ["tiger", "تايجر"],
    unitWords: [],
  },
  {
    title: "Freska Wafer",
    price: 10,
    keywords: ["freska", "فريسكا"],
    unitWords: [],
  },
  {
    title: "Bimbo Cake",
    price: 10,
    keywords: ["bimbo", "بيمبو"],
    unitWords: [],
  },
  {
    title: "Galaxy Chocolate Bar",
    price: 25,
    keywords: ["galaxy", "جالكسي"],
    unitWords: [],
  },
  {
    title: "KitKat Chocolate Bar",
    price: 25,
    keywords: ["kitkat", "kit kat", "كيتكات", "كيت كات"],
    unitWords: [],
  },
  {
    title: "Biscuits Pack",
    price: 10,
    keywords: ["biscuit", "biscuits", "بسكوت", "بسكويت"],
    unitWords: [],
  },
  { title: "Corona Chocolate Bar", price: 15, keywords: ["corona", "كورونا"], unitWords: [] },
  { title: "Cadbury Dairy Milk Bar", price: 30, keywords: ["cadbury", "dairy milk", "كادبوري", "ديري ميلك"], unitWords: [] },
  { title: "Mandolin Chocolate", price: 10, keywords: ["mandolin", "ماندولين"], unitWords: [] },
  { title: "Moro Chocolate Bar", price: 20, keywords: ["moro", "مورو"], unitWords: [] },
  { title: "Snickers Chocolate Bar", price: 30, keywords: ["snickers", "سنيكرز"], unitWords: [] },
  { title: "Twix Chocolate Bar", price: 30, keywords: ["twix", "تويكس"], unitWords: [] },
  { title: "Mars Chocolate Bar", price: 30, keywords: ["mars", "مارس"], unitWords: [] },
  { title: "Bounty Chocolate Bar", price: 30, keywords: ["bounty", "باونتي"], unitWords: [] },
  { title: "M&M's Pack", price: 35, keywords: ["m&m", "mms", "ام اند ام"], unitWords: [] },
  { title: "Skittles Pack", price: 35, keywords: ["skittles", "سكيتلز"], unitWords: [] },
  { title: "Hohos Cake", price: 10, keywords: ["hohos", "ho ho", "هوهوز", "هو هوز"], unitWords: [] },
  { title: "Twinkies Cake", price: 10, keywords: ["twinkies", "توينكيز"], unitWords: [] },
  { title: "Mini Molto", price: 10, keywords: ["mini molto", "ميني مولتو"], unitWords: [] },
  { title: "Bake Stix Bag", price: 10, keywords: ["bake stix", "bakestix", "بيك ستيكس", "بيكستيكس"], unitWords: [] },
  { title: "Pretzo Bag", price: 10, keywords: ["pretzo", "بريتزو"], unitWords: [] },
  { title: "Forno Bag", price: 10, keywords: ["forno", "فورنو"], unitWords: [] },
  { title: "Cono Snack", price: 10, keywords: ["cono", "كونو"], unitWords: [] },
  { title: "Tornado Snack", price: 10, keywords: ["tornado", "تورنادو"], unitWords: [] },
  { title: "Lambada Snack", price: 10, keywords: ["lambada", "لمبادا", "لامبادا"], unitWords: [] },
  { title: "Samba Chocolate", price: 10, keywords: ["samba", "سامبا"], unitWords: [] },
  { title: "Ulker Biscuits", price: 15, keywords: ["ulker", "اولكر", "أولكر"], unitWords: [] },
  { title: "Bisco Misr Biscuits", price: 10, keywords: ["bisco misr", "bisco", "بسكو مصر", "بسكومصر"], unitWords: [] },
  { title: "Oreo Biscuits", price: 15, keywords: ["oreo", "اوريو", "أوريو"], unitWords: [] },
  { title: "Loacker Wafer", price: 25, keywords: ["loacker", "لوكر"], unitWords: [] },
  { title: "Kinder Bueno", price: 40, keywords: ["kinder bueno", "bueno", "كيندر بوينو", "بوينو"], unitWords: [] },
  { title: "Kinder Chocolate", price: 25, keywords: ["kinder", "كيندر"], unitWords: [] },
  { title: "Haribo Gummies", price: 35, keywords: ["haribo", "هاريبو"], unitWords: [] },
  { title: "Chupa Chups Lollipop", price: 10, keywords: ["chupa chups", "chupachups", "تشوبا تشوبس", "مصاصه", "مصاصة"], unitWords: [] },
  { title: "Trident Gum", price: 20, keywords: ["trident", "ترايدنت", "لبان"], unitWords: [] },
  { title: "Clorets Gum", price: 15, keywords: ["clorets", "كلوريتس"], unitWords: [] },
  { title: "Mentos Roll", price: 15, keywords: ["mentos", "منتوس"], unitWords: [] },
  { title: "Tic Tac Pack", price: 25, keywords: ["tic tac", "tictac", "تيك تاك"], unitWords: [] },
  { title: "Popcorn Bag", price: 10, keywords: ["popcorn", "بوب كورن", "فيشار"], unitWords: [] },
  { title: "Croissant", price: 15, keywords: ["croissant", "كرواسون", "كرواسان"], unitWords: [] },
  { title: "Cupcake", price: 10, keywords: ["cupcake", "cup cake", "كب كيك"], unitWords: [] },
  { title: "Wafer", price: 10, keywords: ["wafer", "ويفر"], unitWords: [] },
  { title: "Chocolate Bar", price: 25, keywords: ["chocolate", "choco", "شوكولاته", "شيكولاتة", "شيكولاته"], unitWords: [] },
  {
    title: "Pepsi Can 330ml",
    price: 15,
    keywords: ["pepsi", "بيبس", "بيبسي"],
    unitWords: ["can", "cans", "كان", "كانز", "علبة", "عبوة"],
  },
  {
    title: "Pepsi Bottle 1L",
    price: 25,
    keywords: ["pepsi", "بيبس", "بيبسي"],
    unitWords: ["1l", "1 l", "لتر"],
  },
  {
    title: "Coca-Cola Can 330ml",
    price: 15,
    keywords: ["coca", "cola", "كوكا", "كولا"],
    unitWords: ["can", "cans", "كان", "كانز", "علبة", "عبوة"],
  },
  {
    title: "Sprite Can 330ml",
    price: 15,
    keywords: ["sprite", "سبرايت"],
    unitWords: ["can", "cans", "كان", "كانز", "علبة", "عبوة"],
  },
  {
    title: "Fanta Can 330ml",
    price: 15,
    keywords: ["fanta", "فانتا"],
    unitWords: ["can", "cans", "كان", "كانز", "علبة", "عبوة"],
  },
  {
    title: "Small Water Bottle",
    price: 7,
    keywords: ["water", "مياه", "مايه", "مياه معدنيه"],
    unitWords: ["bottle", "ازازه", "زجاجه", "صغيره"],
  },
  {
    title: "Indomie Noodles Pack",
    price: 10,
    keywords: ["indomie", "اندومي"],
    unitWords: ["pack", "كيس", "عبوه"],
  },
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], sessions: [], decisions: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function getSessionUser(req, db) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;

  const session = db.sessions.find(item => item.token === token);
  if (!session) return null;

  return db.users.find(user => user.id === session.userId) || null;
}

function parseUrl(req) {
  return new URL(req.url, `http://${req.headers.host || "localhost"}`);
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[أإآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ");
}

function lookupLocalPrice(query) {
  const normalizedQuery = normalizeText(query);
  const match = localPriceOverrides.find(item => {
    const hasBrand = item.keywords.some(keyword => normalizedQuery.includes(normalizeText(keyword)));
    const hasUnit = !item.unitWords.length
      || item.unitWords.some(keyword => normalizedQuery.includes(normalizeText(keyword)));
    return hasBrand && hasUnit;
  });

  if (!match) return null;

  return {
    available: true,
    query: String(query || "").trim(),
    title: match.title,
    price: match.price,
    rawPrice: `EGP ${match.price.toFixed(2)}`,
    currency: "EGP",
    source: LOCAL_PRICE_SOURCE,
    url: null,
  };
}

async function lookupProductPrice(query) {
  const cleanQuery = String(query || "").trim();
  if (!cleanQuery) return null;

  const localPrice = lookupLocalPrice(cleanQuery);
  if (localPrice) return localPrice;

  const url = `https://www.jumia.com.eg/catalog/?q=${encodeURIComponent(cleanQuery)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch product price right now.");
  }

  const html = await response.text();
  const productBlocks = html.match(/<article class="prd[\s\S]*?<\/article>/g) || [];
  const products = productBlocks
    .map(block => {
      const titleMatch = block.match(/<h3 class="name">([\s\S]*?)<\/h3>/);
      const priceMatch = block.match(/<div class="prc">([\s\S]*?)<\/div>/);
      const linkMatch = block.match(/<a href="([^"]+)"/);

      if (!titleMatch || !priceMatch) return null;

      const rawPrice = decodeHtml(priceMatch[1]).replace(/\s+/g, " ").trim();
      const numericPrice = Number(rawPrice.replace(/[^\d.]/g, ""));

      return {
        title: decodeHtml(titleMatch[1]).replace(/\s+/g, " ").trim(),
        rawPrice,
        price: numericPrice,
        url: linkMatch ? `https://www.jumia.com.eg${decodeHtml(linkMatch[1])}` : url,
      };
    })
    .filter(product => product && Number.isFinite(product.price));
  const firstProduct = pickBestProduct(cleanQuery, products);

  if (!firstProduct) {
    return {
      available: false,
      query: cleanQuery,
      source: PRICE_SOURCE,
      message: "No matching product price was found.",
    };
  }

  return {
    available: true,
    query: cleanQuery,
    title: firstProduct.title,
    price: firstProduct.price,
    rawPrice: firstProduct.rawPrice,
    currency: "EGP",
    source: PRICE_SOURCE,
    url: firstProduct.url,
  };
}

function pickBestProduct(query, products) {
  const queryTokens = normalizeText(query)
    .split(" ")
    .filter(token => token.length > 1);

  return products
    .map((product, index) => {
      const title = normalizeText(product.title);
      const tokenScore = queryTokens.reduce((score, token) => (
        title.includes(token) ? score + 2 : score
      ), 0);
      const exactBonus = title.includes(normalizeText(query)) ? 5 : 0;
      const packPenalty = /\b(pack|bundle|carton|box|set|24|12|كرتونه|كرتونة|علبه|علبة)\b/.test(title) ? 2 : 0;
      const accessoryPenalty = /\b(cable|charger|case|cover|protector|adapter|screen|كابل|شاحن|جراب|غطاء|اسكرينه)\b/.test(title) ? 6 : 0;

      return {
        ...product,
        score: tokenScore + exactBonus - packPenalty - accessoryPenalty,
        index,
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)[0];
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function validateAuthInput({ name, email, password }) {
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  if (cleanName.length < 3) return "Name must be at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return "Please enter a valid email.";
  if (cleanPassword.length < 6) return "Password must be at least 6 characters.";

  return null;
}

async function handleApi(req, res) {
  try {
    const db = readDb();
    const parsedUrl = parseUrl(req);

    if (req.method === "POST" && req.url === "/api/auth/register-or-login") {
      const payload = await readBody(req);
      const validationError = validateAuthInput(payload);
      if (validationError) return sendJson(res, 400, { error: validationError });

      const name = payload.name.trim();
      const email = payload.email.trim().toLowerCase();
      const password = String(payload.password);
      let user = db.users.find(item => item.email === email);

      if (user) {
        const check = hashPassword(password, user.passwordSalt);
        if (check.hash !== user.passwordHash) {
          return sendJson(res, 401, { error: "Email or password is incorrect." });
        }
        user.name = name;
      } else {
        const passwordData = hashPassword(password);
        user = {
          id: crypto.randomUUID(),
          name,
          email,
          passwordSalt: passwordData.salt,
          passwordHash: passwordData.hash,
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
      }

      const token = crypto.randomBytes(32).toString("hex");
      db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
      writeDb(db);

      return sendJson(res, 200, { token, user: { id: user.id, name: user.name, email: user.email } });
    }

    if (req.method === "GET" && parsedUrl.pathname === "/api/me") {
      const user = getSessionUser(req, db);
      if (!user) return sendJson(res, 401, { error: "Not authenticated." });
      return sendJson(res, 200, { user: { id: user.id, name: user.name, email: user.email } });
    }

    if (req.method === "POST" && parsedUrl.pathname === "/api/logout") {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : "";
      writeDb({ ...db, sessions: db.sessions.filter(session => session.token !== token) });
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "GET" && parsedUrl.pathname === "/api/prices") {
      const user = getSessionUser(req, db);
      if (!user) return sendJson(res, 401, { error: "Not authenticated." });

      const price = await lookupProductPrice(parsedUrl.searchParams.get("query"));
      return sendJson(res, 200, { price });
    }

    if (req.method === "GET" && parsedUrl.pathname === "/api/decisions") {
      const user = getSessionUser(req, db);
      if (!user) return sendJson(res, 401, { error: "Not authenticated." });
      return sendJson(res, 200, { decisions: db.decisions.filter(item => item.userId === user.id) });
    }

    if (req.method === "POST" && parsedUrl.pathname === "/api/decisions") {
      const user = getSessionUser(req, db);
      if (!user) return sendJson(res, 401, { error: "Not authenticated." });

      const payload = await readBody(req);
      const name = String(payload.name || "").trim();
      const status = String(payload.status || "").trim();
      const priceInfo = payload.priceInfo && typeof payload.priceInfo === "object"
        ? payload.priceInfo
        : await lookupProductPrice(name);

      if (!name) return sendJson(res, 400, { error: "Product name is required." });
      if (!["green", "orange", "red"].includes(status)) {
        return sendJson(res, 400, { error: "Decision status is invalid." });
      }

      const duplicate = db.decisions.find(item => {
        const createdAt = new Date(item.createdAt || 0).getTime();
        const isRecent = Date.now() - createdAt < 30000;
        return item.userId === user.id
          && normalizeText(item.name) === normalizeText(name)
          && item.status === status
          && isRecent;
      });

      if (duplicate) {
        return sendJson(res, 200, { decision: duplicate, duplicate: true });
      }

      const decision = {
        id: crypto.randomUUID(),
        userId: user.id,
        name,
        status,
        priceInfo,
        date: new Date().toLocaleString("ar-EG", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        createdAt: new Date().toISOString(),
      };
      db.decisions.push(decision);
      writeDb(db);
      return sendJson(res, 201, { decision });
    }

    if (req.method === "DELETE" && parsedUrl.pathname === "/api/decisions") {
      const user = getSessionUser(req, db);
      if (!user) return sendJson(res, 401, { error: "Not authenticated." });
      writeDb({ ...db, decisions: db.decisions.filter(item => item.userId !== user.id) });
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 404, { error: "API route not found." });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Server error." });
  }
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(ROOT, requestedPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }

    const type = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) return handleApi(req, res);
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  ensureDb();
  console.log(`Server running at http://localhost:${PORT}`);
});
