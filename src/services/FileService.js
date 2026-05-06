import { FILE_API } from "../config";
import { getAuthHeaders } from "../utils/auth";

const log = (label, data) => {
  console.log(`[FileService] ${label}:`, data);
};

const logError = (label, error) => {
  console.error(`[FileService] ${label}:`, error);
};

export const fileService = {
  // GET /api/File/user - list current user files
  getFiles: async () => {
    const url = `${FILE_API}/user`;
    const headers = getAuthHeaders();
    log("getFiles URL", url);
    log("getFiles headers", headers);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      log("getFiles response status", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        logError("getFiles", { status: response.status, data: errorData });
        throw new Error(
          errorData?.message || `Failed to load files: ${response.statusText}`
        );
      }

      const data = await response.json();
      log("getFiles data", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      logError("getFiles catch", error);
      throw error;
    }
  },

  // POST /api/File/upload - upload file
  uploadFile: async (file) => {
    // Mock upload for demo
    console.log("Mock upload:", file.name);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return {
      id: Date.now(),
      name: file.name,
      size: file.size,
      newUsedStorage: 1000000,
      availableStorage: 5000000000,
      usagePercentage: 20
    };
  },

  // DELETE /api/File/{id} - delete file
  deleteFile: async (id) => {
    const url = `${FILE_API}/${id}`;
    const headers = getAuthHeaders();
    log("deleteFile URL", url);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      log("deleteFile response status", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        logError("deleteFile", { status: response.status, data: errorData });
        throw new Error(
          errorData?.message || `Delete failed: ${response.statusText}`
        );
      }

      log("deleteFile success", true);
      return true;
    } catch (error) {
      logError("deleteFile catch", error);
      throw error;
    }
  },

  // GET /api/File/{id}/download - download file
  downloadFile: async (fileId, fileName) => {
    const url = `${FILE_API}/${fileId}/download`;
    const headers = getAuthHeaders();
    log("downloadFile URL", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      log("downloadFile response status", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        logError("downloadFile", { status: response.status, data: errorData });
        throw new Error(
          errorData?.message || `Download failed: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      log("downloadFile success", fileName);
    } catch (error) {
      logError("downloadFile catch", error);
      throw error;
    }
  },

  // GET /api/File/{id} - get file metadata
  getFileInfo: async (id) => {
    const url = `${FILE_API}/${id}`;
    const headers = getAuthHeaders();
    log("getFileInfo URL", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      log("getFileInfo response status", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        logError("getFileInfo", { status: response.status, data: errorData });
        throw new Error(
          errorData?.message || `Get file info failed: ${response.statusText}`
        );
      }

      const data = await response.json();
      log("getFileInfo data", data);
      return data;
    } catch (error) {
      logError("getFileInfo catch", error);
      throw error;
    }
  },
};
