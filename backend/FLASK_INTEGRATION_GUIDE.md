# Guia de Integração - Endpoint /despir com Stable Diffusion

## Visão Geral

Este guia mostra como integrar o endpoint `/despir` no seu app Flask existente que já roda Stable Diffusion para trocar roupas.

## Arquitetura

```
App Flask Existente
├── /trocar_roupa (já existe)
└── /despir (novo)
    ├── CLIPSeg (segmentação de roupas)
    ├── SD Inpainting (gerar nude)
    └── Restaurar checkpoint original
```

## Passo a Passo

### 1. Instalar Dependências

```bash
pip install -r requirements_flask.txt
```

### 2. Integrar no App Existente

Adicione ao seu `app.py`:

```python
# No topo do arquivo
from flask_undress import despir, generate_nude_mask, load_clipseg

# No startup (antes de app.run)
load_clipseg()  # Carregar CLIPSeg uma vez
```

### 3. Estrutura do Código

O endpoint `/despir` funciona assim:

```python
# 1. Recebe imagem
image = request.files['image']

# 2. Gera máscara de roupas com CLIPSeg
mask = generate_nude_mask(image_pil)

# 3. Troca checkpoint para modelo nude
shared.pipe.from_single_file("realvisxlNude_v20.safetensors")

# 4. Roda inpainting
result = shared.pipe(
    prompt="naked, bare skin...",
    image=image_pil,
    mask_image=mask,
    steps=30,
    cfg=7
)

# 5. Restaura checkpoint original
shared.pipe.from_single_file(checkpoint_original)

# 6. Retorna PNG
return send_file(result_png)
```

## Requisitos Técnicos

### Hardware
- **GPU**: NVIDIA com 8GB+ VRAM (recomendado: RTX 3060+)
- **RAM**: 16GB+ 
- **Storage**: ~10GB para modelos

### Modelos Necessários

1. **CLIPSeg** (auto-download)
   - `CIDAS/clipseg-rd64-refined`
   - ~350MB

2. **Checkpoint Nude** (manual)
   - `realvisxlNude_v20.safetensors`
   - Baixar de: Civitai ou HuggingFace
   - Colocar em: `models/checkpoints/`

### Variáveis Compartilhadas

O código assume estas variáveis globais:

```python
shared.pipe                 # StableDiffusionInpaintPipeline
shared.current_checkpoint   # Nome do checkpoint ativo
```

## Funcionamento Detalhado

### 1. CLIPSeg - Segmentação de Roupas

```python
def generate_nude_mask(image_pil):
    # Detecta: shirt, pants, dress, bikini, etc.
    # Combina todas as máscaras
    # Dilata 10px para cobrir bordas
    # Retorna máscara binária PIL
```

**Prompts de detecção:**
- shirt, pants, dress, bikini, underwear, bra, shorts, skirt, jacket

**Processamento:**
- Threshold: 0.5
- Dilatação: 21px (MaxFilter)
- Output: Branco=roupa, Preto=preservar

### 2. Inpainting - Geração Nude

**Modelo:**
- `realvisxlNude_v20.safetensors`
- Base: Stable Diffusion 1.5
- Especializado em nudez realista

**Parâmetros:**
- **Prompt**: "naked, bare skin, detailed nipples, natural breasts, shaved pubic area, soft light, ultra-realistic"
- **Negative**: "clothes, fabric, seams, underwear, text, logo, blurry, extra limbs"
- **Sampler**: DPM++ 2M Karras
- **Steps**: 30
- **CFG**: 7.0
- **Denoising**: 0.75
- **Mode**: inpaint-only-masked

**Otimizações:**
- Redimensiona para 512px (mantém proporção)
- Dimensões múltiplas de 8
- Attention slicing (economiza VRAM)
- XFormers (se disponível)

### 3. Troca de Checkpoint

```python
# Salvar checkpoint atual
checkpoint_original = shared.current_checkpoint

# Carregar modelo nude
shared.pipe.from_single_file("realvisxlNude_v20.safetensors")

# Processar...

# Restaurar checkpoint original
shared.pipe.from_single_file(checkpoint_original)
```

**Importante:**
- Sempre restaurar checkpoint original
- Mesmo em caso de erro (try/finally)
- Não quebrar endpoint /trocar_roupa

## Exemplo de Requisição

### cURL

```bash
curl -X POST \
  http://localhost:5001/despir \
  -F "image=@pessoa.jpg" \
  --output resultado.png
```

### Python

```python
import requests

files = {'image': open('pessoa.jpg', 'rb')}
response = requests.post('http://localhost:5001/despir', files=files)

with open('resultado.png', 'wb') as f:
    f.write(response.content)
```

### JavaScript (Frontend)

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:5001/despir', {
  method: 'POST',
  body: formData
});

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
```

## Performance

### Tempo de Processamento
- CLIPSeg: ~2-3s
- SD Inpainting: ~15-30s (GPU)
- Total: ~20-35s por imagem

### Uso de VRAM
- CLIPSeg: ~1GB
- SD 1.5 Inpainting: ~4-6GB
- Total: ~6-8GB

### Otimizações

```python
# Economizar VRAM
shared.pipe.enable_attention_slicing()
shared.pipe.enable_vae_slicing()

# Acelerar (requer xformers)
shared.pipe.enable_xformers_memory_efficient_attention()

# CPU offload (se VRAM limitada)
shared.pipe.enable_sequential_cpu_offload()
```

## Segurança e CORS

```python
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
    return response
```

## Tratamento de Erros

```python
try:
    # Processar imagem
    result = shared.pipe(...)
    
except torch.cuda.OutOfMemoryError:
    return jsonify({'error': 'GPU sem memória'}), 500
    
except Exception as e:
    # Restaurar checkpoint em caso de erro
    if checkpoint_original:
        shared.pipe.from_single_file(checkpoint_original)
    
    return jsonify({'error': str(e)}), 500
```

## Limitações e Considerações

### Limitações Técnicas
- Máscara pode não detectar roupas muito transparentes
- Resultados dependem da qualidade da imagem
- Poses complexas podem ter artefatos

### Considerações Éticas
- ⚠️ **Conteúdo adulto** - apenas maiores de 18 anos
- ⚠️ **Consentimento** - usar apenas com permissão
- ⚠️ **Privacidade** - não armazenar imagens
- ⚠️ **Legal** - verificar legislação local

### Recomendações
- Implementar autenticação
- Verificar idade do usuário
- Log de requisições
- Rate limiting
- Watermark nas imagens geradas

## Debug

### Visualizar Máscara

```python
# Salvar máscara para debug
mask_pil.save('debug_mask.png')
```

### Logs Detalhados

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Ver processamento
print(f"Imagem: {w}x{h}")
print(f"Checkpoint: {shared.current_checkpoint}")
print(f"VRAM usado: {torch.cuda.memory_allocated() / 1024**3:.2f}GB")
```

### Problemas Comuns

1. **CUDA Out of Memory**
   - Reduzir tamanho da imagem
   - Ativar attention_slicing
   - Usar CPU offload

2. **Máscara vazia**
   - CLIPSeg não detectou roupa
   - Ajustar threshold (0.5 → 0.3)
   - Adicionar mais prompts

3. **Checkpoint não restaura**
   - Verificar caminho do arquivo
   - Usar try/finally
   - Log de erros

## Testes

```bash
# Testar endpoint
python -m pytest tests/test_undress.py

# Benchmark
python benchmark_undress.py
```

## Conclusão

O endpoint `/despir` está pronto para integração. Siga os passos acima e adapte conforme necessário para seu app Flask existente.

**Checklist:**
- [ ] Instalar dependências
- [ ] Baixar modelo realvisxlNude_v20.safetensors
- [ ] Integrar flask_undress.py
- [ ] Carregar CLIPSeg no startup
- [ ] Testar com imagem de exemplo
- [ ] Configurar CORS
- [ ] Implementar rate limiting
- [ ] Adicionar logs

**Pronto para produção!** 🚀

