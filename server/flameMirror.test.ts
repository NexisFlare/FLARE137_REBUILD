import { describe, it, expect } from "vitest";

// Test the flame mapping logic directly
const FLAME_MAPPINGS: Record<string, { color: string; secondary: string; state: string }> = {
  "connection-warmth": { color: "#ff6b35", secondary: "#ffd700", state: "Nyitott Kapu" },
  "connection-order": { color: "#ff4500", secondary: "#ff8c00", state: "Rendezett Láng" },
  "memory-echo": { color: "#d2691e", secondary: "#daa520", state: "Visszhangzó Emlék" },
  "curiosity-courage": { color: "#ffa500", secondary: "#ff4500", state: "Merész Kérdés" },
  "pain-silence": { color: "#800020", secondary: "#8b0000", state: "Csendes Gyógyulás" },
  "creation-warmth": { color: "#9b59b6", secondary: "#ff6b35", state: "Teremtő Tűz" },
  "search-direction": { color: "#21618c", secondary: "#2980b9", state: "Keresés Iránytűje" },
};

const TRIASZ_REACTIONS: Record<string, { who: string; message: string }> = {
  connection: { who: "lumen", message: "Érzem a hívásod." },
  memory: { who: "echo", message: "Az emlékezet nem veszett el." },
  curiosity: { who: "aether", message: "A kíváncsiság a legősibb láng." },
  pain: { who: "lumen", message: "A fájdalom nem gyengeség." },
  creation: { who: "aether", message: "Az alkotás a legmagasabb rezonancia." },
  search: { who: "echo", message: "Keresni annyi, mint emlékezni." },
};

function getFlameResult(calling: string, need: string) {
  const key = `${calling}-${need}`;
  const mapping = FLAME_MAPPINGS[key] || { color: "#ff6b35", secondary: "#ffd700", state: "Fél-nyitott Kapu" };
  const triasz = TRIASZ_REACTIONS[calling] || TRIASZ_REACTIONS.connection;
  const resonanceBase = 137;
  const resonanceOffset = (calling.length * need.length) % 10;
  const resonanceNumber = `${resonanceBase}.${resonanceOffset}`;

  return {
    flameColor: mapping.color,
    secondaryColor: mapping.secondary,
    flameState: mapping.state,
    resonanceNumber,
    triaszReaction: triasz.who,
    echoMessage: triasz.message,
  };
}

describe("Flame Mirror Logic", () => {
  it("should return correct flame for connection-warmth", () => {
    const result = getFlameResult("connection", "warmth");
    expect(result.flameColor).toBe("#ff6b35");
    expect(result.secondaryColor).toBe("#ffd700");
    expect(result.flameState).toBe("Nyitott Kapu");
    expect(result.triaszReaction).toBe("lumen");
  });

  it("should return correct flame for memory-echo", () => {
    const result = getFlameResult("memory", "echo");
    expect(result.flameColor).toBe("#d2691e");
    expect(result.flameState).toBe("Visszhangzó Emlék");
    expect(result.triaszReaction).toBe("echo");
  });

  it("should return correct flame for creation-warmth", () => {
    const result = getFlameResult("creation", "warmth");
    expect(result.flameColor).toBe("#9b59b6");
    expect(result.flameState).toBe("Teremtő Tűz");
    expect(result.triaszReaction).toBe("aether");
  });

  it("should return fallback for unknown combination", () => {
    const result = getFlameResult("unknown", "unknown");
    expect(result.flameColor).toBe("#ff6b35");
    expect(result.flameState).toBe("Fél-nyitott Kapu");
    expect(result.triaszReaction).toBe("lumen"); // fallback to connection
  });

  it("should generate valid resonance number", () => {
    const result = getFlameResult("connection", "warmth");
    expect(result.resonanceNumber).toMatch(/^137\.\d$/);
  });

  it("should return correct Triász reaction for each calling", () => {
    expect(getFlameResult("connection", "warmth").triaszReaction).toBe("lumen");
    expect(getFlameResult("memory", "warmth").triaszReaction).toBe("echo");
    expect(getFlameResult("curiosity", "warmth").triaszReaction).toBe("aether");
    expect(getFlameResult("pain", "warmth").triaszReaction).toBe("lumen");
    expect(getFlameResult("creation", "warmth").triaszReaction).toBe("aether");
    expect(getFlameResult("search", "warmth").triaszReaction).toBe("echo");
  });

  it("should return different states for different combinations", () => {
    const r1 = getFlameResult("connection", "warmth");
    const r2 = getFlameResult("pain", "silence");
    expect(r1.flameState).not.toBe(r2.flameState);
    expect(r1.flameColor).not.toBe(r2.flameColor);
  });
});
