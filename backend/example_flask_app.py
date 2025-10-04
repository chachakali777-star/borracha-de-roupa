"""
Exemplo de como integrar o endpoint /despir no app Flask existente
"""

from flask import Flask
from flask_cors import CORS
from types import SimpleNamespace
import torch
from diffusers import StableDiffusionInpaintPipeline

# Criar app
app = Flask(__name__)
CORS(app)

# Namespace compartilhado
shared = SimpleNamespace()
shared.current_checkpoint = "default_model.safetensors"

# Carregar pipeline SD Inpainting (apenas uma vez no startup)
def initialize_pipeline():
    """Inicializa o pipeline compartilhado"""
    model_path = "runwayml/stable-diffusion-inpainting"  # ou caminho local
    
    shared.pipe = StableDiffusionInpaintPipeline.from_pretrained(
        model_path,
        torch_dtype=torch.float16,
        safety_checker=None,  # Remover safety checker para conteúdo adulto
        requires_safety_checker=False
    )
    
    if torch.cuda.is_available():
        shared.pipe = shared.pipe.to("cuda")
        shared.pipe.enable_attention_slicing()  # Economizar VRAM
        # shared.pipe.enable_xformers_memory_efficient_attention()  # Se xformers instalado
    
    print("Pipeline inicializado com sucesso!")

# Rota existente (exemplo)
@app.route('/trocar_roupa', methods=['POST'])
def trocar_roupa():
    """Endpoint existente para trocar roupa"""
    # ... código existente ...
    return "Endpoint trocar_roupa"

# Importar e adicionar endpoint /despir
# NOTA: Copie o conteúdo de flask_undress.py aqui ou importe
from flask_undress import despir, load_clipseg

if __name__ == '__main__':
    print("Inicializando pipeline Stable Diffusion...")
    initialize_pipeline()
    
    print("Carregando modelo CLIPSeg...")
    load_clipseg()
    
    print("Servidor Flask iniciado!")
    print("Endpoints disponíveis:")
    print("  POST /trocar_roupa - Trocar roupas")
    print("  POST /despir - Remover roupas")
    
    app.run(host='0.0.0.0', port=5001, debug=False)

