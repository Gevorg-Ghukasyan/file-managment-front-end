import { FILE_API } from "../config";
import { getAuthHeaders, getUserFromToken } from "../utils/auth";

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
    const url = `${FILE_API}/upload`;
    const headers = getAuthHeaders();
    log("uploadFile URL", url);

    const formData = new FormData();
    formData.append('File', file);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...headers,
        },
        body: formData,
      });

      log("uploadFile response status", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        logError("uploadFile", { status: response.status, data: errorData });
        throw new Error(
          errorData?.message || `Upload failed: ${response.statusText}`
        );
      }

      const data = await response.json();
      log("uploadFile data", data);
      return data; // FileUploadResponseDto with fileId, newUsedStorage, availableStorage, usagePercentage
    } catch (error) {
      logError("uploadFile catch", error);
      throw error;
    }
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

  // GET /api/file/quota or /api/File/storage/quota/{userId} - get user storage quota
  getQuota: async () => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };
    const userId = getUserFromToken()?.id;
    const urls = [`${FILE_API}/quota`];
    if (userId) {
      urls.push(`${FILE_API}/storage/quota/${userId}`);
    }

    let lastError = null;
    for (const url of urls) {
      log("getQuota URL", url);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        log("getQuota response status", response.status);

        if (response.ok) {
          const data = await response.json();
          log("getQuota data", data);
          return data;
        }

        if (response.status !== 404) {
          const errorData = await response.json().catch(() => null);
          logError("getQuota", { status: response.status, data: errorData });
          throw new Error(
            errorData?.message || `Failed to get quota: ${response.statusText}`
          );
        }

        lastError = response;
      } catch (error) {
        logError("getQuota catch", error);
        lastError = error;
      }
    }

    if (lastError) {
      if (lastError instanceof Response) {
        const errorData = await lastError.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to get quota: ${lastError.statusText}`);
      }
      throw lastError;
    }

    throw new Error("Unable to fetch quota");
  },
};
