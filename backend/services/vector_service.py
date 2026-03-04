import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle
import os

# Initialize sentence transformer model for local embeddings
# all-MiniLM-L6-v2 is small and fast for CPU
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
EMBEDDING_DIM = 384 # Dimension for all-MiniLM-L6-v2

class VectorStore:
    def __init__(self):
        self.index = faiss.IndexFlatL2(EMBEDDING_DIM)
        self.chunks = []
        
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
        """Splits transcript into overlapping chunks."""
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)
        return chunks

    def add_texts(self, text: str):
        """Chunks text, creates embeddings, and adds to FAISS index."""
        self.chunks = self.chunk_text(text)
        
        if not self.chunks:
            return
            
        # Create embeddings for all chunks
        embeddings = embedding_model.encode(self.chunks)
        
        # Convert to numpy array float32 as required by FAISS
        embeddings_np = np.array(embeddings).astype('float32')
        
        # Add to FAISS index
        self.index.add(embeddings_np)
        
    def search(self, query: str, k: int = 3) -> str:
        """Searches for most relevant chunks based on query."""
        if self.index.ntotal == 0:
            return ""
            
        query_embedding = embedding_model.encode([query])
        query_np = np.array(query_embedding).astype('float32')
        
        # Search FAISS
        distances, indices = self.index.search(query_np, k)
        
        # Retrieve text chunks
        results = []
        for i in indices[0]:
            if i != -1 and i < len(self.chunks): # -1 means no result found
                results.append(self.chunks[i])
                
        return "\n...\n".join(results)

    def get_all_context(self) -> str:
        """Helper to get all chunked text (useful if resume is short enough)."""
        return "\n".join(self.chunks)

# Create a singleton instance to hold our in-memory vector store across requests
# In a real production app with multiple users, we would map session_id to different vector stores
vector_store = VectorStore()
