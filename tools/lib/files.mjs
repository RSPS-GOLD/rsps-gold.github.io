import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

export function comparePaths(left, right) {
  const natural = left.localeCompare(right, "en", {
    numeric: true,
    sensitivity: "base",
  });
  return natural || (left < right ? -1 : left > right ? 1 : 0);
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function contentHash(value, length = 12) {
  return sha256(value).slice(0, length);
}

export function normalizeGeneratedText(value) {
  return `${String(value).replace(/\r\n?/g, "\n").replace(/\s+$/u, "")}\n`;
}

export async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, normalizeGeneratedText(value), "utf8");
}

export function assertSafeOutputDirectory(rootDir, outputDir) {
  const root = path.resolve(rootDir);
  const output = path.resolve(outputDir);
  const volumeRoot = path.parse(output).root;
  const home = path.resolve(os.homedir());

  if (
    output === root ||
    output === volumeRoot ||
    output === home ||
    output.length <= volumeRoot.length + 2
  ) {
    throw new Error(`Refusing to clear unsafe output directory: ${output}`);
  }
  return output;
}

async function isRecognizedBuildDirectory(outputDir) {
  try {
    const entries = await fs.readdir(outputDir);
    if (entries.length === 0) return true;
    const manifest = JSON.parse(
      await fs.readFile(path.join(outputDir, "build-manifest.json"), "utf8"),
    );
    return manifest?.version === 1 && manifest.pages && typeof manifest.pages === "object";
  } catch {
    return false;
  }
}

export async function recreateDirectory(rootDir, outputDir) {
  const safeOutput = assertSafeOutputDirectory(rootDir, outputDir);
  const defaultOutput = path.join(path.resolve(rootDir), "dist");
  try {
    const stat = await fs.stat(safeOutput);
    if (!stat.isDirectory()) {
      throw new Error(`Refusing to replace a non-directory build target: ${safeOutput}`);
    }
    if (safeOutput !== defaultOutput && !(await isRecognizedBuildDirectory(safeOutput))) {
      throw new Error(
        `Refusing to clear a non-empty directory without an RSPS build manifest: ${safeOutput}`,
      );
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await fs.rm(safeOutput, { recursive: true, force: true });
  await fs.mkdir(safeOutput, { recursive: true });
  return safeOutput;
}

export async function copyTree(sourceDir, destinationDir) {
  const source = path.resolve(sourceDir);
  const destination = path.resolve(destinationDir);
  const entries = (await fs.readdir(source, { withFileTypes: true })).sort((a, b) =>
    comparePaths(a.name, b.name),
  );

  await fs.mkdir(destination, { recursive: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Symbolic links are not supported in static assets: ${sourcePath}`);
    }
    if (entry.isDirectory()) {
      await copyTree(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

export async function discoverFiles(rootDir) {
  const root = path.resolve(rootDir);
  const files = [];

  async function walk(directory) {
    const entries = (await fs.readdir(directory, { withFileTypes: true })).sort((a, b) =>
      comparePaths(a.name, b.name),
    );
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`Symbolic link found in generated output: ${absolute}`);
      }
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) files.push(toPosixPath(path.relative(root, absolute)));
    }
  }

  await walk(root);
  return files.sort(comparePaths);
}

export async function createFileHashMap(rootDir) {
  const map = {};
  for (const relative of await discoverFiles(rootDir)) {
    map[relative] = sha256(await fs.readFile(path.join(rootDir, relative)));
  }
  return map;
}
