import type { Dataset } from "@/lib/types"

export const SAMPLE_DATASETS: Dataset[] = [
  {
    id: "d-1",
    blobId: "walrus-0xabc111",
    name: "delhi-air-quality-2022.csv",
    sizeMB: 24,
    owner: "0x12aF...eD1",
    tags: ["delhi", "air", "quality", "csv"],
    description: "PM2.5 daily measurements across Delhi in 2022.",
  },
  {
    id: "d-2",
    blobId: "walrus-0xabc222",
    name: "india-population-districts.parquet",
    sizeMB: 88,
    owner: "0x98bB...aa2",
    tags: ["india", "population", "census", "parquet"],
    description: "District-level population and density stats.",
  },
  {
    id: "d-3",
    blobId: "walrus-0xabc333",
    name: "delhi-traffic-jan2025.json",
    sizeMB: 12,
    owner: "0x43fC...991",
    tags: ["delhi", "traffic", "mobility", "json"],
    description: "Aggregated road congestion and speed by hour.",
  },
  {
    id: "d-4",
    blobId: "walrus-0xabc444",
    name: "weather-ncr-2024.csv",
    sizeMB: 57,
    owner: "0xB0b0...007",
    tags: ["ncr", "weather", "delhi", "csv"],
    description: "Temperature and precipitation across NCR.",
  },
]
