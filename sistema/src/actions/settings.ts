"use server";

import fs from "fs/promises";
import path from "path";

export interface Settings {
  emailTime: string; // HH:mm format
}

const defaultSettings: Settings = {
  emailTime: "18:00",
};

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

async function ensureSettingsFile() {
  try {
    await fs.mkdir(path.dirname(settingsFilePath), { recursive: true });
    await fs.access(settingsFilePath);
  } catch {
    await fs.writeFile(settingsFilePath, JSON.stringify(defaultSettings, null, 2), "utf-8");
  }
}

export async function getSettings(): Promise<Settings> {
  await ensureSettingsFile();
  try {
    const data = await fs.readFile(settingsFilePath, "utf-8");
    return JSON.parse(data || JSON.stringify(defaultSettings));
  } catch {
    return defaultSettings;
  }
}

export async function updateSettings(settings: Partial<Settings>) {
  const current = await getSettings();
  const newSettings = { ...current, ...settings };
  await fs.writeFile(settingsFilePath, JSON.stringify(newSettings, null, 2), "utf-8");
  return newSettings;
}
