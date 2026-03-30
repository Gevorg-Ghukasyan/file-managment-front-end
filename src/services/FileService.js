let mockFiles = [
  { id: 1, name: "photo.png", size: 120 },
  { id: 2, name: "doc.pdf", size: 300 },
  { id: 3, name: "music.mp3", size: 5000 },
];

export const fileService = {
  getFiles: async () => {
    return new Promise((res) => setTimeout(() => res(mockFiles), 300));
  },

  deleteFile: async (id) => {
    mockFiles = mockFiles.filter((f) => f.id !== id);
    return true;
  },

  downloadFile: async (file) => {
    alert("Downloading " + file.name);
  },
};