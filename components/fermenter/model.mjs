// The numbers the fermenter figure shows. The build and the live page both read them.
export const MODEL = {
  totalL: 25,
  workingL: 18,
  boreMm: 280,
  rpm: 300,
  motorRpm: 3000,
  gearRatio: 10,
  impellerMm: 94,
  tempC: 37.0,
  pH: 7.0,
  doPct: 30,
  airVvm: 1,
  headBar: 0.5,
};

// tip speed of the turbines: pi * N * D, in m/s
export const tipSpeed = () => (Math.PI * (MODEL.rpm / 60) * MODEL.impellerMm) / 1000;

export const SAYS = {
  drive: `drive · ${MODEL.motorRpm.toLocaleString("en-US")} rpm ÷ ${MODEL.gearRatio} = ${MODEL.rpm} rpm`,
  head: `head plate · air in, exhaust out, 3 feeds`,
  agitator: `2 Rushton turbines · tip ${tipSpeed().toFixed(1)} m/s`,
  ph: `pH ${MODEL.pH.toFixed(2)} · held with acid and base`,
  dox: `dissolved O₂ ${MODEL.doPct} % · air and rpm hold it`,
  temp: `Pt100 · ${MODEL.tempC.toFixed(1)} °C · jacket water`,
  vessel: `${MODEL.boreMm} mm bore · ${MODEL.workingL} of ${MODEL.totalL} L`,
  controller: `3 PID loops · temp, pH, DO`,
};

export const APART_COUNT = 5;

export function readoutAt(selected, apart, moving) {
  if (selected && SAYS[selected]) return SAYS[selected];
  if (moving) return apart ? "taking apart" : "closing up";
  if (apart) return `apart · ${APART_COUNT} assemblies`;
  return `${MODEL.tempC.toFixed(1)} °C · pH ${MODEL.pH.toFixed(2)} · ${MODEL.rpm} rpm`;
}
