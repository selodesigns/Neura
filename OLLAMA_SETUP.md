# Using Neura with Ollama (Local LLMs)

Neura supports running completely locally using Ollama for AI features, eliminating the need for OpenAI API keys and cloud dependencies.

## What is Ollama?

[Ollama](https://ollama.ai) allows you to run large language models locally on your machine. It supports various models including Llama 2, Mistral, CodeLlama, and more.

## Benefits of Using Ollama

✅ **Privacy** - All AI processing happens locally  
✅ **No API Costs** - No OpenAI subscription needed  
✅ **Offline Capable** - Works without internet  
✅ **Full Control** - Choose your model and parameters  
✅ **Open Source** - Free and transparent  

## Prerequisites

- At least 8GB RAM (16GB+ recommended)
- ~4GB disk space per model
- macOS, Linux, or Windows (WSL2)

## Installation

### 1. Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [https://ollama.ai/download](https://ollama.ai/download)

### 2. Start Ollama Service

```bash
ollama serve
```

This starts Ollama on `http://localhost:11434` (default port).

### 3. Download a Model

Choose a model based on your hardware:

**For 8GB RAM:**
```bash
ollama pull llama2:7b
# or
ollama pull mistral:7b
```

**For 16GB+ RAM:**
```bash
ollama pull llama2:13b
# or
ollama pull mixtral:8x7b
```

**For powerful machines (32GB+ RAM):**
```bash
ollama pull llama2:70b
```

**List available models:**
```bash
ollama list
```

## Configuring Neura for Ollama

### 1. Update Environment Variables

Edit your `.env` file:

```env
# Set LLM provider to ollama
LLM_PROVIDER=ollama

# Ollama configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Comment out or remove OpenAI settings (not needed)
# OPENAI_API_KEY=...
# OPENAI_MODEL=...
```

### 2. Restart Neura

```bash
npm run dev
```

The server will now use Ollama for all AI features!

## Verifying Setup

### Check Health Endpoint

```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "llm": {
    "provider": "ollama",
    "model": "llama2",
    "available": true
  }
}
```

### Test AI Research

1. Log in to Neura
2. Create a new document
3. Click "Show AI Research"
4. Enter a query like "What is machine learning?"
5. Select perspectives and click "Research"

You should see responses generated locally by Ollama!

## Recommended Models

### General Purpose

| Model | Size | RAM Required | Best For |
|-------|------|--------------|----------|
| `llama2:7b` | 3.8GB | 8GB | Balanced performance |
| `mistral:7b` | 4.1GB | 8GB | Fast and accurate |
| `llama2:13b` | 7.3GB | 16GB | Better quality |
| `mixtral:8x7b` | 26GB | 32GB | Highest quality |

### Specialized Models

- `codellama:7b` - For code generation
- `llama2-uncensored:7b` - Fewer restrictions
- `neural-chat:7b` - Optimized for conversations

### View All Models

Browse available models: [https://ollama.ai/library](https://ollama.ai/library)

## Model Selection Guide

Choose your model based on:

### Hardware Constraints
```
8GB RAM   → llama2:7b or mistral:7b
16GB RAM  → llama2:13b or mixtral:8x7b (quantized)
32GB+ RAM → llama2:70b or mixtral:8x7b
```

### Use Case
```
Quick responses → mistral:7b
Best quality    → llama2:70b or mixtral:8x7b
Code-focused    → codellama:7b
Balanced        → llama2:13b
```

## Performance Optimization

### 1. Use GPU Acceleration

Ollama automatically uses GPU if available (NVIDIA CUDA or Apple Metal).

**Check GPU usage:**
```bash
nvidia-smi  # For NVIDIA GPUs
```

### 2. Adjust Context Window

For longer documents, increase context:

```bash
# Set when pulling model
ollama pull llama2 --context-length 4096
```

### 3. Model Quantization

Use quantized models for faster inference:
- `llama2:7b-q4_0` - 4-bit quantization (faster, less RAM)
- `llama2:7b-q8_0` - 8-bit quantization (balanced)

### 4. Keep Models Loaded

To keep a model in memory:
```bash
ollama run llama2
# Keep terminal open
```

## Switching Between OpenAI and Ollama

You can easily switch between providers:

**Use Ollama (local):**
```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama2
```

**Use OpenAI (cloud):**
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
```

Just restart the server after changing.

## Troubleshooting

### "Cannot connect to Ollama"

**Check if Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

**Start Ollama:**
```bash
ollama serve
```

### "Model not found"

**List installed models:**
```bash
ollama list
```

**Pull the model:**
```bash
ollama pull llama2
```

### Slow Performance

1. **Use a smaller model** - Try `mistral:7b` instead of `llama2:13b`
2. **Close other applications** - Free up RAM
3. **Use quantized models** - Add `-q4_0` suffix
4. **Enable GPU** - Ensure GPU drivers are installed

### High RAM Usage

```bash
# Check Ollama memory usage
docker stats ollama  # If running in Docker

# Reduce context window in .env (future feature)
OLLAMA_CONTEXT_LENGTH=2048
```

### Model Quality Issues

If responses are poor quality:
1. Try a larger model (`llama2:13b` instead of `7b`)
2. Use `mistral` instead of `llama2` for specific tasks
3. Adjust temperature in code (lower = more focused)
4. Try specialized models for your use case

## Docker Support

Run Ollama in Docker:

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Pull model in Docker:
```bash
docker exec -it ollama ollama pull llama2
```

Update Neura's `.env`:
```env
OLLAMA_BASE_URL=http://localhost:11434
```

## Advanced Configuration

### Custom Ollama Port

If Ollama runs on a different port:

```env
OLLAMA_BASE_URL=http://localhost:8080
```

### Remote Ollama Server

Use Ollama on another machine:

```env
OLLAMA_BASE_URL=http://192.168.1.100:11434
```

### Multiple Models

Switch models without restarting:
```env
OLLAMA_MODEL=mistral
```

## Performance Comparison

### Response Time (approximate)

| Model | Hardware | Tokens/sec |
|-------|----------|------------|
| llama2:7b | 16GB RAM, M1 | 30-40 |
| llama2:7b | 16GB RAM, RTX 3060 | 50-70 |
| mistral:7b | 16GB RAM, M2 | 40-50 |
| llama2:13b | 32GB RAM, RTX 4090 | 60-80 |

### Quality vs Speed Trade-offs

```
Fastest  → mistral:7b-q4_0
Balanced → llama2:7b or mistral:7b
Best     → llama2:70b or mixtral:8x7b
```

## Best Practices

1. **Start with mistral:7b** - Good balance of speed and quality
2. **Keep Ollama running** - Faster response times
3. **Monitor RAM** - Don't exceed available memory
4. **Use GPU** - 5-10x faster than CPU
5. **Update regularly** - `ollama pull <model>` to get latest versions

## Comparison: OpenAI vs Ollama

| Feature | OpenAI | Ollama |
|---------|--------|--------|
| Cost | $$ per token | Free (hardware cost) |
| Privacy | Cloud processing | Local only |
| Internet | Required | Optional |
| Speed | Fast | Depends on hardware |
| Quality | Excellent (GPT-4) | Good-Excellent |
| Setup | Easy (API key) | Moderate (install) |
| Models | Fixed options | Many choices |

## Resources

- **Ollama Website:** https://ollama.ai
- **Model Library:** https://ollama.ai/library
- **GitHub:** https://github.com/ollama/ollama
- **Discord Community:** https://discord.gg/ollama
- **Model Cards:** Detailed info for each model

## FAQ

**Q: Can I use both OpenAI and Ollama?**  
A: Yes! Switch by changing `LLM_PROVIDER` in `.env` and restarting.

**Q: Which model is closest to GPT-4?**  
A: `mixtral:8x7b` or `llama2:70b` offer similar quality but require powerful hardware.

**Q: Will Ollama work on my Mac?**  
A: Yes! Ollama supports Apple Silicon (M1/M2/M3) with Metal acceleration.

**Q: Can I fine-tune models?**  
A: Yes, Ollama supports custom models. See: https://ollama.ai/docs/modelfile

**Q: How much does Ollama cost?**  
A: Ollama is free and open source. You only pay for the hardware.

---

**Need help?**  
- Discord: https://discord.gg/selodev
- Website: https://selodev.com

**Created by [SELODev](https://selodev.com)**  
GitHub: https://github.com/selodesigns
