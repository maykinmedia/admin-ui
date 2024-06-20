export function generateHexColor(index: number) {
  const hue = (index * 137) % 360; // Golden angle approximation for color diversity
  return hslToHex(hue, 100, 50); // Convert HSL to HEX
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // Convert to hex and pad with zeros
  };
  return `${f(0)}${f(8)}${f(4)}`;
}
