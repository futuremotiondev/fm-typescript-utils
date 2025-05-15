import { promises as fs } from "fs";
import { dirname, join } from 'path';
import * as path from 'path';

/**
 * Reads a file and returns its content as a string.
 */
export async function readFileContent(filePath: string, encoding: BufferEncoding = "utf-8"): Promise<string> {
    return fs.readFile(filePath, { encoding });
}

/**
 * Appends data to a file, creating the file if it does not exist.
 */
export async function appendToFile(filePath: string, data: string | Buffer, encoding: BufferEncoding = "utf-8"): Promise<void> {
    await fs.appendFile(filePath, data, { encoding });
}

/**
 * Deletes a file if it exists.
 */
export async function deleteFileIfExists(filePath: string): Promise<boolean> {
    try {
        await fs.unlink(filePath);
        return true; // File successfully deleted
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code !== 'ENOENT') {
            return false; // File did not exist
        }
        throw new Error(`Failed to delete file at ${filePath}: ${err.message}`);
    }
}

/**
 * Checks if a file or directory exists.
 * @param path - The path to check for existence.
 * @returns A promise that resolves to true if the path exists, otherwise false.
 */
export async function pathExists(path: string): Promise<boolean> {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            console.error(`Error checking path existence: ${(error as Error).message}`);
        }
        return false;
    }
}

/**
 * Creates a directory and any necessary subdirectories.
 * @param dirPath - The path of the directory to create.
 * @returns A promise that resolves to the final directory path if successful, or throws an error for failures.
 */
export async function createDirectory(dirPath: string): Promise<boolean> {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        return true; // Return true on success
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        throw new Error(`Failed to create directory at ${dirPath}: ${err.message}`);
    }
}

/**
 * Lists all files in a directory.
 * @param dirPath - The path of the directory to list files from.
 * @returns A promise that resolves to an array of file names.
 */
export async function listFileNames(dirPath: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        return entries.filter(entry => entry.isFile()).map(file => file.name);
    } catch (error) {
        console.error(`Error reading directory '${dirPath}': ${(error as Error).message}`);
        return [];
    }
}

/**
 * Lists all directories in a directory.
 * @param dirPath - The path of the directory to list directories from.
 * @returns A promise that resolves to an array of directory names.
 */
export async function listDirectoryNames(dirPath: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        return entries.filter(entry => entry.isDirectory()).map(directory => directory.name);
    } catch (error) {
        console.error(`Error reading directory '${dirPath}': ${(error as Error).message}`);
        return [];
    }
}

/**
 * Lists all files and directories in a directory.
 * @param dirPath - The path of the directory to list files and directories from.
 * @returns A promise that resolves to an array of file and directory names.
 */
export async function listFileAndDirectoryNames(dirPath: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        return entries.map(entry => entry.name);
    } catch (error) {
        console.error(`Error reading directory '${dirPath}': ${(error as Error).message}`);
        return [];
    }
}

/**
 * Lists all files and directories in a directory with their full paths.
 * @param dirPath - The path of the directory to list files and directories from.
 * @returns A promise that resolves to an array of file and directory full paths.
 */
export async function listFileAndDirectoryPaths(dirPath: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        return entries.map(entry => path.join(dirPath, entry.name));
    } catch (error) {
        console.error(`Error reading directory '${dirPath}': ${(error as Error).message}`);
        return [];
    }
}

/**
 * Copies a file from source to destination.
 * @param source - The path of the source file.
 * @param destination - The path where the file should be copied.
 * @returns A promise that resolves to true if the file was copied successfully, or false if there was an error.
 */
export async function copyFile(source: string, destination: string): Promise<boolean> {
    try {
        await fs.copyFile(source, destination);
        return true; // Return true on successful copy
    } catch (error) {
        console.error(`Failed to copy file from ${source} to ${destination}: ${(error as Error).message}`);
        return false; // Return false on failure
    }
}

/**
 * Moves a file from source to destination.
 * @param source - The path of the source file.
 * @param destination - The path where the file should be moved.
 * @returns A promise that resolves to true if the file was moved successfully, or false if there was an error.
 */
export async function moveFile(source: string, destination: string): Promise<boolean> {
    try {
        await fs.rename(source, destination);
        return true; // Return true on successful move
    } catch (error) {
        console.error(`Failed to move file from ${source} to ${destination}: ${(error as Error).message}`);
        return false; // Return false on failure
    }
}

/**
 * Ensures that a directory exists at the specified path.
 * If the directory does not exist, it will be created recursively.
 *
 * @param {string} dirPath - The path of the directory to ensure exists.
 * @param {(success: boolean) => void} [callback] - Optional callback function executed after ensuring the directory.
 *                                                  Receives a boolean indicating success or failure.
 * @returns {Promise<boolean>} - A promise that resolves to true if the directory exists or was created successfully,
 *                               and false if an error occurred.
 */
export async function ensureDirectoryExists(
    dirPath: string,
    callback?: (success: boolean) => void
): Promise<boolean> {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        if (callback) callback(true);
        return true; // Directory created successfully or already exists
    } catch (error) {
        console.error(`Failed to create directory at ${dirPath}:`, error);
        if (callback) callback(false);
        return false; // An error occurred during directory creation
    }
}

/**
 * Writes data to a file, creating the file if it does not exist.
 * Ensures the directory structure exists before writing.
 *
 * @param {string} filePath - The path of the file to write.
 * @param {string | Buffer} data - The data to write to the file.
 * @param {BufferEncoding} [encoding="utf-8"] - The encoding to use for writing the file.
 * @param {(error?: Error) => void} [callback] - Optional callback executed after attempting to write the file.
 *                                               Receives an error object if an error occurred, otherwise undefined.
 * @returns {Promise<void>} - A promise that resolves when the file has been written successfully.
 */
export async function writeContentToFile(
    filePath: string,
    data: string | Buffer,
    encoding: BufferEncoding = "utf-8",
    callback?: (error?: Error) => void
): Promise<void> {
    try {
        const dirPath = dirname(filePath);
        const dirExists = await ensureDirectoryExists(dirPath, (success) => {
            if (!success) {
                throw new Error(`Failed to ensure directory at ${dirPath}`);
            }
        });
        if (dirExists) {
            await fs.writeFile(filePath, data, { encoding });
            if (callback) callback();
        }
    } catch (error) {
        console.error(`Failed to write file at ${filePath}:`, error);
        if (callback) callback(error as Error);
    }
}

/**
 * Retrieves the size of a file in bytes.
 * @param filePath - The path of the file.
 * @returns A promise that resolves to the size of the file in bytes.
 */
export async function getFileSize(filePath: string): Promise<number> {
    try {
        const stats = await fs.stat(filePath);
        return stats.size;
    } catch (error) {
        console.error(`Failed to get file size for ${filePath}: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Reads a JSON file and parses its content into an object.
 * @param filePath - The path of the JSON file.
 * @returns A promise that resolves to the parsed object.
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const content = await fs.readFile(filePath, { encoding: 'utf-8' });
        return JSON.parse(content) as T;
    } catch (error) {
        console.error(`Failed to read JSON file at ${filePath}: ${(error as Error).message}`);
        throw error;
    }
}


/**
 * Recursively copies all contents from one directory to another.
 * @param sourceDir - The path of the source directory.
 * @param destinationDir - The path of the destination directory.
 * @returns A promise that resolves when the directory is copied successfully.
 */
export async function copyDirectory(sourceDir: string, destinationDir: string): Promise<void> {
    try {
        await ensureDirectoryExists(destinationDir);
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });
        for (const entry of entries) {
            const sourcePath = join(sourceDir, entry.name);
            const destinationPath = join(destinationDir, entry.name);
            if (entry.isDirectory()) {
                await copyDirectory(sourcePath, destinationPath);
            } else {
                await fs.copyFile(sourcePath, destinationPath);
            }
        }
    } catch (error) {
        console.error(`Failed to copy directory from ${sourceDir} to ${destinationDir}: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Recursively deletes a directory and all its contents.
 * @param dirPath - The path of the directory to delete.
 * @returns A promise that resolves when the directory is deleted successfully.
 */
export async function deleteDirectory(dirPath: string): Promise<void> {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
    } catch (error) {
        console.error(`Failed to delete directory at ${dirPath}: ${(error as Error).message}`);
        throw error;
    }
}

