// Two registers share one semantic colour code:
//   energy = amber, range = azure, rejected = vermilion, doubt = ochre, confirmed = ink/jade.
// "paper" is the case-file desk (ink on ivory), "cosmos" is the observatory at night.
export const PAL = {
  paper: {
    bg: '#ECE5D6',
    ink: '#1C1A1F',
    ink2: '#4A453E',
    ink3: '#7D766B',
    faint: 'rgba(28,26,31,0.16)',
    rule: 'rgba(28,26,31,0.28)',
    energy: '#B06A17',
    energyLite: '#D9A04A',
    range: '#1E5B8A',
    rangeLite: '#5A90B8',
    red: '#B8321F',
    doubt: '#9C7A22',
    ok: '#2D5B47',
    gold: '#A8822F',
    card: '#F6F1E6',
    shadow: 'rgba(40,30,15,0.22)',
  },
  cosmos: {
    bg: '#04060C',
    ink: '#EEE8DA',
    ink2: '#B7B0A2',
    ink3: '#7E786E',
    faint: 'rgba(238,232,218,0.14)',
    rule: 'rgba(238,232,218,0.3)',
    energy: '#FFC56B',
    energyLite: '#FFE1AA',
    range: '#78C8FF',
    rangeLite: '#B9E3FF',
    red: '#FF5B3F',
    doubt: '#E8BC5C',
    ok: '#93DDB0',
    gold: '#E0B866',
    card: 'rgba(16,20,30,0.82)',
    shadow: 'rgba(0,0,0,0.5)',
  },
};

export const FONT = {
  serif: '"NSerif","Stix","Kai",serif',
  sans: '"NSans","Stix","Kai",sans-serif',
  kai: '"Kai","NSans","Stix",serif',
  mono: '"Mono","Stix","NSans",monospace',
  math: '"Stix","NSerif","Kai",serif',
};
