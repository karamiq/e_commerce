/*
 * Seed Iraqi governorates and cities via REST endpoints.
 * Requires the API to be running at BASE_URL (default http://localhost:3000/api).
 * Optionally set TOKEN env var for Authorization: Bearer.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/api';
const TOKEN = process.env.TOKEN || '';

const headers = {
  'Content-Type': 'application/json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const governorates = {
  Baghdad: ['Baghdad', 'Abu Ghraib', 'Mahmudiya', 'Taji', "Mada'in"],
  'Al Anbar': ['Ramadi', 'Fallujah', 'Haditha', "Al-Qa'im", 'Rutba'],
  Babil: ['Hillah', 'Al-Musayab', 'Hashimiya', 'Mahawil'],
  Basra: ['Basra', 'Az Zubayr', 'Al-Qurnah', 'Abu Al-Khasib'],
  'Dhi Qar': ['Nasiriyah', 'Suq Al-Shuyukh', 'Shatra', 'Rifai'],
  Diyala: ['Baqubah', 'Khanaqin', 'Muqdadiya', 'Balad Ruz'],
  Duhok: ['Duhok', 'Zakho', 'Amedi', 'Sumel', 'Akre'],
  Erbil: ['Erbil', 'Soran', 'Shaqlawa', 'Koy Sanjaq'],
  Karbala: ['Karbala', 'Ain al-Tamur', 'Al-Hindiya'],
  Kirkuk: ['Kirkuk', 'Daquq', 'Hawija', 'Dibis'],
  Maysan: ['Amarah', 'Kumait', 'Ali Al Gharbi', 'Maimona'],
  'Al Muthanna': ['Samawah', 'Rumaitha', 'Khidhir'],
  Najaf: ['Najaf', 'Kufa', 'Manathira'],
  Nineveh: ['Mosul', 'Tal Afar', 'Sinjar', 'Hamdaniya', 'Shekhan'],
  'Al-Qadisiyyah': ['Diwaniyah', 'Afak', 'Al-Shamiya', 'Hamza'],
  'Salah ad-Din': ['Tikrit', 'Samarra', 'Baiji', 'Shirqat', 'Tuz Khurmatu'],
  Sulaymaniyah: ['Sulaymaniyah', 'Chamchamal', 'Kalar', 'Darbandikhan', 'Penjwen'],
  Wasit: ['Kut', 'Al-Hai', 'Al-Suwaira', 'Numaniyah'],
  Halabja: ['Halabja', 'Khurmal', 'Byara', 'Tawella'],
};

async function pingServer(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/governorates`, { headers });
      if (res.ok) return true;
    } catch (e) { }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function getGovernorates() {
  const res = await fetch(`${BASE_URL}/governorates`, { headers });
  if (!res.ok) return [];
  let json;
  try { json = await res.json(); } catch { return []; }
  const data = json && json.data;
  return Array.isArray(data) ? data : [];
}

async function getCities(governorateId) {
  const res = await fetch(`${BASE_URL}/cities?governorateId=${encodeURIComponent(governorateId)}`, { headers });
  if (!res.ok) return [];
  let json;
  try { json = await res.json(); } catch { return []; }
  const data = json && json.data;
  return Array.isArray(data) ? data : [];
}

async function createGovernorate(name) {
  const res = await fetch(`${BASE_URL}/governorates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Failed to create governorate ${name}: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function createCity(name, governorateId) {
  const res = await fetch(`${BASE_URL}/cities`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, governorateId }),
  });
  if (!res.ok) throw new Error(`Failed to create city ${name}: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function ensureGovernorateByName(name) {
  const list = await getGovernorates();
  const existing = list.find((g) => (g.name || '').toLowerCase() === name.toLowerCase());
  if (existing) return existing;
  return await createGovernorate(name);
}

async function ensureCityByName(name, governorateId) {
  const list = await getCities(governorateId);
  const existing = list.find((c) => (c.name || '').toLowerCase() === name.toLowerCase());
  if (existing) return existing;
  return await createCity(name, governorateId);
}

async function run() {
  const ready = await pingServer();
  if (!ready) {
    console.error(`API not reachable at ${BASE_URL}. Start the server first.`);
    process.exit(1);
  }

  const summary = [];
  for (const [govName, cities] of Object.entries(governorates)) {
    try {
      const gov = await ensureGovernorateByName(govName);
      const govId = gov.id;
      const createdCities = [];
      for (const cityName of cities) {
        const city = await ensureCityByName(cityName, govId);
        createdCities.push(city.name);
      }
      summary.push({ governorate: gov.name, cities: createdCities });
      console.log(`Seeded ${gov.name}: ${createdCities.join(', ')}`);
    } catch (err) {
      console.error(`Error seeding ${govName}:`, err.message);
    }
  }

  console.log('Seeding complete.');
  console.table(summary.map((s) => ({ Governorate: s.governorate, Cities: s.cities.length })));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
