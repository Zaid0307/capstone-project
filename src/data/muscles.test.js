import { MUSCLES, LEGACY_MUSCLE_IDS, resolveMuscleId } from './muscles';
import { MUSCLE_GROUP_NAMES } from './muscleGroups';

// The 39 IDs of the earlier muscle model; stored data may still contain them.
const OLD_IDS = [
  'pectoralis_major', 'pectoralis_minor', 'serratus_anterior',
  'deltoid_anterior', 'deltoid_lateral', 'deltoid_posterior',
  'supraspinatus', 'infraspinatus', 'teres_minor', 'subscapularis',
  'biceps_brachii', 'brachialis', 'triceps_brachii', 'forearm_flexors', 'forearm_extensors',
  'trapezius', 'latissimus_dorsi', 'rhomboids', 'teres_major', 'erector_spinae',
  'rectus_abdominis', 'external_oblique', 'internal_oblique', 'transversus_abdominis',
  'gluteus_maximus', 'gluteus_medius', 'gluteus_minimus', 'iliopsoas',
  'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
  'biceps_femoris', 'semitendinosus', 'semimembranosus', 'adductors',
  'gastrocnemius', 'soleus', 'tibialis_anterior',
];

const VIEWS = ['front', 'back', 'both', 'deep'];

describe('muscle model', () => {
  it.each(Object.entries(MUSCLES))('%s has names, a valid group and view', (id, muscle) => {
    expect(id).toMatch(/^[a-z][a-z_]*$/);
    expect(MUSCLE_GROUP_NAMES).toContain(muscle.group);
    expect(VIEWS).toContain(muscle.view);
    for (const field of ['de', 'en', 'latin']) {
      expect(muscle[field].trim(), field).not.toBe('');
    }
    expect(muscle.latin).toMatch(/^(Musculus|Musculi|Pars|Caput) /);
  });

  it('only refers to existing parents, in the same group, without cycles', () => {
    for (const [id, muscle] of Object.entries(MUSCLES)) {
      if (!muscle.parent) continue;
      expect(MUSCLES, id).toHaveProperty(muscle.parent);
      expect(MUSCLES[muscle.parent].group, id).toBe(muscle.group);
      const chain = new Set([id]);
      for (let current = muscle.parent; current; current = MUSCLES[current].parent) {
        expect(chain.has(current), `${id}: cycle at ${current}`).toBe(false);
        chain.add(current);
      }
    }
  });

  it('gives every whole muscle at least two parts', () => {
    const children = {};
    for (const muscle of Object.values(MUSCLES)) {
      if (muscle.parent) children[muscle.parent] = (children[muscle.parent] ?? 0) + 1;
    }
    for (const count of Object.values(children)) expect(count).toBeGreaterThanOrEqual(2);
  });

  it('uses unique names', () => {
    for (const field of ['de', 'en', 'latin']) {
      const names = Object.values(MUSCLES).map(muscle => muscle[field]);
      expect(new Set(names).size, field).toBe(names.length);
    }
  });

  it('resolves every old muscle ID to current finest muscles', () => {
    for (const id of OLD_IDS) {
      const resolved = resolveMuscleId(id);
      expect(resolved.length, id).toBeGreaterThan(0);
      for (const leaf of resolved) {
        expect(MUSCLES, `${id}: ${leaf}`).toHaveProperty(leaf);
        expect(Object.values(MUSCLES).some(muscle => muscle.parent === leaf), leaf).toBe(false);
      }
    }
  });

  it('only keeps legacy mappings for IDs that are no longer entries', () => {
    for (const [id, targets] of Object.entries(LEGACY_MUSCLE_IDS)) {
      expect(MUSCLES, id).not.toHaveProperty(id);
      for (const target of targets) expect(MUSCLES, `${id}: ${target}`).toHaveProperty(target);
    }
  });

  it('resolves wholes to their parts and leaves to themselves', () => {
    expect(resolveMuscleId('biceps_brachii').sort()).toEqual(['biceps_brachii_long', 'biceps_brachii_short']);
    expect(resolveMuscleId('triceps_surae').sort()).toEqual(
      ['gastrocnemius_lateral', 'gastrocnemius_medial', 'soleus']
    );
    expect(resolveMuscleId('rhomboids')).toEqual(['rhomboid_major', 'rhomboid_minor']);
    expect(resolveMuscleId('rectus_abdominis')).toEqual(['rectus_abdominis']);
    expect(resolveMuscleId('unknown_muscle')).toEqual([]);
  });
});
