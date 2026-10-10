import { ABILITY_BY_ID, BRAND_BY_ID, BRANDS } from './data.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

function complementaryPair(a, b) {
  return (
    a[0] * b[3] + a[3] * b[0] +
    a[1] * b[5] + a[5] * b[1] +
    a[2] * b[4] + a[4] * b[2]
  ) / 3;
}

function readCells(cells) {
  const normalized = cells.map((cell) => {
    const abilityId = cell?.sticker?.abilityId ?? cell?.abilityId;
    return abilityId ? ABILITY_BY_ID[abilityId] : null;
  });
  const abilities = normalized.filter(Boolean);
  const traits = Array.from({ length: 6 }, (_, traitIndex) => average(abilities.map((ability) => ability.traits[traitIndex])));
  let pairTotal = 0;
  let pairCount = 0;
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const index = row * 3 + col;
      for (const neighborIndex of [col < 2 ? index + 1 : -1, row < 2 ? index + 3 : -1]) {
        if (neighborIndex < 0 || !normalized[index] || !normalized[neighborIndex]) continue;
        pairTotal += complementaryPair(normalized[index].traits, normalized[neighborIndex].traits);
        pairCount += 1;
      }
    }
  }
  const families = new Set(abilities.map((ability) => ability.brandId)).size;
  return {
    abilities: normalized,
    traits,
    synergy: clamp(pairCount ? pairTotal / pairCount : 0),
    purity: abilities.length ? 1 - (families - 1) / 5 : 0,
  };
}

export function analyzeComposition(brandOrId, cells) {
  const brand = typeof brandOrId === 'string' ? BRAND_BY_ID[brandOrId] : brandOrId;
  if (!brand) throw new RangeError(`Unknown world brand: ${brandOrId}`);
  const { abilities, traits, synergy, purity } = readCells(cells);
  const weighted = brand.weights.reduce((sum, weight, index) => sum + weight * traits[index], 0);
  const [reasoning, perception, execution, memory, connection, adaptation] = traits;
  let signature;

  switch (brand.mechanism) {
    case 'relay':
      signature = clamp(0.18 + connection * 0.34 + execution * 0.22 + reasoning * 0.12 + synergy * 0.24);
      break;
    case 'weave':
      signature = clamp(0.15 + memory * 0.27 + connection * 0.20 + reasoning * 0.16 + synergy * 0.16 + purity * 0.06);
      break;
    case 'observatory':
      signature = clamp(0.12 + perception * 0.40 + connection * 0.21 + synergy * 0.22 + adaptation * 0.05);
      break;
    case 'stream':
      signature = clamp(0.14 + reasoning * 0.30 + execution * 0.21 + adaptation * 0.15 + synergy * 0.20);
      break;
    case 'market':
      signature = clamp(0.12 + adaptation * 0.39 + connection * 0.25 + execution * 0.12 + synergy * 0.12);
      break;
    case 'workshop':
      signature = clamp(0.14 + execution * 0.27 + memory * 0.22 + reasoning * 0.18 + connection * 0.08 + synergy * 0.11);
      break;
    default:
      throw new RangeError(`Unknown world mechanism: ${brand.mechanism}`);
  }

  return {
    brandId: brand.id,
    mechanism: brand.mechanism,
    abilities,
    traits,
    synergy,
    purity,
    capacity: clamp(weighted),
    activity: clamp(0.18 + weighted * 0.48 + synergy * 0.34, 0.18, 0.92),
    signature,
    scale: 0.86 + signature * 0.26,
    routePriority: clamp(connection * 0.53 + adaptation * 0.27 + synergy * 0.20),
    heights: abilities.map((ability, index) => {
      if (!ability) return 0.055;
      const local = (ability.traits[0] * 0.12 + ability.traits[1] * 0.08 + ability.traits[2] * 0.20 + ability.traits[3] * 0.11 + ability.traits[4] * 0.20 + ability.traits[5] * 0.12);
      return 0.045 + clamp(local + (index % 3) * 0.035) * 0.13;
    }),
  };
}

export function neighborFit(sourceProfile, candidateProfile, direction = 0) {
  if (!sourceProfile || !candidateProfile) return 0;
  const [sourceReason, sourceSense, sourceAct, sourceMemory, sourceConnect, sourceAdapt] = sourceProfile.traits;
  const [reason, sense, act, memory, connect, adapt] = candidateProfile.traits;
  const complementary = (sourceAct * connect + sourceConnect * act + sourceMemory * reason + sourceReason * memory + sourceSense * adapt + sourceAdapt * sense) / 3;
  const fit = candidateProfile.routePriority * 0.56 + complementary * 0.34 + candidateProfile.signature * 0.10;
  return fit + (direction === 0 ? 0.0001 : 0);
}

export function describeFacePopulation(cells) {
  const counts = Object.fromEntries(BRANDS.map((brand) => [brand.id, 0]));
  for (const cell of cells) {
    const abilityId = cell?.sticker?.abilityId ?? cell?.abilityId;
    const ability = abilityId ? ABILITY_BY_ID[abilityId] : null;
    if (ability) counts[ability.brandId] += 1;
  }
  return counts;
}
