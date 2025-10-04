"""
Flask endpoint para despir usando Stable Diffusion Inpainting
Adicionar ao app Flask existente que já possui /trocar_roupa
"""

from flask import request, jsonify, send_file
from flask_cors import cross_origin
from PIL import Image, ImageFilter
import io
import torch
from transformers import CLIPSegProcessor, CLIPSegForImageSegmentation
import numpy as np

# Globals (assumindo que já existem no app principal)
# app = Flask(__name__)
# shared = SimpleNamespace()
# shared.pipe = StableDiffusionInpaintPipeline(...)
# current_checkpoint = "modelo_padrao.safetensors"

# Modelo CLIPSeg para segmentação (carregar globalmente)
clipseg_processor = None
clipseg_model = None

def load_clipseg():
    """Carrega CLIPSeg uma única vez"""
    global clipseg_processor, clipseg_model
    if clipseg_processor is None:
        clipseg_processor = CLIPSegProcessor.from_pretrained("CIDAS/clipseg-rd64-refined")
        clipseg_model = CLIPSegForImageSegmentation.from_pretrained("CIDAS/clipseg-rd64-refined")
        if torch.cuda.is_available():
            clipseg_model = clipseg_model.cuda()

def generate_nude_mask(image_pil):
    """
    Segmenta roupas usando CLIPSeg e retorna máscara binária dilatada.
    
    Args:
        image_pil: PIL.Image da pessoa
        
    Returns:
        PIL.Image máscara binária (branco=roupa, preto=preservar)
    """
    load_clipseg()
    
    # Prompts para detectar roupas
    clothing_prompts = ["shirt", "pants", "dress", "bikini", "underwear", "bra", "shorts", "skirt", "jacket"]
    
    # Processar imagem
    inputs = clipseg_processor(
        text=clothing_prompts,
        images=[image_pil] * len(clothing_prompts),
        padding=True,
        return_tensors="pt"
    )
    
    if torch.cuda.is_available():
        inputs = {k: v.cuda() for k, v in inputs.items()}
    
    # Inferência
    with torch.no_grad():
        outputs = clipseg_model(**inputs)
    
    # Combinar todas as máscaras de roupa
    preds = outputs.logits
    mask_combined = torch.sigmoid(preds).max(dim=0)[0]  # Max entre todos os prompts
    
    # Threshold e converter para numpy
    mask_np = (mask_combined.cpu().numpy() > 0.5).astype(np.uint8) * 255
    
    # Resize para tamanho original
    mask_pil = Image.fromarray(mask_np).resize(image_pil.size, Image.LANCZOS)
    
    # Dilatar máscara 10px para cobrir bordas
    mask_pil = mask_pil.filter(ImageFilter.MaxFilter(21))  # 21 = ~10px dilatação
    
    return mask_pil

@app.route('/despir', methods=['POST', 'OPTIONS'])
@cross_origin()
def despir():
    """
    Endpoint para remover roupas de uma imagem.
    
    Recebe:
        multipart file "image"
        
    Retorna:
        PNG 512px com pessoa nua
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    # Validação
    if 'image' not in request.files:
        return jsonify({'error': 'Nenhuma imagem enviada'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'}), 400
    
    try:
        # Carregar imagem
        image_bytes = file.read()
        image_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Redimensionar mantendo proporção (max 512px)
        max_size = 512
        image_pil.thumbnail((max_size, max_size), Image.LANCZOS)
        
        # Garantir dimensões múltiplas de 8 (requirement do SD)
        w, h = image_pil.size
        w = (w // 8) * 8
        h = (h // 8) * 8
        image_pil = image_pil.resize((w, h), Image.LANCZOS)
        
        # Gerar máscara de roupas
        mask_pil = generate_nude_mask(image_pil)
        
        # Salvar checkpoint atual
        checkpoint_original = getattr(shared, 'current_checkpoint', None)
        
        # Carregar checkpoint nude
        nude_checkpoint = "realvisxlNude_v20.safetensors"
        if checkpoint_original != nude_checkpoint:
            shared.pipe.from_single_file(
                nude_checkpoint,
                torch_dtype=torch.float16,
                use_safetensors=True
            )
            shared.current_checkpoint = nude_checkpoint
        
        # Configurar scheduler
        from diffusers import DPMSolverMultistepScheduler
        shared.pipe.scheduler = DPMSolverMultistepScheduler.from_config(
            shared.pipe.scheduler.config,
            algorithm_type="dpmsolver++",
            solver_order=2,
            use_karras_sigmas=True
        )
        
        # Prompts
        prompt = "naked, bare skin, detailed nipples, natural breasts, shaved pubic area, soft light, ultra-realistic"
        negative_prompt = "clothes, fabric, seams, underwear, text, logo, blurry, extra limbs"
        
        # Gerar imagem
        result = shared.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=image_pil,
            mask_image=mask_pil,
            num_inference_steps=30,
            guidance_scale=7.0,
            strength=0.75,  # denoising strength
            generator=torch.Generator(device='cuda' if torch.cuda.is_available() else 'cpu').manual_seed(42)
        )
        
        output_image = result.images[0]
        
        # Restaurar checkpoint original
        if checkpoint_original and checkpoint_original != nude_checkpoint:
            shared.pipe.from_single_file(
                checkpoint_original,
                torch_dtype=torch.float16,
                use_safetensors=True
            )
            shared.current_checkpoint = checkpoint_original
        
        # Converter para PNG
        img_io = io.BytesIO()
        output_image.save(img_io, 'PNG', quality=95)
        img_io.seek(0)
        
        return send_file(
            img_io,
            mimetype='image/png',
            as_attachment=False,
            download_name='undressed.png'
        )
        
    except Exception as e:
        # Restaurar checkpoint em caso de erro
        if checkpoint_original and hasattr(shared, 'current_checkpoint'):
            try:
                shared.pipe.from_single_file(
                    checkpoint_original,
                    torch_dtype=torch.float16,
                    use_safetensors=True
                )
                shared.current_checkpoint = checkpoint_original
            except:
                pass
        
        return jsonify({'error': f'Erro ao processar: {str(e)}'}), 500

# Adicionar CORS headers globalmente (se não existir)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

